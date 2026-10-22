"""Validate measured narration-to-shot ownership; meaning still requires review."""
from pathlib import Path
import argparse,json,math,re,sys
from narration_visual_coverage import audit as visual_coverage
PROFILE='motiongit.narration-alignment/1'
PURPOSES=['neutral-emphasis','neutral-list','ordered-process','real-comparison','provided-evidence','decision-rejection','confirmed-completion','outreach-support','summary','user-requested-action','software-project-workflow']
RESTRICTED={'S05':['software-project-workflow'],'S08':['decision-rejection'],'S10':['real-comparison'],'S13':['software-project-workflow'],'S15':['ordered-process','real-comparison','confirmed-completion'],'S16':['software-project-workflow','confirmed-completion']}
def fail(message):raise ValueError('NARRATION_ALIGNMENT_REQUIRED: '+message+' Keep the full narration; recompose compatible shots or use neutral expressions. Total duration and a present audio stream do not prove content alignment.')
def normal(text):return re.sub(r'[\s,，.。!！?？;；:：、]+','',str(text)).casefold()
def cue(row,language='zh'):
 start=row.get('start',row.get('s',row.get('t0')));end=row.get('end',row.get('e',row.get('t1')));text=row.get('text',row.get(language,row.get('zh',row.get('en',''))))
 return {'start':start,'end':end,'text':text}
def validate(mapping,shots,captions=(),*,required=False,language='zh',fps=60,wordEvidenceVerified=False):
 if isinstance(mapping,list) and any(isinstance(row,dict) and row.get('captionBinding')=='continuous' for row in mapping):
  from narration_continuity import validate as continuous_validate
  return continuous_validate(mapping,shots,[cue(c,language)for c in captions],required=required,language=language,fps=fps,purposes=PURPOSES,restricted=RESTRICTED,word_evidence_verified=wordEvidenceVerified)
 tolerance=1/fps+.002;captions=[cue(x,language)for x in captions];total=shots[-1]['end']if shots else 0
 if not mapping:
  if required:fail('Provide narrationMap with one row per shot, measured start/end, full spokenText, visual purpose and phrase beats; derive it from the actual source/captions, never guessed word timing')
  return {'profile':PROFILE,'timingCoverageVerified':False,'meaningReview':'required; no narration map was supplied','rows':[]}
 if not isinstance(mapping,list)or len(mapping)!=len(shots):fail('narrationMap must have exactly one row per selected shot, in output order')
 rows=[];owned=[]
 for index,(row,shot)in enumerate(zip(mapping,shots)):
  if not isinstance(row,dict):fail('Each narrationMap row must be an object')
  if row.get('shot')!=index or any(not isinstance(row.get(k),(int,float))or not math.isfinite(row[k])for k in['start','end']):fail('Use zero-based shot indices and finite measured start/end times')
  if abs(row['start']-shot['start'])>tolerance or abs(row['end']-shot['end'])>tolerance:fail('Shot '+str(index)+' does not own the measured output range assigned to it')
  text=row.get('spokenText');purpose=row.get('purpose');source=row.get('timingSource')
  if not isinstance(text,str)or not text.strip():fail('Each voiced shot needs its full actual spokenText, including qualifiers and numbers')
  if purpose not in PURPOSES:fail('Choose the actual visual purpose; available values: '+', '.join(PURPOSES))
  if source not in['provided-captions','measured-phrases','reviewed-transcript']:fail('State the real timing source; do not invent alignment from word count')
  if shot.get('id')in RESTRICTED and purpose not in RESTRICTED[shot['id']]:fail(shot['id']+' has a non-neutral motion meaning; '+purpose+' does not match it')
  control=shot.get('control')
  if control in['stamp','check','checklist']and purpose not in['confirmed-completion','user-requested-action']:fail(control+' must not imply completion for an unfulfilled request')
  refs=row.get('captionIndices',[])
  if captions:
   if not isinstance(refs,list)or not refs or any(type(v)is not int or not 0<=v<len(captions)for v in refs)or refs!=sorted(set(refs)):fail('Reference the actual zero-based captionIndices in narrationMap')
   selected=[captions[v]for v in refs]
   if any(not isinstance(c['start'],(int,float))or not isinstance(c['end'],(int,float))or c['start']<row['start']-tolerance or c['end']>row['end']+tolerance for c in selected):fail('A shot boundary cuts through its owned spoken cue; use real phrase boundaries or another neutral shot')
   if normal(text)!=normal(''.join(c['text']for c in selected)):fail('spokenText must retain the complete owned captions, not a summary or a shortened substitute')
   owned.extend(refs)
  beats=row.get('beats',[])
  if not isinstance(beats,list):fail('beats must be a list of measured phrase emphasis records')
  if required and len(normal(text))>0 and not beats:fail('A voiced shot needs at least one phrase beat tied to its actual words; a static list lasting the whole chapter is insufficient')
  previous=-1
  for beat in beats:
   if not isinstance(beat,dict)or not isinstance(beat.get('at'),(int,float))or not isinstance(beat.get('until'),(int,float))or not all(math.isfinite(beat[k])for k in['at','until'])or not row['start']-tolerance<=beat['at']<beat['until']<=row['end']+tolerance or beat['at']<previous:fail('Phrase beats must be measured, ordered and inside their own shot')
   if not isinstance(beat.get('spokenText'),str)or not normal(beat['spokenText'])or normal(beat['spokenText'])not in normal(text):fail('Each phrase beat must quote actual owned words; retain negatives and units')
   if beat.get('timing')not in['sentence','measured-word']:fail('Sentence captions allow sentence-level emphasis; word emphasis requires measured word intervals')
   if captions and not any(captions[v]['start']-tolerance<=beat['at']<beat['until']<=captions[v]['end']+tolerance and normal(beat['spokenText'])in normal(captions[v]['text'])for v in refs):fail('A beat points outside the actual caption containing its words')
   if beat.get('timing')=='sentence'and captions and not any(abs(beat['at']-captions[v]['start'])<=tolerance and abs(beat['until']-captions[v]['end'])<=tolerance for v in refs):fail('Do not fabricate word timestamps from a sentence-only cue')
   if not isinstance(beat.get('target'),str)or not beat['target'].strip():fail('Specify the real visual target for the phrase emphasis')
   previous=beat['at']
  rows.append({**row,'sceneId':shot.get('id'),'control':control,'chapter':shot.get('title'),'semanticReview':'The assistant must check that the picture conveys these words; this validator checks ownership and timing, not natural-language meaning'})
 if captions and sorted(owned)!=list(range(len(captions))):fail('Every supplied cue must belong to exactly one shot; do not drop or duplicate narration to fit scenes')
 return {'profile':PROFILE,'timingCoverageVerified':True,'durationSeconds':total,'meaningReview':'required; timing validation is not semantic acceptance','rows':rows,'visualCoverage':visual_coverage(rows,captions,language,fps)}
def read_srt(path,start=0):
 text=Path(path).read_text(encoding='utf-8-sig').replace('\r','');result=[]
 def time(s):
  h,m,sec=s.split(':');return int(h)*3600+int(m)*60+float(sec.replace(',','.'))
 for block in re.split(r'\n\s*\n',text.strip()):
  lines=block.splitlines();at=next((i for i,s in enumerate(lines)if'-->'in s),None)
  if at is None:continue
  a,b=[time(s.strip())for s in lines[at].split('-->')];result.append({'start':a-start,'end':b-start,'text':'\n'.join(lines[at+1:])})
 return result
def timeline(data,*,required=False,root=None):
 tl=data.get('timeline',data);language=tl.get('language','zh');start=tl.get('narrationRange',{}).get('start',tl.get('sourceStart',0));captions=tl.get('captions',[])
 source_indices=None
 if tl.get('subtitles'):
  file=Path(tl['subtitles']);captions=read_srt(file if file.is_absolute()else(root or Path.cwd())/file,start)
  if tl.get('narrationRange')is not None or start:
   # An already explicit excerpt has the same source-clock selection as the
   # renderer. Do not require the excerpt to own narration outside its range.
   # A partially cut cue still needs a reviewed replacement, not silent clipping.
   duration=tl['duration'];selected=[];source_indices=[]
   for index,c in enumerate(captions):
    if c['end']<=0 or c['start']>=duration:continue
    if c['start']<-.002 or c['end']>duration+.002:fail('The explicit narration range cuts a supplied sentence; review real phrase boundaries and provide measured captions for the authorized excerpt')
    selected.append(c);source_indices.append(index)
   captions=selected
 shots=[{'start':s['t0'],'end':s['t1'],'control':s['control'],'title':s.get('title',s.get('props',{}).get('text',''))}for s in tl['segments']]
 result=validate(tl.get('narrationMap'),shots,captions,required=required,language=language)
 if source_indices is not None:result['selectedSourceCaptionIndices']=source_indices
 return result
def native(brief):
 evidence=brief.get('contentEvidence',{});units={u['id']:u for u in evidence.get('units',[])};at=0;rows=[];owned=[]
 for index,segment in enumerate(brief.get('segments',[])):
  end=at+segment['durationFrames']/60;refs=segment.get('ownershipRefs',[])
  if not refs or any(r not in units for r in refs):fail('Native segments must own actual measured contentEvidence units')
  selected=[units[r]for r in refs]
  if any(not isinstance(u.get('time'),dict)or not isinstance(u['time'].get('start'),(int,float))or not isinstance(u['time'].get('end'),(int,float))or u['time']['start']<at-1/60-.002 or u['time']['end']>end+1/60+.002 for u in selected):fail('A native scene owns words outside its output range; resegment at actual phrase boundaries')
  owned.extend(refs);rows.append({'shot':index,'start':at,'end':end,'spokenText':''.join(u['text']for u in selected),'intent':segment.get('intent'),'sourceUnitRefs':refs,'phraseTimes':[u['time']for u in selected],'nativeGroupCandidates':list(segment.get('candidates',{})),'semanticReview':'Match the actual native action meaning, not keyword similarity or unused time capacity'});at=end
 if sorted(owned)!=sorted(units):fail('Native ownershipRefs must cover every measured narration unit exactly once')
 return {'profile':PROFILE,'timingCoverageVerified':True,'meaningReview':'Existing native content evidence retained; action meaning requires scene review','rows':rows}
def main():
 p=argparse.ArgumentParser();p.add_argument('file',type=Path);p.add_argument('--required',action='store_true');a=p.parse_args()
 try:result=timeline(json.loads(a.file.read_text()),required=a.required,root=a.file.resolve().parent)
 except ValueError as e:raise SystemExit(str(e))
 print(json.dumps(result,ensure_ascii=False,allow_nan=False))
if __name__=='__main__':main()
