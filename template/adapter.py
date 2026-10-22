# /// script
# requires-python = ">=3.11"
# dependencies = ["numpy", "scipy", "soundfile", "pyloudnorm", "jsonschema", "opencv-python-headless==4.12.0.88"]
# ///
"""Native kinetic source adapter; required content is always explicit."""
from kinetic_story import compile_input, bind_visuals, media_usage
from pathlib import Path
import argparse,json,hashlib,math,re,shutil,subprocess,sys
from jsonschema import Draft202012Validator
from presenter_face import approximate_face
from audio_integrity import require_signal,measure,source_clock,extract
from narration_alignment import validate as validate_narration_map,RESTRICTED
from timing_evidence import validate as validate_timing_evidence,retain as retain_timing_evidence
from duration_policy import validate as validate_whole_narration
ROOT=Path(__file__).resolve().parent;CORE=ROOT/'core'
def read(p):return json.loads(Path(p).read_text(encoding='utf-8'))
def save(p,o):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def sha(p):
 with Path(p).open('rb')as f:return hashlib.file_digest(f,'sha256').hexdigest()
def digest():
 # This candidate identity is explicitly separate from the platform's signed manifest digest.
 rows={n:sha(ROOT/n)for n in sorted(read(ROOT/'integrity.json')['files'])if n!='content-boundary.json'}
 rows['integrity.json']=sha(ROOT/'integrity.json')
 return hashlib.sha256(json.dumps(rows,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def media_path(root,value):
 if not isinstance(value,str)or not value:raise ValueError('needs-binding: media file')
 q=Path(value);raw=q if q.is_absolute()else root/q;p=raw.resolve()
 if raw.is_symlink()or not p.is_file():raise ValueError('Missing media or symlink: '+value)
 if not q.is_absolute()and not p.is_relative_to(root):raise ValueError('Relative media escapes the input directory')
 return p
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
def spec(p):
 data=probe(p);s=next((s for s in data['streams']if s['codec_type']=='video'),None)
 if not s:raise ValueError('Visual input has no video/image stream')
 if s.get('color_transfer')in['smpte2084','arib-std-b67']or any('DOVI'in str(v)for v in s.get('side_data_list',[])):raise ValueError('HDR input requires an explicit color-converted source')
 if s.get('sample_aspect_ratio','1:1')not in['1:1','0:1','N/A']:raise ValueError('Non-square pixels require explicit preprocessing')
 w,h=s['width'],s['height'];rotation=next((v.get('rotation',0)for v in s.get('side_data_list',[])if'rotation'in v),0)
 if abs(rotation)%180==90:w,h=h,w
 return w,h,float(data['format'].get('duration',0))
def plan(input_file):
 source=input_file.resolve();d=read(source);root=source.parent;validate_whole_narration(d,root);catalog=read(CORE/'catalog.json');groups={g['id']:g for g in catalog['groups']};schema=read(CORE/'content.schema.json')['fields']
 errors=sorted(Draft202012Validator(read(ROOT/'params.schema.json')).iter_errors(d),key=lambda e:str(list(e.path)))
 if errors:raise ValueError('Invalid input: '+str(list(errors[0].path))+' '+errors[0].message)
 d=compile_input(d,catalog,root)
 # kinetic-portrait-composition/2: apply the actual portrait arrangement to new basic narration.
 composition=d.get('portraitComposition','presenter-caption/2')
 if composition not in ('presenter-caption/2','legacy'):raise ValueError('PORTRAIT_COMPOSITION: unknown layout')
 basic_portrait=d.get('layout')=='portrait' and any(s.get('id')in ('B1','B2','B3','B4')for s in d.get('scenes',[])) and d.get('media',{}).get('presenter',{}).get('mode')!='none'
 if basic_portrait and composition!='legacy' and d.get('captionSafeArea')=='frame':raise ValueError('PORTRAIT_COMPOSITION: repaired basic narration keeps short-video caption checks; frame is only available with explicit legacy replay')
 if d.get('mode')!='user-media':raise ValueError('Use user-media; no demo fallback exists')
 if d.get('language')not in['zh','en']:raise ValueError('Choose zh or en')
 if d.get('layout')not in['landscape','portrait']:raise ValueError('Choose landscape or portrait')
 if d['layout']=='portrait'and d['language']=='en'and any(item.get('id')not in ['B1','B2','B3','B4']for item in d.get('scenes',[])):
  raise ValueError('English portrait currently supports basic expression groups B1–B4; use these groups or English landscape for native source groups')
 selected=d.get('scenes');content=d.get('content',{})
 if not isinstance(selected,list)or not 1<=len(selected)<=30:raise ValueError('needs-binding: select 1–30 native units')
 cursor=0;spans=[];active=set();required=set();roles=set()
 for item in selected:
  if not isinstance(item,dict)or item.get('id')not in groups:raise ValueError('Unknown scene')
  g=groups[item['id']];first_frame=round(g['start']*60);last_frame=round(g['end']*60);dur=(last_frame-first_frame)/60
  if g.get('maxReadingHold'):
   chosen=item.get('duration',dur)
   if not dur<=chosen<=dur+g['maxReadingHold']:raise ValueError('Basic reading hold exceeds its bounded range')
   extra=chosen-dur
  else:
   if 'duration'in item and abs(item['duration']-dur)>1e-6:raise ValueError('Native actions keep their source duration')
   extra=0
  if not isinstance(item.get('title'),str)or not item['title'].strip()or len(item['title'])>45:raise ValueError('needs-binding: short user chapter label')
  overlapping={n['id']for n in groups.values()if n['start']<g['end']-1e-4 and n['end']>g['start']+1e-4};active.update(overlapping)
  for ident in overlapping:required.update(groups[ident]['fields']);roles.update(groups[ident]['media'])
  span={'id':g['id'],'title':item['title'],'activeUnits':sorted(overlapping),'sourceStart':first_frame/60,'sourceEnd':last_frame/60,'sourceWindow':[g['start'],g['end']],'sourceFrames':[first_frame,last_frame],'outputStart':cursor,'outputEnd':cursor+dur+extra}
  if extra:span['holdAt']=g['holdAt']
  spans.append(span);cursor+=dur+extra
 if cursor>600:raise ValueError('Candidate supports at most 10 minutes')
 if d.get('duration')is not None and abs(d['duration']-cursor)>1/120:raise ValueError('Declared duration does not match the selected native windows')
 for f in schema:
  v=content.get(f['id'],'');limit=f.get('maxCharsByLanguage',{}).get(d['language'],f['maxChars']if d['language']=='zh'else f['maxChars']*3+12)
  if not isinstance(v,str)or len(v)>limit:raise ValueError('Text exceeds provisional capacity: '+f['id'])
  if f['id']in required and not v.strip():raise ValueError('needs-binding: '+f['id'])
  if f['id']in required and f.get('pattern')and not re.fullmatch(f['pattern'],v):raise ValueError('Visible data needs its actual declared numeric format: '+f['id'])
  if f['id']in required and f.get('numberRule'):
   rule=f['numberRule'];n=float(v.rstrip('%+'));
   if not rule['min']<=n<=rule['max']:raise ValueError('Visible numeric data is outside its display range: '+f['id'])
 basic=d.get('basic',{});requirements={'B1':['keyword','explanation'],'B2':['heading','points'],'B3':['heading','left','right','conclusion'],'B4':['summary','action']};limits={'keyword':8,'heading':10,'left':8,'right':8,'explanation':42,'conclusion':48,'summary':10,'action':42,'label':32}
 def check_basic(effective,selected_units):
  for id in selected_units:
   for key in requirements.get(id,[]):
    value=effective.get(key)
    if key=='points':
     if not isinstance(value,list)or not 1<=len(value)<=5 or any(not isinstance(v,str)or not v.strip()or len(v.split('\n'))>2 or any(len(line)>(18 if d['language']=='zh'else 44)for line in v.split('\n'))for v in value):raise ValueError('needs-binding: one to five neutral user points, each one or two explicit lines')
    elif not isinstance(value,str)or not value.strip():raise ValueError('needs-binding: basic.'+key)
  if 'B2' in selected_units and 'pointRoles' in effective:
   roles=effective['pointRoles']
   if not isinstance(roles,list)or len(roles)!=len(effective['points'])or any(role not in ['point','action']for role in roles):raise ValueError('B2_POINT_ROLES: effective pointRoles must match effective points one-for-one and contain only point/action')
  for key,value in effective.items():
   if key in limits and (not isinstance(value,str)or len(value)>(limits[key]if d['language']=='zh'else limits[key]*3+12)or len(value.split('\n'))>2):raise ValueError('Basic expression text exceeds capacity: '+key)
 for index,span in enumerate(spans):
  effective={**basic,**selected[index].get('basic',{})};check_basic(effective,span['activeUnits']);span['basic']=effective;span['key']=span['id']+'#'+str(index);span['shotIndex']=index
  if span['id']in RESTRICTED and selected[index].get('intent')not in RESTRICTED[span['id']]:raise ValueError('SCENE_INTENT_MISMATCH: '+span['id']+' is not a neutral carrier; declare its real action purpose or select a neutral expression')
 for key in['title','presenterLabel']:
  if not isinstance(d.get(key),str)or len(d[key])>45:raise ValueError('needs-binding: '+key)
 media=d.get('media',{});assets={};consumed=[];ports=catalog['mediaPorts']
 def bind(role,value,port=None):
  if not isinstance(value,dict)or value.get('mode')not in['image','video']:raise ValueError('needs-binding: '+role+' image/video')
  p=media_path(root,value.get('file'));w,h,duration=spec(p);v={**value,'sourceWidth':w,'sourceHeight':h}
  if v['mode']=='video'and port:
   if duration<(port['frameCount']-1)/port['fps']-1/60:raise ValueError(role+' video is shorter than its required frame sequence')
   if port['kind']in['gallery','process']and v.get('cycle')!='explicit-allow':raise ValueError(role+' native carrier may cycle frames; supply an image or explicitly permit this illustrative cycle')
  if v['mode']=='image'and p.suffix.lower()not in['.png','.jpg','.jpeg','.webp']:raise ValueError('Still media must be PNG/JPEG/WebP')
  if role=='banner':
   focus=v.get('focus',{});highlights=focus.get('highlights',[])
   if not all(isinstance(focus.get(k),(float,int))and math.isfinite(focus[k])and 0<=focus[k]<=1 for k in['cx','cy'])or not 1<=len(highlights)<=5:raise ValueError('needs-binding: recording focus and 1–5 highlight rectangles')
   for box in highlights:
    if not all(isinstance(box.get(k),(float,int))and math.isfinite(box[k])and 0<=box[k]<=1 for k in['x','y','w','h'])or box['w']<=0 or box['h']<=0 or box['x']+box['w']>1 or box['y']+box['h']>1:raise ValueError('Invalid original-frame highlight rectangle')
  assets[role]=(p,v,port);consumed.append({'role':role,'sha256':sha(p),'path':str(p),'dimensions':[w,h],'duration':duration})
 presenter=media.get('presenter',{})
 if presenter.get('mode')=='none':pass
 else:
  bind('presenter',presenter)
  if presenter['mode']=='video'and spec(assets['presenter'][0])[2]<cursor-1/60:raise ValueError('Presenter video must cover the output clock continuously')
  face=presenter.get('face');tracking=presenter.get('tracking',[])
  if face is None and tracking:
   face={k:tracking[0].get(k)for k in['cx','cy','h']}
   framing={'status':'manual','method':'explicit-original-frame-tracking','reviewRequired':True}
  elif face is None:
   face,framing=approximate_face(assets['presenter'][0],presenter['mode'],spec(assets['presenter'][0])[2])
  else:framing={'status':'manual','method':'explicit-original-frame-hint','reviewRequired':True}
  if not isinstance(face,dict)or not all(isinstance(face.get(k),(float,int))and math.isfinite(face[k])and 0<face[k]<=1 for k in['cx','cy','h']):raise ValueError('needs-binding: face geometry in the original visual frame')
  assets['presenter'][1].update(face=face,framing=framing)
  for row in tracking:
   if not 0<=row.get('time',-1)<=cursor or not all(isinstance(row.get(k),(float,int))and 0<row[k]<=1 for k in['cx','cy','h']):raise ValueError('Invalid original-frame face tracking')
  if tracking!=sorted(tracking,key=lambda r:r['time']):raise ValueError('Tracking must be in output-time order')
 for role in roles:
  if role in['wall','feedback']:
   n=62 if role=='wall'else 10;arr=media.get(role)
   if not isinstance(arr,list)or len(arr)!=n:raise ValueError(f'needs-binding: {role} requires exactly {n} explicit entries for this native group')
   for i,v in enumerate(arr):bind(role+'/'+str(i),v,{'kind':'gallery','fps':12,'frameCount':30}if role=='wall'else None)
  else:
   port=ports.get(role);bind(role,media.get(role),port)
 visual_usage=bind_visuals(d,spans,bind,assets)
 presenter_clock=source_clock(assets['presenter'][0])if presenter.get('mode')=='video'else None
 audio_reports={}
 for role in['voice','music']:
  v=media.get(role)
  modes=['none','file','presenter']if role=='voice'else['none','file']
  if not isinstance(v,dict)or v.get('mode')not in modes:raise ValueError('needs-binding: explicit '+role+' none/file'+('/presenter'if role=='voice'else''))
  if role=='voice'and v['mode']=='none'and presenter_clock and presenter_clock['audio']and not v.get('discardPresenterAudio',False):
   raise ValueError('AUDIO_INTENT_REQUIRED: The presenter video contains audio. Preserve it with media.voice.mode=presenter; use mode=none plus discardPresenterAudio=true only when the user explicitly requested muting it. Never drop supplied narration by default.')
  if v['mode']=='presenter':
   if presenter.get('mode')!='video'or not presenter_clock['audio']:raise ValueError('AUDIO_STREAM_MISSING: presenter voice needs a real presenter video with audio')
   v={'mode':'file','file':presenter['file'],'source':'presenter-embedded','preserveContainerClock':True}
  if v['mode']=='file':
   p=media_path(root,v.get('file'));audio_reports[role]=require_signal(p,role=role)
   actual=audio_reports[role]['durationSeconds']
   if role=='voice'and abs(actual-cursor)>.05:raise ValueError('AUDIO_CLOCK_MISMATCH: Keep the complete original narration and recompose shots; the bound voice covers '+str(actual)+'s but the plan covers '+str(cursor)+'s')
   if actual<cursor-.05:raise ValueError(role+' must cover the full output clock without fabricated silence')
   if role=='music'and not v.get('license'):raise ValueError('Music source/license must be explicit')
   assets[role]=(p,v,None);consumed.append({'role':role,'sha256':sha(p),'path':str(p)})
 if d['layout']=='portrait'and(any(len(p['title'])>18 for p in spans)or len(d['title'])>18 or len(d['presenterLabel'])>10):raise ValueError('Portrait capacity: chapter/title at most18 characters; presenter label at most10. Keep the full script in captions, not a header label')
 if d.get('soundEffects')not in['native','none']:raise ValueError('Choose native sound effects or explicit none')
 if 'markWindows'in d:
  windows=d['markWindows']
  if cursor>=7 and not windows:raise ValueError('A signature window is required for this duration')
  for i,w in enumerate(windows):
   if not all(math.isfinite(w[k])for k in['start','end'])or not 0<=w['start']<w['end']<=cursor-.5+1e-6 or abs(w['end']-w['start']-5.5)>1/60 or i and windows[i-1]['end']>w['start']:raise ValueError('Invalid circular signature window')
 for c in d.get('captions',[]):
  if not isinstance(c.get('text'),str)or not 0<=c['start']<c['end']<=cursor:raise ValueError('Invalid caption cue')
  if c.get('units'):
   if ''.join(u['text']for u in c['units'])!=c['text']:raise ValueError('Measured caption units must reconstruct the text')
   for u in c['units']:
    if not c['start']<=u['start']<u['end']<=c['end']:raise ValueError('Measured word interval outside its caption')
  if len(c.get('breakAfter',[]))>1:raise ValueError('Explicit captions support one or two lines')
 timing_evidence=validate_timing_evidence(d,root,assets.get('voice',(None,))[0],cursor)
 alignment=validate_narration_map(d.get('narrationMap'),[{'id':p['id'],'title':p['title'],'start':p['outputStart'],'end':p['outputEnd']}for p in spans],d.get('captions',[]),required='voice'in assets,language=d['language'],wordEvidenceVerified=timing_evidence.get('fileIdentityAndWordReferencesVerified',False))
 alignment['timingEvidence']=timing_evidence
 anchors_text=(CORE/'native-anchors.js').read_text();anchors=json.loads(anchors_text.split('=',1)[1].split(';',1)[0])
 for index,span in enumerate(spans):
  span['protectedCueTimes']=[{'id':key,'at':span['outputStart']+value-span['sourceStart']+(max(0,span['outputEnd']-span['outputStart']-span['sourceEnd']+span['sourceStart'])if span.get('holdAt')is not None and value>span['holdAt']else 0)}for key,raw in anchors.items()for value in(raw if isinstance(raw,list)else[raw])if span['sourceStart']<=value<span['sourceEnd']]
  if alignment['rows']:
   row=alignment['rows'][index];span['narration']=row;span['narrationBeats']=row.get('beats',[])
   if selected[index].get('intent')and selected[index]['intent']!=row['purpose']:raise ValueError('SCENE_INTENT_MISMATCH: selected intent differs from the narration map')
   for beat in span['narrationBeats']:
    if span['id'].startswith('B'):
     target=beat['target'];valid=set(span['basic'])|{'headline'}
     if d.get('creationProfile')=='narrated-story/1':valid=set(requirements[span['id']])|{'headline'}
     valid.update('visuals.'+str(i)for i in range(len(span.get('visuals',[]))))
     if target.startswith('points.'):
      try:valid_target=0<=int(target.split('.')[1])<len(span['basic'].get('points',[]))
      except(ValueError,IndexError):valid_target=False
     else:valid_target=target in valid
     if not valid_target:raise ValueError('Unknown phrase-focus target for this basic expression: '+target)
    elif not any(cue['id']==beat['target']and beat['at']-.05<=cue['at']<=beat['until']+.05 for cue in span['protectedCueTimes']):raise ValueError('NATIVE_CUE_ALIGNMENT_REQUIRED: bind the actual protected cue to its spoken phrase, or use a neutral expression with flexible phrase focus')
 return {'profile':'kinetic-user-plan/1','inputSHA256':sha(source),'candidateContentDigest':digest(),'platformManifestDigest':'not yet established by official packer','layout':d['layout'],'language':d['language'],'duration_s':cursor,'frames':round(cursor*60),'width':1080 if d['layout']=='portrait'else 1920,'height':1920 if d['layout']=='portrait'else 1080,'fps':60,'spans':spans,'activeUnits':sorted(active),'requiredFields':sorted(required),'mediaRoles':sorted(roles),'inputs':consumed,'presenterFraming':assets['presenter'][1]['framing']if'presenter'in assets else None,'audioIntegrity':audio_reports,'narrationAlignment':alignment,'presenterClock':presenter_clock,'mediaUsage':media_usage(d,assets,visual_usage),'creationProfile':d.get('creationProfile'),'coverageComplete':False},d,assets
def prepare(input_file,out):
 report,d,assets=plan(input_file)
 if out.exists()or out.resolve().is_relative_to(ROOT):raise ValueError('Preserve existing directories and keep the core read-only')
 # Keep the official operation core immutable. Only this newly created
 # working instance receives writable modes; copied file bytes stay identical.
 shutil.copytree(CORE,out,copy_function=shutil.copyfile)
 for directory in [out,*[p for p in out.rglob('*')if p.is_dir()]]:directory.chmod(directory.stat().st_mode|0o300)
 (out/'user-assets').mkdir();bound={};reports=[];audio_hashes={};preparedImages={}
 retained_timing_evidence=retain_timing_evidence(report['narrationAlignment']['timingEvidence'],out)
 for role,(p,v,port)in assets.items():
  key=role.replace('/','-');dest=out/'user-assets'/key
  if role in['voice','music']:
   dest=dest.with_suffix('.wav');extraction=extract(p,dest,duration=report['duration_s']);relative=dest.relative_to(out).as_posix();bound[role]={**v,'mode':'file','file':relative};audio_hashes[relative]=sha(dest);reports.append({'role':role,'inputSHA256':sha(p),'prepared':bound[role],'audioExtraction':extraction});continue
  if role=='presenter':
   w,h=v['sourceWidth'],v['sourceHeight']
   port={'fps':60,'frameCount':report['frames']}
   filt="scale='min(1280,iw)':-1"if w>=h else"scale=-1:'min(1280,ih)'"
   geometry={'face':v['face'],'tracking':v.get('tracking',[]),'framing':v['framing']}
  elif role=='banner':
   w,h=v['sourceWidth'],v['sourceHeight'];scale=min(1600/w,1028/h);dx=(1600-w*scale)/2;dy=(1028-h*scale)/2;f=v['focus'];geometry={'focus':{'cx':(f['cx']*w*scale+dx)/1600,'cy':(f['cy']*h*scale+dy)/1028,'highlights':[{'x':(b['x']*w*scale+dx)/1600,'y':(b['y']*h*scale+dy)/1028,'w':b['w']*w*scale/1600,'h':b['h']*h*scale/1028}for b in f['highlights']]}};filt='scale=1600:1028:force_original_aspect_ratio=decrease,pad=1600:1028:(ow-iw)/2:(oh-ih)/2'
  else:filt='scale=1280:1280:force_original_aspect_ratio=decrease';geometry={}
  if v['mode']=='image':
   dest=dest.with_suffix('.png');cacheKey=(str(p),filt)
   if cacheKey in preparedImages:shutil.copy2(preparedImages[cacheKey],dest)
   else:
    subprocess.run(['ffmpeg','-v','error','-n','-i',str(p),'-vf',filt,'-frames:v','1',str(dest)],check=True);preparedImages[cacheKey]=dest
   b={'mode':'image','file':dest.relative_to(out).as_posix(),**geometry}
  else:
   dest.mkdir();subprocess.run(['ffmpeg','-v','error','-n']+(['-ss',str(port.get('sourceStart',0))]if port.get('kind')=='story'else['-copyts','-start_at_zero'])+['-i',str(p),'-vf',f"fps={port['fps']}:start_time=0,"+filt+f",tpad=stop_mode=clone:stop_duration={1/port['fps']}",'-frames:v',str(port['frameCount']),'-start_number','0','-q:v','2',str(dest/'%05d.jpg')],check=True)
   actual=len(list(dest.glob('*.jpg')))
   if actual!=port['frameCount']:raise ValueError('Prepared video sequence is incomplete: '+role)
   b={'mode':'video','directory':dest.relative_to(out).as_posix(),'frames':actual,'fps':port['fps'],**geometry}
  if role=='presenter':
   pw,ph,_=spec(dest if v['mode']=='image'else dest/'00000.jpg');b.update(width=pw,height=ph)
  bound[role]=b;reports.append({'role':role,'inputSHA256':sha(p),'prepared':b,'originalDimensions':[v['sourceWidth'],v['sourceHeight']]})
 media={k:v for k,v in bound.items()if'/'not in k}
 for role in['wall','feedback']:
  if role in report['mediaRoles']:media[role]=[bound[role+'/'+str(i)]for i in range(62 if role=='wall'else 10)]
 for role in['voice','music']:media.setdefault(role,{'mode':'none'})
 (out/'user-assets/blank.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280"/>',encoding='utf-8')
 content={f['id']:d.get('content',{}).get(f['id'],'')for f in read(CORE/'content.schema.json')['fields']}
 captions=[]
 for c in d.get('captions',[]):
  c=json.loads(json.dumps(c));c['text']=re.sub(r'[,，.。]+\s*$','',c['text'])
  if c.get('units'):c['units'][-1]['text']=re.sub(r'[,，.。]+\s*$','',c['units'][-1]['text'])
  captions.append(c)
 markWindows=[];at=8 if report['duration_s']>=14 else max(0,report['duration_s']-6)
 while report['duration_s']>=7 and at+5.5<=report['duration_s']-.5+1e-6:markWindows.append({'start':at,'end':at+5.5});at+=30
 if 'markWindows'in d:markWindows=d['markWindows']
 basic_by_unit={}
 for span in report['spans']:
  if span['id'].startswith('B')and(span['id']not in basic_by_unit or span['id']=='B2'and len(span['basic'].get('points',[]))>len(basic_by_unit[span['id']].get('points',[]))):basic_by_unit[span['id']]=span['basic']
 settings={'portraitComposition':d.get('portraitComposition','presenter-caption/2'),'header':d.get('header'),'captionPosition':d.get('captionPosition'),'captionSafeArea':d.get('captionSafeArea','short-video'),'selected':report['activeUnits'],'content':content,'basic':d.get('basic',{}),'basicByUnit':basic_by_unit,'titles':{g['id']:next((p['title']for p in report['spans']if p['id']==g['id']),d['title'])for g in read(CORE/'catalog.json')['groups']},'title':d['title'],'presenterLabel':d['presenterLabel'],'presenter':media.get('presenter',{'mode':'none'}),'media':media,'plan':report['spans'],'duration':report['duration_s'],'language':d['language'],'layout':d['layout'],'width':report['width'],'height':report['height'],'captions':captions,'markWindows':markWindows,'blank':'user-assets/blank.svg','soundEffects':d['soundEffects'],'creationProfile':d.get('creationProfile'),'narrationVisualMode':d.get('narrationVisualMode','original'),'narrationLayout':d.get('narrationLayout','original')}
 save(out/'settings.json',settings);(out/'user-input.js').write_text('window.KINETIC_INPUT='+json.dumps(settings,ensure_ascii=False)+';\n',encoding='utf-8');(out/'config.js').write_text('window.CONFIG='+json.dumps({'brand':'MotionGit','account':d['presenterLabel'],'demo':False,'fps':60,'width':report['width'],'height':report['height'],'end':223.85,'subtitles':False,'race':{'labels':['a','b'],'keys':[0,223.85]}})+';\n',encoding='utf-8')
 save(out/'user-plan.json',report);save(out/'binding-report.json',{'inputSHA256':report['inputSHA256'],'candidateContentDigest':report['candidateContentDigest'],'boundFiles':{n:sha(out/n)for n in['settings.json','user-input.js','config.js']},'boundAudioFiles':audio_hashes,'media':reports,'narrationTimingEvidence':retained_timing_evidence,'credentialsIncluded':False});return report
def main():
 p=argparse.ArgumentParser();p.add_argument('command',choices=['compose','plan','prepare','preview','events','render']);p.add_argument('--input',type=Path);p.add_argument('--instance',type=Path);p.add_argument('--out',type=Path);p.add_argument('--time',type=float,default=1);a=p.parse_args()
 if a.command=='compose':
  if not a.input or not a.out or a.out.exists()or a.out.resolve().is_relative_to(ROOT):raise ValueError('Compose needs current --input and a fresh --out file outside the immutable source')
  data=read(a.input)
  if not isinstance(data,dict):raise ValueError('Compose input must be a user JSON object')
  data['creationProfile']='narrated-story/1'
  issues=list(Draft202012Validator(read(ROOT/'params.schema.json')).iter_errors(data))
  if issues:raise ValueError('Invalid story input: '+str(list(issues[0].path))+' '+issues[0].message)
  def paths(value):
   if isinstance(value,dict):
    for key,item in value.items():
     if key=='file'and isinstance(item,str)and not Path(item).is_absolute():value[key]=str((a.input.resolve().parent/item).resolve())
     else:paths(item)
   elif isinstance(value,list):
    for item in value:paths(item)
  paths(data);data=compile_input(data,read(CORE/'catalog.json'),a.input.resolve().parent);save(a.out,data)
  result=plan(a.out)[0];print(json.dumps({'profile':'motiongit.composed-story/1','input':str(a.out.resolve()),'plan':result},ensure_ascii=False));return
 if a.command in['plan','prepare']:
  if not a.input or(a.command=='prepare'and not a.out):raise ValueError('Input and preparation output are required')
  if a.out and a.out.exists():raise ValueError('Preserve previous plans/instances; choose a new output')
  r=prepare(a.input,a.out)if a.command=='prepare'else plan(a.input)[0]
  if a.command=='plan'and a.out:save(a.out,r)
  print(json.dumps(r,ensure_ascii=False));return
 if not a.instance or not a.out or a.out.exists():raise ValueError('Choose an existing instance and a new output path')
 b=read(a.instance/'binding-report.json')
 if b['candidateContentDigest']!=digest():raise ValueError('Candidate identity changed; derive a new instance')
 if any(sha(a.instance/n)!=v for n,v in b['boundFiles'].items()):raise ValueError('Prepared binding changed; derive a new instance')
 if any(sha(a.instance/n)!=v for n,v in b.get('boundAudioFiles',{}).items()):raise ValueError('Prepared audio changed; derive a new instance')
 evidence=b.get('narrationTimingEvidence',{})
 if evidence.get('mode')=='file-backed-word-timing'and sha(a.instance/evidence['retainedFile'])!=evidence['retainedSha256']:raise ValueError('Prepared timing evidence changed; derive a new instance')
 caption_evidence=evidence.get('captionTiming',{})
 if caption_evidence.get('mode')=='file-backed-caption-timing'and sha(a.instance/caption_evidence['retainedFile'])!=caption_evidence['retainedSha256']:raise ValueError('Prepared caption timing evidence changed; derive a new instance')
 non_speech=caption_evidence.get('nonSpeechEvidence')
 if non_speech:
  for item in [non_speech,non_speech['originalRecord'],*non_speech['referenceFiles']]:
   if sha(a.instance/item['retainedFile'])!=item['retainedSha256']:raise ValueError('Prepared full-source review evidence changed; derive a new instance')
 cmd=['node',str(ROOT/'render.mjs'),'--root',str(a.instance),'--out',str(a.out)]
 if a.command=='preview':cmd+=['--preview','--time',str(a.time)]
 if a.command=='events':cmd+=['--events']
 subprocess.run(cmd,check=True)
 if a.command=='render':subprocess.run([sys.executable,str(ROOT/'mix.py'),'--instance',str(a.instance),'--silent-video',str(a.out)],check=True)
if __name__=='__main__':main()
