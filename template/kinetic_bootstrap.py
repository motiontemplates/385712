"""Standard-library entry for signed personal consumption of the kinetic core.

Only declared dependencies enter the external cache. Protected template source
stays in the official helper's operation directory and is never copied out.
"""
from pathlib import Path
import argparse,hashlib,json,os,platform,shutil,subprocess,sys,tempfile
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parent
PROFILE='motiongit.kinetic-dependencies/1'
FILES=['dependencies/package.json','dependencies/package-lock.json','dependencies/requirements-runtime.lock.txt','dependencies/runtime-dependencies.json']
OPERATIONS=['doctor','setup','capabilities','compose','check-params','plan','prepare','preview','render']
class SetupRequired(ValueError):pass

def read(path):return json.loads(Path(path).read_text(encoding='utf-8'))
def sha(path):
 with Path(path).open('rb')as file:return hashlib.file_digest(file,'sha256').hexdigest()
def write(path,value):Path(path).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def probe_command(command,timeout=20):
 try:
  r=subprocess.run(list(map(str,command)),capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=timeout)
  return r.returncode,r.stdout.strip(),r.stderr.strip()
 except (OSError,subprocess.TimeoutExpired):return -1,'','Command unavailable or timed out'
def version(python):
 code,out,_=probe_command([python,'-I','-c','import sys,json;print(json.dumps(list(sys.version_info[:2])))'])
 try:return tuple(json.loads(out))if code==0 else None
 except (ValueError,TypeError):return None

def select_python(cache=None):
 candidates=([str(python_in(cache))]if cache and python_in(cache).is_file()else[])+[sys.executable]
 for name in ['python3.13','python3','python']:
  path=shutil.which(name)
  if path:candidates.append(path)
 uv=shutil.which('uv')
 if uv:
  for minor in ['3.13']:
   code,out,_=probe_command([uv,'python','find','--offline','--no-python-downloads',minor])
   if code==0 and Path(out).is_file():candidates.append(out)
 seen=set()
 for candidate in candidates:
  path=str(Path(candidate).resolve())
  if path in seen:continue
  seen.add(path);v=version(path)
  if v==(3,13):return path,v
 return None,None

def contract():
 locks={n:sha(ROOT/n)for n in FILES};data=read(ROOT/'dependencies/runtime-dependencies.json')
 identity={'profile':PROFILE,'lockFiles':locks,'platform':sys.platform,'machine':platform.machine(),'pythonMinor':list(data['preferredPython'])}
 digest=hashlib.sha256(json.dumps(identity,sort_keys=True,separators=(',',':')).encode()).hexdigest()[:24]
 return identity,digest,data

def cache_root(argument,digest):
 if argument:base=Path(argument).expanduser().absolute()
 elif os.name=='nt':base=Path(os.environ.get('LOCALAPPDATA',str(Path.home()/'AppData/Local')))/'MotionGit'/'Cache'
 else:base=Path(os.environ.get('XDG_CACHE_HOME',str(Path.home()/'.cache')))/'motiongit'
 if base.is_symlink():raise ValueError('Dependency cache root cannot be a symlink')
 base=base.resolve()
 if base.is_relative_to(ROOT.resolve()):raise ValueError('Dependency cache must be outside the read-only template and cannot be a symlink')
 cache=base/'kinetic-dependencies'/digest
 for p in[cache,*cache.parents]:
  if p.is_symlink():raise ValueError('Dependency cache path cannot contain a symlink')
 return cache

def python_in(cache):return cache/'.venv'/('Scripts/python.exe'if os.name=='nt'else'bin/python')
def package_versions(python,expected):
 snippet="import importlib.metadata,json;wanted=json.loads(__import__('sys').argv[1]);found={};errors=[]\nfor name,want in wanted.items():\n try:\n  got=importlib.metadata.version(name);found[name]=got\n  if got!=want:errors.append(name+' version differs')\n except importlib.metadata.PackageNotFoundError:errors.append(name+' missing')\nfor name in ['numpy','scipy','soundfile','pyloudnorm','jsonschema','cv2']:\n try:__import__(name)\n except Exception as e:errors.append(name+' import: '+type(e).__name__)\ntry:\n import cv2\n from pathlib import Path\n xml=(Path(cv2.data.haarcascades)/'haarcascade_frontalface_default.xml').read_text(encoding='utf-8')\n storage=cv2.FileStorage(xml,cv2.FILE_STORAGE_READ|cv2.FILE_STORAGE_MEMORY)\n try:\n  detector=cv2.CascadeClassifier()\n  if not storage.isOpened() or not detector.read(storage.getFirstTopLevelNode()) or detector.empty():\n   raise ValueError('Frontal face model could not load from memory')\n finally:storage.release()\nexcept Exception as error:errors.append('cv2 frontal face model: '+type(error).__name__)\nprint(json.dumps({'versions':found,'errors':errors}))"
 code,out,_=probe_command([python,'-I','-c',snippet,json.dumps(expected)],timeout=120)
 try:return json.loads(out)if code==0 else {'versions':{},'errors':['Isolated Python dependencies could not be imported']}
 except ValueError:return {'versions':{},'errors':['Isolated Python dependency check did not return a report']}

def browser_path():
 node=shutil.which('node')
 if not node:return None
 js="import {chrome} from "+json.dumps((ROOT/'chrome.mjs').as_uri())+";console.log(chrome(process.env.CHROME_PATH||process.env.CHROME));"
 code,out,_=probe_command([node,'--input-type=module','-e',js])
 return out if code==0 and Path(out).is_file()else None

def cache_status(cache,identity,data):
 receipt=cache/'dependencies.json';errors=[];versions={}
 if not receipt.is_file():return {'ready':False,'errors':['Run setup to create the isolated locked dependency cache'],'versions':{}}
 try:
  found=read(receipt)
  if found.get('identity')!=identity:errors.append('Dependency receipt does not match the declared locks')
  for source,target in [('dependencies/package.json','package.json'),('dependencies/package-lock.json','package-lock.json'),('dependencies/requirements-runtime.lock.txt','requirements-runtime.lock.txt')]:
   if not(cache/target).is_file()or sha(cache/target)!=identity['lockFiles'][source]:errors.append(target+' changed')
  python=python_in(cache)
  if not python.is_file():errors.append('Isolated Python executable is missing')
  else:
   v=version(python)
   if v!=(3,13):errors.append('The locked runtime needs Python3.13')
   checked=package_versions(python,data['pythonPackages']);versions=checked['versions'];errors.extend(checked['errors'])
  node=shutil.which('node');package=cache/'node_modules/playwright-core/package.json'
  if not package.is_file()or read(package).get('version')!=data['nodePackages']['playwright-core']:errors.append('Locked playwright-core is missing or changed')
  elif node:
   js="const p=require(process.argv[1]);if(!p.chromium)throw Error('chromium export missing');console.log('ok')"
   code,_,_=probe_command([node,'-e',js,str(cache/'node_modules/playwright-core')])
   if code:errors.append('Installed playwright-core could not be loaded')
 except (OSError,ValueError,KeyError,TypeError):errors.append('Invalid dependency cache; select a fresh external cache instead of overwriting it')
 return {'ready':not errors,'errors':errors,'versions':versions}

def doctor(cache,identity,data):
 selected,v=select_python(cache);tools={name:shutil.which(name)for name in['node','npm','ffmpeg','ffprobe']};browser=browser_path();installed=cache_status(cache,identity,data)
 missing=[name for name,p in tools.items()if not p]
 if not browser:missing.append('Chrome/Chromium')
 if not selected:missing.append('Python3.13 (PATH or an existing uv-managed interpreter)')
 return {'profile':'motiongit.kinetic-environment/1','status':'ready'if installed['ready']and not missing else'needs-setup','ready':installed['ready']and not missing,'entryUsesStandardLibraryOnly':True,'invokingPython':sys.executable,'selectedPython':selected,'runtimePythonExecutable':str(python_in(cache))if python_in(cache).is_file()else None,'selectedPythonVersion':list(v)if v else None,'cache':str(cache),'tools':tools,'browser':browser,'missingTools':missing,'dependencies':installed,'declaredPythonPackages':data['pythonPackages'],'declaredNodePackages':data['nodePackages'],'next':'Use the same verified personal helper run command with setup; it installs dependencies in this external cache without changing global Python or exposing source'}

def npm_command():
 npm=shutil.which('npm');node=shutil.which('node')
 if not npm or not node:raise SetupRequired('Node and npm are required')
 resolved=Path(npm).resolve()
 candidates=[resolved]if resolved.suffix=='.js'else[]
 for folder in [Path(npm).parent,Path(node).resolve().parent]:
  candidates.extend([folder/'node_modules/npm/bin/npm-cli.js',folder.parent/'lib/node_modules/npm/bin/npm-cli.js'])
 cli=next((p for p in candidates if p.is_file()),None)
 if cli:return [node,str(cli)]
 if os.name!='nt':return [npm]
 raise SetupRequired('npm JavaScript CLI not found beside Node; install the standard Node/npm distribution')

def install(command,stage):
 r=subprocess.run(list(map(str,command)),stdout=sys.stderr,stderr=sys.stderr)
 if r.returncode:raise SetupRequired(stage+' failed; keep the exact installation diagnostic. No template source or existing output was replaced')

def setup(cache,identity,data):
 selected,v=select_python(cache)
 if not selected:raise SetupRequired('PYTHON_VERSION_REQUIRED: The locked runtime supports Python3.13. Install one through the host or uv managed-Python tool, then retry setup. Global Python is not modified')
 for tool in['node','npm','ffmpeg','ffprobe']:
  if not shutil.which(tool):raise SetupRequired('TOOL_MISSING: '+tool+' is required. Install it in the host, then retry setup')
 if cache.exists():
  checked=cache_status(cache,identity,data)
  if not checked['ready']:raise SetupRequired('DEPENDENCY_CACHE_CHANGED: '+ '; '.join(checked['errors'])+'. Use --cache with a fresh external cache root; setup never overwrites an existing dependency tree')
 else:
  cache.parent.mkdir(parents=True,exist_ok=True);cache.mkdir();created=cache.stat()
  try:
   for source,target in [('dependencies/package.json','package.json'),('dependencies/package-lock.json','package-lock.json'),('dependencies/requirements-runtime.lock.txt','requirements-runtime.lock.txt')]:shutil.copy2(ROOT/source,cache/target)
   install([selected,'-m','venv',cache/'.venv'],'Isolated Python environment creation')
   install([python_in(cache),'-I','-X','utf8','-m','pip','install','--disable-pip-version-check','--no-input','--progress-bar','off','--only-binary=:all:','--require-hashes','-r',cache/'requirements-runtime.lock.txt'],'Locked Python dependency installation')
   install([*npm_command(),'ci','--prefix',cache,'--ignore-scripts','--no-audit','--no-fund'],'Locked Node dependency installation')
   checked=package_versions(python_in(cache),data['pythonPackages'])
   if checked['errors']:raise SetupRequired('; '.join(checked['errors']))
   write(cache/'dependencies.json',{'identity':identity,'pythonSource':selected,'pythonVersion':list(v),'versions':checked['versions'],'sourceCopiedOut':False,'globalPythonModified':False})
  except BaseException:
   if cache.exists()and not cache.is_symlink():
    current=cache.stat()
    if(current.st_dev,current.st_ino)==(created.st_dev,created.st_ino):shutil.rmtree(cache)
   raise
 if not browser_path():install([shutil.which('node'),cache/'node_modules/playwright-core/cli.js','install','chromium-headless-shell'],'Standard browser dependency installation')
 report=doctor(cache,identity,data)
 if not report['ready']:raise SetupRequired('ENVIRONMENT_NOT_READY: '+json.dumps(report,ensure_ascii=False))
 report['status']='dependencies-ready';report['protectedSourceCopiedOut']=False;report['globalPythonModified']=False
 return report

def capabilities():
 # These are existing root-level public documents, not protected source paths.
 return {'profile':'motiongit.kinetic-capabilities/1',
  'template':read(ROOT/'motion.json')['template'],'operations':OPERATIONS,
  'layouts':{'zh':['landscape','portrait'],'en':['landscape','portrait']},
  'englishPortraitGroups':['B1','B2','B3','B4'],
  'newNarration':{'operation':'compose','guide':'NARRATED-STORY.md','inputProfile':'narrated-story/1','preservesOldInputs':True},
  'inputSchema':'params.schema.json',
  'publicReadPaths':{'inputSchema':'params.schema.json','guide':'guide.json','englishGuide':'guide.en.json','basic':'BASIC.md','creation':'CREATION.md','media':'MEDIA.md','audio':'AUDIO.md','narration':'NARRATION-MAP.md'},
  'next':{'instructions':'inputSchema is a root-level public path string. inputSchemaContent is the complete JSON Schema object. Use that object to build inputs before check-params; do not guess fields. These paths have no core/ prefix and do not require source inspection or extraction. / inputSchema是根级公开路径字符串，inputSchemaContent才是完整结构对象；先据此构造输入，再校验。以下公开路径不加core/前缀，无需探查或截取源码。',
   'readSchemaCommand':['node','assistant/motion.mjs','read','<personal.motion>','params.schema.json'],
   'readBasicCommand':['node','assistant/motion.mjs','read','<personal.motion>','BASIC.md']},
  'inputSchemaSha256':sha(ROOT/'params.schema.json'),
  'inputSchemaContent':read(ROOT/'params.schema.json'),
  'captionTimingEvidence':{'instructions': 'NARRATION-MAP.md', 'evidenceParameter': 'captionTimingEvidence', 'draft': 'Automatic/draft SRT is unverified; source labels do not prove alignment. Obtain actual local ASR/alignment or listen-check every complete sentence against the bound original voice.', 'checkedSrt': 'An actually reviewed whole-sentence SRT can be bound directly; no mandatory ASR service, word timing or new approval.', 'coverage': 'Original per-channel activity flags substantial uncovered signal; silence is allowed. Ordinary recorded music/environment can be reviewed using actual full-source listening or local acoustic-analysis findings and original records, bound to source and captions; labels/ASR gaps cannot waive alarms. No actual capability means still needs review. Read NARRATION-MAP.md. No audio changes or retiming.', 'meaning': 'Keep negation, conditions and both comparison sides; inspect/listen to the actual encoded film. Hashes and self-declared tool/review provenance are not semantic acceptance.'},
  'narrationTimingEvidence':{'instructions': 'NARRATION-MAP.md', 'sentenceFallback': 'Complete original cue text and interval only. A cue containing both comparison sides uses an overall heading/card; no guessed internal side switch.', 'wordTiming': 'Actual file/hash, bound source identity, method, tool, clock/offset and contiguous wordIndices are checked; the unmodified result is retained in the prepared project.', 'evidenceParameter': 'narrationTimingEvidence', 'clock': 'output = raw word seconds + offsetSeconds; no speed change', 'acceptance': 'File/hash/reference consistency is traceability only; actual measurement authenticity, ASR accuracy and encoded-film meaning/listening remain separate'},
  'audioContract':'audio-contract.json','narrationAlignmentGuide':'NARRATION-MAP.md',
  'dependencies':read(ROOT/'dependencies/runtime-dependencies.json'),
  'semanticAcceptance':'Timing and audio checks do not replace real action meaning review',
  'catalog':read(ROOT/'core/catalog.json')}

def main():
 args=sys.argv[1:];workspace=None;cache_arg=None
 while args and args[0]in['--instance','--cache']:
  if len(args)<2:raise ValueError('A path must follow '+args[0])
  option,value=args[:2];args=args[2:]
  if option=='--instance':workspace=Path(value).expanduser().absolute()
  else:cache_arg=value
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('operation',choices=OPERATIONS);parser.add_argument('--input',type=Path);parser.add_argument('--out',type=Path);parser.add_argument('--instance',type=Path);parser.add_argument('--time',type=float,default=1)
 a=parser.parse_args(args);identity,key,data=contract();cache=cache_root(cache_arg,key)
 if a.operation=='doctor':print(json.dumps(doctor(cache,identity,data),ensure_ascii=False,indent=2));return 0
 if a.operation=='setup':print(json.dumps(setup(cache,identity,data),ensure_ascii=False,indent=2));return 0
 if a.operation=='capabilities':
  print(json.dumps(capabilities(),ensure_ascii=False,indent=2));return 0
 ready=doctor(cache,identity,data)
 if not ready['ready']:raise SetupRequired('SETUP_REQUIRED: '+json.dumps(ready,ensure_ascii=False))
 if a.operation in['compose','check-params','plan','prepare']:
  if not a.input:raise ValueError('--input is required')
  command=['plan'if a.operation=='check-params'else a.operation,'--input',str(a.input.absolute())]
  if a.operation in['compose','prepare']and not a.out:raise ValueError('prepare needs a fresh --out directory')
 else:
  instance=a.instance or(workspace/'project'if workspace else None)
  if not instance:raise ValueError('preview/render need --instance pointing to the prepared project')
  if not a.out:raise ValueError('preview/render need a fresh --out path')
  command=[a.operation,'--instance',str(instance.absolute())]
  if a.operation=='preview':command+=['--time',str(a.time)]
 if a.out and a.operation!='check-params':command+=['--out',str(a.out.absolute())]
 env=dict(os.environ);env.update(PYTHONDONTWRITEBYTECODE='1',PYTHONNOUSERSITE='1',MOTIONGIT_DEPENDENCY_ROOT=str(cache),PATH=str(python_in(cache).parent)+os.pathsep+env.get('PATH',''))
 if ready['browser']:env['CHROME_PATH']=ready['browser'];env['CHROME']=ready['browser']
 return subprocess.run([str(python_in(cache)),str(ROOT/'adapter.py'),*command],env=env).returncode
if __name__=='__main__':
 try:raise SystemExit(main())
 except (ValueError,OSError,subprocess.SubprocessError)as error:raise SystemExit('MotionGit kinetic runtime: '+str(error))
