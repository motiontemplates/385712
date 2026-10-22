"""Whole-narration validation, separate from any single authored scene window."""
from pathlib import Path
import json,math,re,subprocess

PROFILE='motiongit.whole-narration/1'
class RecomposeRequired(ValueError):pass
def reject(reason):
 raise RecomposeRequired('RECOMPOSE_REQUIRED: '+reason+'. Preserve the complete narration. Re-segment at actual sentence/phrase boundaries, combine compatible scenes in this template style, and rebind cues. A scene capacity is not a whole-film maximum. Do not shorten, accelerate or omit narration without the user explicitly requesting that edit.')
def seconds(value):
 return float(value)if isinstance(value,(int,float))and not isinstance(value,bool)and math.isfinite(value)and value>=0 else None
def caption_end(file):
 text=file.read_text(encoding='utf-8-sig')
 if file.suffix.lower()=='.srt':
  stamps=re.findall(r'-->\s*(\d+):(\d{2}):(\d{2})[,.](\d{3})',text)
  return max((int(h)*3600+int(m)*60+int(s)+int(ms)/1000 for h,m,s,ms in stamps),default=None)
 data=json.loads(text)
 if isinstance(data,dict):data=data.get('captions',data.get('cues',data.get('segments',[])))
 if not isinstance(data,list):return None
 ends=[seconds(row.get('end',row.get('b')))for row in data if isinstance(row,dict)]
 return max((v for v in ends if v is not None),default=None)
def resolve(root,value):
 if not isinstance(value,str)or not value or value.startswith('@'):return None
 p=Path(value);p=p if p.is_absolute()else root/p
 if p.is_symlink()or not p.is_file():return None
 if not Path(value).is_absolute()and not p.resolve().is_relative_to(root.resolve()):return None
 return p
def validate(params,inputs=None):
 """Validate existing parameter shapes without adding a forced user workflow."""
 if not isinstance(params,dict):return {'profile':PROFILE,'checked':False}
 fps=60;brief=params.get('brief',params);timeline=params.get('timeline',params)
 declared=seconds(brief.get('narrationDuration'))if isinstance(brief,dict)else None
 segments=brief.get('segments')if isinstance(brief,dict)else None
 routes=[]
 if segments and all(isinstance(x,dict)and isinstance(x.get('durationFrames'),int)for x in segments):
  routes.append(('native-segments',sum(x['durationFrames']for x in segments)/fps))
 if isinstance(brief,dict):
  for route in brief.get('segmentations',[]):
   rows=route.get('segments',[])
   if rows and all(isinstance(x,dict)and isinstance(x.get('durationFrames'),int)for x in rows):routes.append((str(route.get('id','alternative')),sum(x['durationFrames']for x in rows)/fps))
 if isinstance(timeline,dict)and seconds(timeline.get('duration'))is not None:routes.append(('timeline',float(timeline['duration'])))
 for name,duration in routes:
  if declared is not None and round(duration*fps)!=round(declared*fps):reject(f'{name} covers {duration:.3f}s but the full declared narration is {declared:.3f}s')
 if isinstance(timeline,dict)and isinstance(timeline.get('segments'),list):
  rows=timeline['segments']
  if rows and all(isinstance(x,dict)and seconds(x.get('t0'))is not None and seconds(x.get('t1'))is not None for x in rows):
   cursor=0
   for row in rows:
    if abs(row['t0']-cursor)>1/fps or row['t1']<=row['t0']:reject('The film timeline has an uncovered or overlapping narration interval')
    cursor=row['t1']
   if seconds(timeline.get('duration'))is not None and abs(cursor-timeline['duration'])>1/fps:reject('The final scene does not reach the declared film end')
 measured=[]
 selection=timeline.get('narrationRange')if isinstance(timeline,dict)else None
 source_start=seconds(timeline.get('sourceStart',0))or 0 if isinstance(timeline,dict)else 0
 if selection is not None:
  if not isinstance(selection,dict)or seconds(selection.get('start'))is None or seconds(selection.get('end'))is None or selection['end']<=selection['start']:reject('The explicit narration range is invalid')
  source_start=selection['start']
 for owner in ([params,timeline]if timeline is not params else[params]):
  if isinstance(owner,dict)and isinstance(owner.get('captions'),list):
   ends=[seconds(row.get('end',row.get('b',row.get('t1'))))for row in owner['captions']if isinstance(row,dict)]
   values=[x for x in ends if x is not None]
   if values:measured.append(('captions',max(values)))
 if inputs is not None:
  root=Path(inputs);media=params.get('media',{})
  for owner,key in [(timeline,'subtitles'),(timeline,'srt'),(params,'captions'),(params,'srt'),(media,'captions'),(media,'subtitles')]:
   file=resolve(root,owner.get(key))if isinstance(owner,dict)else None
   if file and file.suffix.lower()in{'.srt','.json'}:
    end=caption_end(file)
    if end is not None:measured.append(('captions',max(0,(min(end,selection['end'])if selection else end)-source_start)))
  voice=timeline.get('voiceover')if isinstance(timeline,dict)else None
  if not voice and isinstance(media.get('voice'),dict)and media['voice'].get('mode')=='file':voice=media['voice'].get('file')
  # An explicitly supplied standalone voice track is the whole source. Music
  # and source presenter videos are never misclassified as narration duration.
  file=resolve(root,voice)
  if file:
   probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(file)],capture_output=True,text=True)
   if probe.returncode==0:
    value=seconds(float(json.loads(probe.stdout)['format']['duration']))
    if value is not None:
     if selection and selection['end']>value+1/fps:reject('The explicit narration range exceeds the supplied voice track')
     measured.append(('voiceover',selection['end']-selection['start']if selection else max(0,value-source_start)))
 for source,end in measured:
  for name,duration in routes:
   if duration+1/fps<end:reject(f'{name} ends at {duration:.3f}s before the supplied {source} ends at {end:.3f}s')
  if declared is not None and declared+1/fps<end:reject(f'narrationDuration was reduced to {declared:.3f}s while the supplied {source} reaches {end:.3f}s')
 return {'profile':PROFILE,'checked':True,'declaredNarrationSeconds':declared,'routes':[{'id':n,'durationSeconds':t}for n,t in routes],'sourceEnds':[{'source':n,'seconds':t}for n,t in measured],'singleSceneLimitIsFilmLimit':False,'defaultAction':'recompose-with-complete-narration'}
