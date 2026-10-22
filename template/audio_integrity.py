"""Measure decoded audio, preserve embedded source sound, and verify encoded mixes.

This detects missing/digital-silent audio and a changed encoded mix. It does not
identify speech, infer the user's mute intent, or substitute for listening.
Only the Python standard library and the renderer's existing FFmpeg are used.
"""
from pathlib import Path
import argparse,array,hashlib,json,math,subprocess,sys,tempfile

RATE=16000
CHANNELS=2
PROFILE='motiongit.audio-integrity/1'
class AudioIntegrityError(ValueError):pass
def _motiongit_command_detail(result):
    # MOTIONGIT_CAPTURED_TOOL_DETAILS_V1: only failed-tool diagnostics change.
    value = getattr(result, 'stderr', None) or getattr(result, 'stdout', None) or ''
    if isinstance(value, bytes):
        value = value.decode('utf-8', errors='replace')
    return str(value).strip()[-6000:]


def _fail(code,message):raise AudioIntegrityError(code+': '+message)
def probe(path):
 p=Path(path)
 if not p.is_file():_fail('AUDIO_INPUT_MISSING','The bound audio file is missing; restore the real source before rendering')
 r=subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)],capture_output=True,text=True, encoding='utf-8', errors='replace')
 if r.returncode:_fail('AUDIO_PROBE_FAILED',('The bound media could not be probed') + "\n" + _motiongit_command_detail(r))
 data=json.loads(r.stdout);stream=next((s for s in data.get('streams',[])if s.get('codec_type')=='audio'),None)
 return data,stream
def source_clock(path):
 data,audio=probe(path);video=next((s for s in data.get('streams',[])if s.get('codec_type')=='video'),None)
 def number(value,default=0.):
  try:v=float(value)
  except (TypeError,ValueError):return default
  return v if math.isfinite(v)else default
 origin=number(data.get('format',{}).get('start_time'));container_duration=number(data.get('format',{}).get('duration'))
 def clock(stream):
  if not stream:return None
  offset=max(0.,number(stream.get('start_time'),origin)-origin)
  duration=number(stream.get('duration'),-1)
  if duration<0:
   # Matroska's format.duration can be an absolute end timestamp when a
   # nonzero origin was muxed. Read actual packet ends instead of treating
   # that field as a relative per-stream duration or adding the offset twice.
   r=subprocess.run(['ffprobe','-v','error','-select_streams',str(stream['index']),'-show_entries','packet=pts_time,duration_time','-of','csv=p=0',str(Path(path))],capture_output=True,text=True, encoding='utf-8', errors='replace')
   if r.returncode:_fail('AUDIO_CLOCK_PROBE_FAILED',('Could not read source packet timestamps') + "\n" + _motiongit_command_detail(r))
   ends=[]
   for line in r.stdout.splitlines():
    columns=line.split(',')
    if len(columns)>=2:
     pts=number(columns[0],math.nan);length=number(columns[1])
     if math.isfinite(pts):ends.append(pts+length-origin)
   if not ends:_fail('AUDIO_CLOCK_EMPTY','Source stream has no measurable packet timestamps')
   duration=max(0.,max(ends)-offset)
  return {'offsetSeconds':offset,'streamDurationSeconds':duration,'endSeconds':offset+duration,'timeBase':stream.get('time_base'),'startPts':stream.get('start_pts')}
 v=clock(video);a=clock(audio)
 return {'profile':'motiongit.source-clock/1','containerStartSeconds':origin,'video':v,'audio':a,'videoNominalRate':video.get('r_frame_rate')if video else None,'videoAverageRate':video.get('avg_frame_rate')if video else None,'timelineEndSeconds':max([x['endSeconds']for x in[v,a]if x]or[container_duration]),'policy':'One source container origin for video and audio; resample video at timestamps, preserve audio lead-in and gaps without tempo changes'}
def _chunks(path,start=0,duration=None,*,rate=RATE,channels=CHANNELS):
 if not math.isfinite(start)or start<0 or duration is not None and(not math.isfinite(duration)or duration<=0):_fail('AUDIO_RANGE_INVALID','Use a valid explicit audio range')
 command=['ffmpeg','-v','error','-nostdin','-copyts','-start_at_zero','-i',str(Path(path))]
 filters=f'aresample={rate}:async=1:first_pts=0:max_soft_comp=0:min_hard_comp=0.001'
 if start or duration is not None:filters+=',atrim=start='+str(start)+((':duration='+str(duration))if duration is not None else'')+',asetpts=PTS-STARTPTS'
 command+=['-map','0:a:0','-vn','-sn','-dn','-af',filters,'-ar',str(rate),'-ac',str(channels),'-c:a','pcm_f64le','-f','f64le','pipe:1']
 with tempfile.TemporaryFile()as errors:
  process=subprocess.Popen(command,stdout=subprocess.PIPE,stderr=errors)
  try:
   carry=b''
   while True:
    block=process.stdout.read(65536)
    if not block:break
    block=carry+block;end=len(block)//8*8;carry=block[end:];values=array.array('d');values.frombytes(block[:end])
    if sys.byteorder!='little':values.byteswap()
    yield values
   if carry or process.wait()!=0:_fail('AUDIO_DECODE_FAILED','The bound audio did not decode completely; restore or re-extract the original source')
  finally:
   process.stdout.close()
   if process.poll()is None:process.kill();process.wait()
def measure(path,*,start=0,duration=None,allow_missing=False):
 data,stream=probe(path)
 if stream is None:
  if allow_missing:return {'profile':PROFILE,'audioStream':False,'samples':0,'durationSeconds':0,'digitalSilence':True}
  _fail('AUDIO_STREAM_MISSING','The supplied narration/music has no audio stream; do not replace it with scene effects')
 # Keep the source rate and every source channel for silence classification.
 # Downmixing anti-phase channels or narrowing tiny floats must not invent silence.
 rate=int(stream.get('sample_rate',RATE));channels=int(stream.get('channels',1))
 count=0;peak=0.;power=0.;nonzero=0
 for values in _chunks(path,start,duration,rate=rate,channels=channels):
  if any(not math.isfinite(v)for v in values):_fail('AUDIO_NONFINITE_INPUT','Decoded audio contains invalid samples')
  count+=len(values);peak=max(peak,max(map(abs,values),default=0));power+=math.fsum(v*v for v in values);nonzero+=sum(v!=0 for v in values)
 rms=math.sqrt(power/count)if count else 0
 return {'profile':PROFILE,'audioStream':True,'codec':stream.get('codec_name'),'sourceSampleFormat':stream.get('sample_fmt'),'sourceSampleRate':rate,'sourceChannels':channels,'decodedRate':rate,'decodedChannels':channels,'decodedFormat':'float64','samples':count,'frames':count//channels,'durationSeconds':count/(channels*rate),'selectionStartSeconds':start,'peak':peak,'rms':rms,'peakDbfs':20*math.log10(peak)if peak else None,'rmsDbfs':20*math.log10(rms)if rms else None,'nonzeroSamples':nonzero,'digitalSilence':not nonzero,'review':'very-low-level; listen before delivery'if peak and peak<1e-5 else'listen to the final encoded narration and music; sample metrics do not identify speech'}
def require_signal(path,*,role='narration',start=0,duration=None):
 report=measure(path,start=start,duration=duration)
 if not report['samples']:_fail('AUDIO_EMPTY_INPUT',role+' decodes to no samples; restore the source audio')
 if report['digitalSilence']:_fail('AUDIO_SILENT_INPUT',role+' is digital silence despite having a stream and duration. Reuse/re-extract the original source with FFmpeg; do not cast normalized floats directly to int16, and do not deliver scene effects as narration. Use explicit mute only when the user requested silence')
 return report
def extract(source,destination,*,duration=None,start=0):
 source_sha=hashlib.sha256(Path(source).read_bytes()).hexdigest()
 before=require_signal(source,role='original source audio');destination=Path(destination)
 if destination.exists():_fail('AUDIO_OUTPUT_EXISTS','Preserve the previous audio; choose a fresh output')
 destination.parent.mkdir(parents=True,exist_ok=True)
 command=['ffmpeg','-v','error','-nostdin','-n','-copyts','-start_at_zero','-i',str(Path(source)),'-map','0:a:0','-vn','-sn','-dn','-ar','48000','-ac','2']
 filters='aresample=48000:async=1:first_pts=0:max_soft_comp=0:min_hard_comp=0.001'
 if start or duration is not None:filters+=(',apad'if duration is not None else'')+',atrim=start='+str(start)+((':duration='+str(duration))if duration is not None else'')+',asetpts=PTS-STARTPTS'
 command+=['-af',filters]
 if duration is not None:command+=['-t',str(duration)]
 command+=['-c:a','pcm_f64le',str(destination)]
 try:
  r=subprocess.run(command,capture_output=True)
  if r.returncode:_fail('AUDIO_EXTRACTION_FAILED',('FFmpeg could not extract the original presenter audio') + "\n" + _motiongit_command_detail(r))
  after=require_signal(destination,role='extracted presenter audio')
  if hashlib.sha256(Path(source).read_bytes()).hexdigest()!=source_sha:_fail('AUDIO_SOURCE_CHANGED','The original source changed during extraction; prepare a fresh instance')
 except Exception:
  destination.unlink(missing_ok=True);raise
 return {'profile':PROFILE,'source':before,'sourceSha256':source_sha,'sourceClock':source_clock(source),'extracted':after,'selection':{'start':start,'duration':duration},'conversion':'FFmpeg lossless float64 PCM, common container origin and hard gap fill; no tempo filter or direct float-to-int cast','sha256':hashlib.sha256(destination.read_bytes()).hexdigest()}
def verify_mix(expected,encoded):
 # Both streams use the same deterministic PCM decode. No audio is written or retimed.
 left=_chunks(expected);right=_chunks(encoded);ia=ib=0;dot=aa=bb=error=0.;compared=0;count_a=count_b=0
 try:
  a=next(left,None);b=next(right,None)
  while a is not None or b is not None:
   if a is None:
    count_b+=len(b)-ib;b=next(right,None);ib=0;continue
   if b is None:
    count_a+=len(a)-ia;a=next(left,None);ia=0;continue
   n=min(len(a)-ia,len(b)-ib);xs=a[ia:ia+n];ys=b[ib:ib+n]
   if any(not math.isfinite(v)for v in xs)or any(not math.isfinite(v)for v in ys):_fail('AUDIO_NONFINITE_OUTPUT','The expected or encoded mix contains invalid samples')
   dot+=math.fsum(x*y for x,y in zip(xs,ys));aa+=math.fsum(x*x for x in xs);bb+=math.fsum(y*y for y in ys);error+=math.fsum((x-y)**2 for x,y in zip(xs,ys));compared+=n;count_a+=n;count_b+=n;ia+=n;ib+=n
   if ia==len(a):a=next(left,None);ia=0
   if ib==len(b):b=next(right,None);ib=0
  if not compared:_fail('AUDIO_ENCODE_EMPTY','Final encoded audio is missing')
  correlation=dot/math.sqrt(aa*bb)if aa and bb else 1. if not aa and not bb else 0.
  relative_error=math.sqrt(error/aa)if aa else 0. if not bb else math.inf
  tail=abs(count_a-count_b)/(RATE*CHANNELS)
  passed=tail<=.05 and correlation>=.98 and relative_error<=.25
  report={'profile':PROFILE,'passed':passed,'expectedFrames':count_a//CHANNELS,'encodedFrames':count_b//CHANNELS,'comparedFrames':compared//CHANNELS,'decodedRate':RATE,'durationDifferenceSeconds':tail,'cosineSimilarity':correlation,'normalizedRmsError':relative_error if math.isfinite(relative_error)else None,'expectedHasSignal':bool(aa),'encodedHasSignal':bool(bb),'method':'Compare final AAC/container decode with the actual pre-encode mix; input voice is separately checked before mixing','limits':'This verifies mix retention, not speech intelligibility or source attribution by audio recognition'}
  if not passed:_fail('AUDIO_ENCODE_MISMATCH','The final encoded audio does not match the expected mix; check missing/muted voice, wrong audio mapping or a truncated track. '+json.dumps(report,separators=(',',':')))
  return report
 finally:left.close();right.close()
def main():
 p=argparse.ArgumentParser();sub=p.add_subparsers(dest='command',required=True)
 m=sub.add_parser('measure');m.add_argument('file',type=Path);m.add_argument('--role',default='bound audio');m.add_argument('--start',type=float,default=0);m.add_argument('--duration',type=float);m.add_argument('--allow-silent',action='store_true');m.add_argument('--allow-missing',action='store_true')
 e=sub.add_parser('extract');e.add_argument('source',type=Path);e.add_argument('out',type=Path);e.add_argument('--duration',type=float);e.add_argument('--start',type=float,default=0)
 c=sub.add_parser('clock');c.add_argument('file',type=Path)
 v=sub.add_parser('verify-mix');v.add_argument('expected',type=Path);v.add_argument('encoded',type=Path)
 args=p.parse_args()
 try:
  if args.command=='measure':result=measure(args.file,start=args.start,duration=args.duration,allow_missing=args.allow_missing)if args.allow_silent or args.allow_missing else require_signal(args.file,role=args.role,start=args.start,duration=args.duration)
  elif args.command=='extract':result=extract(args.source,args.out,duration=args.duration,start=args.start)
  elif args.command=='clock':result=source_clock(args.file)
  else:result=verify_mix(args.expected,args.encoded)
 except AudioIntegrityError as error:raise SystemExit(str(error))
 print(json.dumps(result,ensure_ascii=False,allow_nan=False))
if __name__=='__main__':main()
