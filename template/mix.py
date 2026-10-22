# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy", "scipy", "soundfile", "pyloudnorm"]
# ///
"""Synthesize the native sound method, then map the selected source windows."""
from pathlib import Path,PurePosixPath,PureWindowsPath
import argparse,json,subprocess,importlib.util,sys,hashlib,copy,uuid
from audio_integrity import require_signal,verify_mix
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import resample_poly
from scipy.ndimage import uniform_filter1d
sys.dont_write_bytecode=True
def bound_media_path(root,value):
 # Serialized instance bindings are relative package URLs, never native absolute paths.
 p=PurePosixPath(value.replace('\\','/'))
 if p.is_absolute()or PureWindowsPath(value).drive or '..'in p.parts:raise ValueError('Prepared audio path must stay inside its instance')
 return root.joinpath(*p.parts)
def main():
 p=argparse.ArgumentParser();p.add_argument('--instance',type=Path,required=True);p.add_argument('--silent-video',type=Path,required=True);a=p.parse_args();r=a.instance;s=json.loads((r/'settings.json').read_text(encoding='utf-8'));data=json.loads((r/'audio-events.json').read_text(encoding='utf-8'));sr=48000;n=round(s['duration']*sr)
 def decode(q):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(q),'-ar',str(sr),'-ac','2','-c:a','pcm_f64le','-f','f64le','-']),np.float64).reshape(-1,2).astype(np.float64)
 meter=pyln.Meter(sr)
 def norm(y,db):
  value=meter.integrated_loudness(y);return y*10**((db-value)/20)if np.isfinite(value)else y
 native=np.zeros((n,2));punct=np.zeros((n,2));events=[]
 if s['soundEffects']=='native':
  spec=importlib.util.spec_from_file_location('kinetic_audio',r/'native_audiolib.py');A=importlib.util.module_from_spec(spec);spec.loader.exec_module(A);A.init(data['sourceEnd']);length=round(s['duration']*A.SR);dry=np.zeros((length,2));fx=np.zeros((length,2))
  owners=data.get('sfxOwners',[]);calls=data.get('sfxCalls',[]);actual=json.loads((r/'runtime-events.json').read_text(encoding='utf-8'))
  if len(owners)!=len(data['sfx'])or len(calls)!=len(data['sfx']):raise ValueError('Source effect ownership metadata has not been verified')
  live={key:(cue,owner)for key,cue,owner in zip(actual['sfxCalls'],actual['native'],actual['sfxOwners'])}
  b2_card_keys=[key for key,(cue,owner)in live.items()if owner=='B2'and 'B2.card'in key]
  def selected_event(span,owner,key):return not(owner=='B2'and key in b2_card_keys and b2_card_keys.index(key)>=len(span.get('basic',{}).get('points',[])))
  def narration_effect_time(span,owner,key,original):
   if s.get('narrationVisualMode')!='follow-speech':return original
   target=None
   if owner=='B2'and key in b2_card_keys:target='points.'+str(b2_card_keys.index(key))
   if owner=='B3'and key:
    if 'B3.left'in key:target='left'
    elif 'B3.right'in key:target='right'
    elif 'B3.detail'in key:target='conclusion'
   if owner=='B4'and key and 'B4.action'in key:target='action'
   beats=span.get('narrationBeats',[])
   matched=[b['at']for b in beats if b.get('target')==target]if target else[]
   if not matched and owner=='B3'and target in['left','right']:matched=[b['at']for b in beats if b.get('target')in['heading','headline']]
   # Native entry remains a lower bound; don't play a reveal effect before the
   # source object can be visible. The source clock itself is never rewritten.
   if s.get('creationProfile')=='narrated-story/1'and matched:return max(span['outputStart'],min(matched))
   return max(original,min(matched))if matched else original
  punctuationOwners=['A','B','C','S10','S12','S14','F','END'];riserOwners=['A','B','C','S10','S14','F','END']
  def place_sample(buf,sample,t,owner,gain,key=None):
   for span in s['plan']:
    if owner in span['activeUnits'] and t < span['sourceEnd'] - 1e-7 and selected_event(span,owner,key):
     # Carry the sample and its reverb tail across the next selected scene.
     # At the movie boundary, the source excerpt is intentionally trimmed.
     extra=span['outputEnd']-span['outputStart']-(span['sourceEnd']-span['sourceStart']);shift=extra if span.get('holdAt')is not None and t>=span['holdAt']else 0
     A.add(buf,sample,narration_effect_time(span,owner,key,span['outputStart']+t-span['sourceStart']+shift),gain)
  for i,row in enumerate(data['punctuation']):
   typ=row['source'].split('/')[-1]
   if typ in['crash_cym','final-crash']:sample=A.crash_cym(.6)if row.get('g')==.5 else A.crash_cym()
   elif typ=='sub_drop':sample=A.sub_drop(row['d'],.55)
   elif typ=='riser':sample=A.riser(row['d'],.12)
   else:raise ValueError('Unmapped source punctuation: '+typ)
   owner=punctuationOwners[i//2]if i<16 else riserOwners[i-16]if i<23 else'END'
   place_sample(fx,A.pan(sample,0),row['t'],owner,row['g'])
  missing={e['type']for e in data['sfx']}-A.GEN.keys()
  if missing:raise ValueError('Unsupported source SFX: '+str(missing))
  def event_rows(cue,owner,key,origin='source'):
   for span in s['plan']:
    if owner not in span['activeUnits'] or cue['t'] >= span['sourceEnd']-1e-7 or not selected_event(span,owner,key):continue
    extra=span['outputEnd']-span['outputStart']-(span['sourceEnd']-span['sourceStart']);shift=extra if span.get('holdAt')is not None and cue['t']>=span['holdAt']else 0
    yield {'source':cue,'owner':owner,'call':key,'origin':origin,'outputTime':narration_effect_time(span,owner,key,span['outputStart']+cue['t']-span['sourceStart']+shift)}
  for reference,owner,key in zip(data['sfx'],owners,calls):
   # Generate every source sample in source order, preserving the seeded RNG.
   cue=live[key][0]if key in live else reference;sample=A.pan(A.GEN[cue['type']](cue),cue.get('p',0))
   if key in live:
    place_sample(dry,sample,cue['t'],owner,cue.get('g',1),key);events.extend(event_rows(cue,owner,key))
  reverbState=copy.deepcopy(A.rng.bit_generator.state)
  for key,(cue,owner)in live.items():
   if key in calls:continue
   if owner not in['B1','B2','B3','B4']:raise ValueError('Unverified additional source effect call: '+key)
   # New expressions use the native generator with an independent stable seed.
   A.rng=np.random.default_rng(int(hashlib.sha256(key.encode()).hexdigest()[:16],16));sample=A.pan(A.GEN[cue['type']](cue),cue.get('p',0));place_sample(dry,sample,cue['t'],owner,cue.get('g',1),key);events.extend(event_rows(cue,owner,key,'new expression'))
  A.rng.bit_generator.state=reverbState
  native=resample_poly(A.reverb(dry,.9,.1),160,147,axis=0)[:n];punct=resample_poly(fx,160,147,axis=0)[:n]
  native=norm(native,-25);punct=norm(punct,-28)
 voice=np.zeros((n,2));music=np.zeros((n,2));audio_inputs={}
 for role in['voice','music']:
  asset=s['media'][role]
  if asset['mode']=='file':
   audio_inputs[role]=require_signal(bound_media_path(r,asset['file']),role=role)
   binding=json.loads((r/'binding-report.json').read_text());expected=binding.get('boundAudioFiles',{}).get(asset['file'])
   if expected and hashlib.sha256(bound_media_path(r,asset['file']).read_bytes()).hexdigest()!=expected:raise ValueError('Prepared audio changed; prepare a new instance')
   track=decode(bound_media_path(r,asset['file']))[:n]
   if len(track)!=n:raise ValueError('Audio track is shorter than the output clock')
   if role=='voice':voice=norm(track,-16)
   else:music=norm(track,-23)
 if np.any(voice):
  mono=np.sqrt(np.mean(voice*voice,axis=1));energy=np.sqrt(np.maximum(0,uniform_filter1d(mono*mono,size=round(.04*sr))));gate=(energy>.007).astype(float);gate=uniform_filter1d(gate,size=round(.25*sr));music*=10**(-11*np.clip(gate*2,0,1)/20)[:,None]
 full=voice+music+native+punct;fade=min(round(.6*sr),n);full[-fade:]*=np.linspace(1,0,fade)[:,None]**1.3;full=norm(full,-17 if np.any(voice)else -21)
 audio=r/'audio-output';audio.mkdir(exist_ok=True);raw=audio/'prelimit.wav';mix=audio/'mix.wav'
 if raw.exists()or mix.exists():raise ValueError('Preserve existing audio output')
 sf.write(audio/'voice.wav',voice,sr,subtype='DOUBLE');sf.write(audio/'native-sfx.wav',native,sr,subtype='FLOAT');sf.write(audio/'punctuation.wav',punct,sr,subtype='FLOAT')
 sf.write(raw,full,sr,subtype='FLOAT');subprocess.run(['ffmpeg','-v','error','-n','-i',str(raw),'-af','aresample=192000,alimiter=limit=0.65:level=false:latency=true:attack=5:release=100,aresample=48000','-c:a','pcm_s24le',str(mix)],check=True)
 final=a.silent_video.with_name(a.silent_video.stem+'-with-audio.mp4')
 if final.exists():raise ValueError('Preserve the existing final video')
 pending=final.with_name(final.stem+'-pending-'+uuid.uuid4().hex+'.mp4')
 try:
  subprocess.run(['ffmpeg','-v','error','-n','-i',str(a.silent_video),'-i',str(mix),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-movflags','+faststart',str(pending)],check=True)
  encoded_check=verify_mix(mix,pending)
  (audio/'audio-integrity.json').write_text(json.dumps({'profile':'motiongit.audio-integrity/1','inputs':audio_inputs,'encodedMix':encoded_check,'voiceStemHasSignal':bool(np.any(voice)),'voiceStemRms':float(np.sqrt(np.mean(voice*voice))),'sourceNarrationNotRetimed':True},ensure_ascii=False,indent=2)+'\n')
  pending.rename(final)
 finally:pending.unlink(missing_ok=True)
 (audio/'mix-report.json').write_text(json.dumps({'normalConsumerEntry':True,'sourceSFX':len(data['sfx']),'selectedEvents':len(events),'sourcePunctuation':len(data['punctuation']),'sfxPolicy':s['soundEffects'],'voice':s['media']['voice']['mode'],'music':s['media']['music']['mode'],'video':str(final.name),'waveformEquivalence':'not asserted; synthesized source recipe','crossSceneTails':'sample ownership remapped, then shared reverb on the complete output; ordinary cut does not slice the SFX stem','movieBoundary':'trimmed at explicit movie end; negative source pre-roll is clipped at movie start','events':events,'audioIntegrity':encoded_check,'inputAudioChecks':audio_inputs,'coverageComplete':False},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 raw.unlink()
 print(json.dumps({'video':str(final),'frames':round(s['duration']*60),'normalConsumerEntry':True},ensure_ascii=False))
if __name__=='__main__':main()
