/* motiongit.caption-publish-safe/1 — editorial preview preset, not platform certification. */
(function(root){
  'use strict';
  if(root.MotionCaptionSafeArea)return;
  const PROFILE='motiongit.caption-publish-safe/1';
  const DEFAULT={bottomRatio:.24,leftRatio:.08,rightRatio:.16};
  function resolve(width,height,value){
    if(height<=width&&value==null)return null;
    if(value!=null&&(typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!Object.hasOwn(DEFAULT,k))))
      throw Error('CAPTION_POSITION: use optional bottomRatio, leftRatio, rightRatio; keep original text and times.');
    const p={...DEFAULT,...value};
    for(const[k,v]of Object.entries(p))if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>=1)
      throw Error('CAPTION_POSITION: '+k+' must be a finite ratio in [0,1).');
    if(p.leftRatio+p.rightRatio>=.8)
      throw Error('CAPTION_POSITION: insufficient reading space; review the publish preview and adjust the optional position.');
    return {profile:PROFILE,...p,left:width*p.leftRatio,right:width*(1-p.rightRatio),
      bottom:height*(1-p.bottomRatio),top:height*.1,width:width*(1-p.leftRatio-p.rightRatio),height};
  }
  function page(){
    const input=root.MOTION_INPUTS?.timeline||root.KINETIC_INPUT||root.MOTION_CONFIG;
    if(input){
      const portrait=input.layout==='portrait';
      return input.captionSafeArea==='frame'||!portrait?null:resolve(1080,1920,input.captionPosition);
    }
    const c=typeof CONFIG!=='undefined'?CONFIG:root.CONFIG;
    if(c&&(c.height||1080)>(c.width||1920))return resolve(c.width||1920,c.height||1080,c.subtitlePosition);
    return null;
  }
  function position(element,p){
    if(!p)return;
    Object.assign(element.style,{top:'auto',bottom:(p.height-p.bottom)+'px',left:p.left+'px',
      right:'auto',width:p.width+'px',boxSizing:'border-box'});
    element.dataset.captionSafeArea=PROFILE;
  }
  // Preserve exact display characters, including spaces at explicit line boundaries.
  // This is typography only: it creates no new cue, word timestamp, or semantic cut.
  function wrap(element,text,width,language,maxLines=2){
    const style=getComputedStyle(element),context=document.createElement('canvas').getContext('2d');
    context.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const units=[...new Intl.Segmenter(language||'zh',{granularity:'word'}).segment(text)].map(x=>x.segment);
    const lines=[''];
    for(const unit of units){
      if(context.measureText(unit).width>width+.1)throw Error('CAPTION_READABLE_WIDTH: a complete word exceeds the reading area. Re-layout the visual or use a reviewed phrase boundary; never squeeze or clip the subtitle.');
      if(lines.at(-1)&&context.measureText(lines.at(-1)+unit).width>width+.1)lines.push('');
      lines[lines.length-1]+=unit;
    }
    if(lines.length>maxLines)throw Error('CAPTION_READABLE_LINES: complete caption needs more than two lines. Use an actual reviewed phrase boundary or adjust the available layout; keep full meaning and real times.');
    element.replaceChildren();
    for(const text of lines){const line=document.createElement('span');line.className='publish-caption-line';
      line.style.cssText='display:block;white-space:pre';line.textContent=text;element.append(line);}
    return lines;
  }
  function reflowUnits(box,width,maxLines=2){
    const originals=[...box.children],rows=[];
    for(const old of originals){
      let row=[];rows.push(row);let used=0;
      for(const unit of [...old.children]){
        unit.style.display='inline-block';unit.style.whiteSpace='pre';
        const w=unit.getBoundingClientRect().width;
        if(w>width+.1)throw Error('CAPTION_READABLE_WIDTH: re-layout a complete measured word; never invent smaller word intervals.');
        if(row.length&&used+w>width+.1){row=[];rows.push(row);used=0;}
        row.push(unit);used+=w;
      }
    }
    if(rows.length>maxLines)throw Error('CAPTION_READABLE_LINES: keep complete captions and use reviewed phrase/layout adjustments.');
    box.replaceChildren();for(const units of rows){const line=document.createElement('div');line.style.whiteSpace='pre';line.append(...units);box.append(line);}
  }
  function visible(element){
    for(let e=element;e&&e!==document.body;e=e.parentElement){const s=getComputedStyle(e);
      if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<.04)return false;}
    return true;
  }
  /* motiongit.caption-visible-inset/1: unsupported geometry stays conservative. */
  function insetRect(element,style,cache){
    if(cache.has(element))return cache.get(element);
    let result=null;
    const match=style.clipPath.match(/^inset\(([^()]+)\)$/);
    if(match){
      const values=match[1].trim().split(/\s+/),length=/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(px|%)?$/;
      // Only axis-aligned, positive 2D transforms have a correct mapping from
      // the border box to this screen rectangle. Never use an AABB as though
      // it were the shape of a rotated/skewed/perspective clipping window.
      let aligned=values.length>=1&&values.length<=4;
      for(let e=element;aligned&&e;e=e.parentElement){const s=getComputedStyle(e);
        if((s.rotate&&s.rotate!=='none')||(s.scale&&s.scale!=='none')||
          (s.offsetPath&&s.offsetPath!=='none')||(s.perspective&&s.perspective!=='none'))aligned=false;
        if(s.transform!=='none')try{const m=new DOMMatrixReadOnly(s.transform);
          if(!m.is2D||m.b!==0||m.c!==0||m.a<=0||m.d<=0)aligned=false;
        }catch{aligned=false;}
      }
      const size=(axis)=>{let n=parseFloat(style[axis]);
        if(style.boxSizing!=='border-box')for(const key of axis==='width'?['paddingLeft','paddingRight','borderLeftWidth','borderRightWidth']:['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'])n+=parseFloat(style[key]);
        return n;
      };
      const width=size('width'),height=size('height');
      if(aligned&&width>0&&height>0&&Number.isFinite(width)&&Number.isFinite(height)){
        const expanded=values.length===1?[values[0],values[0],values[0],values[0]]:
          values.length===2?[values[0],values[1],values[0],values[1]]:
          values.length===3?[values[0],values[1],values[2],values[1]]:values;
        const offsets=expanded.map((value,index)=>{const m=value.match(length);
          if(!m||(!m[2]&&Number(m[1])!==0))return NaN;
          return Number(m[1])*(m[2]==='%'?(index%2?width:height)/100:1);
        });
        const [top,right,bottom,left]=offsets;
        // Overconstrained insets have CSS proportional reduction rules. Keep
        // the original conservative bounds instead of guessing those shapes.
        if(offsets.every(Number.isFinite)&&left+right<=width&&top+bottom<=height){
          const b=element.getBoundingClientRect(),sx=b.width/width,sy=b.height/height;
          result={left:b.left+left*sx,right:b.right-right*sx,top:b.top+top*sy,bottom:b.bottom-bottom*sy};
        }
      }
    }
    cache.set(element,result);return result;
  }
  function clippedRect(box,element,cache,ownOverflow=false,insets=true){
    let r={left:box.left,right:box.right,top:box.top,bottom:box.bottom};
    for(let e=element;e&&e!==document.body;e=e.parentElement){const s=getComputedStyle(e),b=e.getBoundingClientRect();
      if(e!==element||ownOverflow){
        if(['hidden','clip'].includes(s.overflowX)){r.left=Math.max(r.left,b.left);r.right=Math.min(r.right,b.right);}
        if(['hidden','clip'].includes(s.overflowY)){r.top=Math.max(r.top,b.top);r.bottom=Math.min(r.bottom,b.bottom);}
      }
      if(insets&&s.clipPath!=='none'){const c=insetRect(e,s,cache);if(c){
        r.left=Math.max(r.left,c.left);r.right=Math.min(r.right,c.right);
        r.top=Math.max(r.top,c.top);r.bottom=Math.min(r.bottom,c.bottom);
      }}
    }
    return r;
  }
  function rect(element,cache,insets=true){return clippedRect(element.getBoundingClientRect(),element,cache,false,insets);}
  function inspect(){
    const p=page();if(!p)return {profile:PROFILE,enabled:false,hits:[],captions:[]};
    const hits=[],captions=[],insetCache=new WeakMap(),selector='.mk-cap,#vivid-captions,.native-subtitles,#user-captions,#captions';
    const obstacles=[...document.querySelectorAll('img,video,[data-caption-obstacle],.mk-title,.mk-cta')].filter(e=>{
      if(e.closest(selector)||e.closest('#vivid-mark,[data-motiongit-signature],[data-motiongit-source-clock]')||!visible(e))return false;
      const b=rect(e,insetCache);if(b.right-b.left<=4||b.bottom-b.top<=4)return false;
      // A narrow visible strip of a large subject still obstructs a caption;
      // clipping must not turn that subject into an ignored small icon.
      const original=e.getBoundingClientRect();return !e.matches('img,video')||original.width>=120&&original.height>=120;
    });
    const textObstacles=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    for(let node;node=walker.nextNode();){
      const e=node.parentElement;if(!node.textContent.trim()||!e||e.closest(selector)||!visible(e)||
        e.closest('script,style,#hud,[data-motiongit-hud],[data-motiongit-content-header],[data-motiongit-source-clock]')||parseFloat(getComputedStyle(e).fontSize)<24)continue;
      const range=document.createRange();range.selectNode(node);
      for(const original of range.getClientRects()){const b=clippedRect(original,e,insetCache,true);
        if(b.right-b.left>4&&b.bottom-b.top>4)textObstacles.push({tag:'TEXT',text:node.textContent,rect:b});}
    }
    for(const element of document.querySelectorAll(selector)){
      if(!element.textContent.trim()||!visible(element))continue;
      // Keep the previous caption bounds: clipping its own text must never
      // disguise an out-of-area caption as a valid, shorter visible box.
      const b=rect(element,insetCache,false),row={selector:element.id?'#'+element.id:'.'+element.classList[0],text:element.textContent,rect:b};
      captions.push(row);
      // Two pixels allow glyph stroke/raster rounding, not a lower publish position.
      if(b.left<p.left-2||b.right>p.right+2||b.top<p.top||b.bottom>p.bottom+2)
        hits.push({...row,kind:'caption-outside-publish-area'});
      for(const obstacle of obstacles){const a=rect(obstacle,insetCache);
        if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>4&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>4)
          hits.push({...row,kind:'caption-subject-overlap',obstacle:{tag:obstacle.tagName,id:obstacle.id,classes:obstacle.className,rect:a}});
      }
      for(const obstacle of textObstacles){const a=obstacle.rect;
        if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>4&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>4)
          hits.push({...row,kind:'caption-readable-text-overlap',obstacle});
      }
    }
    return {profile:PROFILE,enabled:true,preset:'short-video-editorial',officialPlatformGuarantee:false,
      readingArea:{left:p.left,right:p.right,top:p.top,bottom:p.bottom},captions,hits,
      embeddedCaptionPixels:'Not detectable from DOM geometry. Review actual media frames separately.'};
  }
  function assertFrame(){const report=inspect();root.CAPTION_SAFE_STATE=report;
    if(report.hits.length)throw Error('CAPTION_PUBLISH_SAFE: '+JSON.stringify(report.hits[0])+'. Re-layout the specific media/title in the existing visual area, or adjust the optional caption position after checking the intended publish interface. Preserve the subject and complete text; do not crop, shrink everything, or change cue times.');
    return report;
  }
  root.MotionCaptionSafeArea={profile:PROFILE,defaults:DEFAULT,resolve,page,position,wrap,reflowUnits,inspect,assertFrame};
})(globalThis);

/* Explicit consumer inputs. No author media, narration, or implicit demo mode. */
const USER_INPUT=window.KINETIC_INPUT;
const TEXT_GLOBAL=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const RAW_TEXT=id=>{const v=USER_INPUT.content[id];if(v===undefined)throw Error('needs-binding: '+id);return v;};
const TEXT=id=>TEXT_GLOBAL(RAW_TEXT(id));
// Prepared media URLs use forward slashes on every host; read legacy Windows bindings too.
const MEDIA_PATH=value=>value.replaceAll('\\','/');
window.USER_OUTPUT_TIME=0;
window.userPresenter=t=>{const p=USER_INPUT.presenter;if(p.mode==='none')return MEDIA_PATH(USER_INPUT.blank);if(p.mode==='image')return MEDIA_PATH(p.file);return MEDIA_PATH(p.directory)+'/'+String(Math.min(p.frames-1,Math.max(0,Math.floor(t*60+1e-6)))).padStart(5,'0')+'.jpg';};
window.userFace=t=>{
 const p=USER_INPUT.presenter,rows=p.tracking;
 if(!rows?.length)return p.face||{cx:.5,cy:.4,h:.3};
 let i=0;while(i<rows.length-1&&rows[i+1].time<=t)i++;
 const a=rows[i],b=rows[Math.min(i+1,rows.length-1)],k=b.time>a.time?Math.min(1,Math.max(0,(t-a.time)/(b.time-a.time))):0;
 return Object.fromEntries(['cx','cy','h'].map(n=>[n,a[n]+(b[n]-a[n])*k]));
};
window.userPresenterFrame=(image,t,W,H,round=false)=>{
 const p=USER_INPUT.presenter;
 const fit=MotionGitPresenterFraming(p.width||image.naturalWidth||1,p.height||image.naturalHeight||1,W,H,window.userFace(t),{round,reliable:p.mode!=='none'&&(p.tracking?.length>0||p.framing?.status!=='undetected')});
 image.style.cssText=`position:absolute;display:block;max-width:none;left:${fit.x}px;top:${fit.y}px;width:${fit.width}px;height:${fit.height}px`;
 image.dataset.faceCenter=JSON.stringify(fit.faceCenter);
 return fit;
};
window.mediaPoster=id=>MEDIA_PATH(USER_INPUT.media.thumbnail?.file||USER_INPUT.blank);
window.resolveMedia=src=>{
 src=MEDIA_PATH(src);
 if(src.startsWith('brand/')||src==='assets/grain.png')return src;
 if(src.startsWith('talk/'))return window.userPresenter(window.USER_OUTPUT_TIME);
 let role,frame=0,m;
 if((m=src.match(/^assets\/cmt\/c(\d+)/))){const p=USER_INPUT.media.feedback?.[+m[1]];if(!p)throw Error('needs-binding: feedback '+m[1]);return MEDIA_PATH(p.file);}
 if((m=src.match(/^sc\/wall2\/(\d+)\/f_(\d+)/))){role='wall';frame=+m[2]-1;const p=USER_INPUT.media.wall?.[+m[1]];if(!p)throw Error('needs-binding: gallery wall '+m[1]);return p.mode==='image'?MEDIA_PATH(p.file):MEDIA_PATH(p.directory)+'/'+String(frame).padStart(5,'0')+'.jpg';}
 if(src.startsWith('sc/thumb/'))role='thumbnail';
 else if((m=src.match(/^sc\/([^/]+)\/f_(\d+)/))){role=m[1];frame=+m[2]-1;}
 if(role){const p=USER_INPUT.media[role];if(!p)throw Error('needs-binding: '+role);return p.mode==='image'?MEDIA_PATH(p.file):MEDIA_PATH(p.directory)+'/'+String(frame).padStart(5,'0')+'.jpg';}
 if(src===MEDIA_PATH(USER_INPUT.blank)||Object.values(USER_INPUT.media).some(p=>p?.file&&MEDIA_PATH(p.file)===src)||src.startsWith('user-assets/'))return src;
 throw Error('Undeclared media path: '+src);
};
window.kineticInitialize=async()=>{
 await READY;
 window.imgWait=async()=>{const rows=[..._pending].map(im=>({im,src:im.src}));_pending.clear();await Promise.all(rows.map(async({im,src})=>{await im.decode();if(im.src!==src||!im.naturalWidth)throw Error('Current media frame did not decode: '+src);}));};
 const native=window.renderAt;
 const box=document.createElement('div');box.id='user-captions';
 box.style.cssText='position:absolute;left:150px;right:150px;top:930px;text-align:center;font:650 48px/1.24 PuHuiTi,Geist,sans-serif;letter-spacing:.6px;color:white;-webkit-text-stroke:5px rgba(5,6,8,.95);paint-order:stroke fill;pointer-events:none';$('ov').append(box);
 const top=document.createElement('div'),clock=document.createElement('div'),mark=document.createElement('img');
 top.style.cssText='position:absolute;left:72px;top:40px;height:40px;display:flex;align-items:center;font:500 24px "Geist Mono",PuHuiTi,sans-serif;letter-spacing:3px';
 clock.style.cssText='position:absolute;right:72px;top:40px;height:40px;display:flex;align-items:center;font:500 24px "Geist Mono",monospace;letter-spacing:3px';
 mark.style.cssText='position:absolute;right:77px;top:27px;width:66px;height:66px;object-fit:contain;pointer-events:none';top.dataset.motiongitHud='left';clock.dataset.motiongitSourceClock='true';mark.dataset.motiongitSourceClock='true';$('ov').append(top,clock,mark);
 const explicitBranding=USER_INPUT.resolvedBranding;
 if(explicitBranding!=null&&(typeof explicitBranding!=='object'||Array.isArray(explicitBranding)||explicitBranding.policy&&explicitBranding.policy!=='fixed'||explicitBranding.variant!=null&&!['light','dark','lighter','path'].includes(explicitBranding.variant)))throw Error('Invalid fixed branding configuration');
 const fixedTone=['dark','path'].includes(explicitBranding?.variant)?'path':'lighter';
 window.USER_RESOLVED_BRANDING={policy:'fixed',tone:fixedTone,variant:fixedTone==='path'?'dark':'light',source:explicitBranding?.variant?'explicit':'template-theme',samplingScreenshots:0,pixelReads:0};
 clock.style.textShadow=top.style.textShadow=fixedTone==='path'?'0 1px 3px rgba(255,255,255,.85)':'0 1px 3px rgba(0,0,0,.85)';
 mark.style.borderRadius='50%';mark.style.backgroundColor=fixedTone==='path'?'rgba(255,255,255,.35)':'rgba(8,12,18,.35)';
 const marks={};for(const tone of[fixedTone]){marks[tone]=[];for(let i=0;i<132;i++){const im=new Image();im.src=`brand/frames-${tone}/${String(i).padStart(3,'0')}.png`;await im.decode();marks[tone].push(im);}}
 const nativeTKState=tkState;
 tkState=t=>{const s=nativeTKState(t);if(t>=173.25&&t<180.6){const p=EZ.inout(pr(t,173.25,173.8))*(1-EZ.inout(pr(t,179.9,180.6)));for(const[k,n]of Object.entries({x:1700,y:240,w:230,h:230,r:115}))s[k]=lerp(s[k],n,p);}return s;};
 const nativeExtra=window.TK_EXTRA;window.TK_EXTRA=t=>({...nativeExtra?.(t),...(USER_INPUT.presenter.mode==='none'?{o:0}:{})});
 function toneAt(s){return fixedTone;}
 let current=-1,us=[];
 const modernBasicCaption=t=>USER_INPUT.layout==='portrait'&&USER_INPUT.portraitComposition!=='legacy'&&USER_INPUT.presenter.mode!=='none'&&['B1','B2','B3','B4'].includes(USER_INPUT.plan.find(p=>t>=p.outputStart&&t<p.outputEnd)?.id);
 // Balance two measured rows without replacing word nodes or their actual clocks.
 function balancePortraitCaption(element,width){
  if(element.children.length!==2)return;
  const units=[...element.children].flatMap(row=>[...row.children]),widths=units.map(e=>e.getBoundingClientRect().width),total=widths.reduce((a,b)=>a+b,0);
  const text=e=>e.firstChild?.textContent||'',badStart=/^[\s]*[，。！？；：、,.!?;:%％…）】》〉」』〕〗〙〛)>»”’]/u,badEnd=/[（【《〈「『〔〖〘〚(\[{«“‘]\s*$/u;
  let used=0,best=-1,score=Infinity;
  for(let i=1;i<units.length;i++){used+=widths[i-1];const other=total-used;if(!text(units[i]).trim()||badStart.test(text(units[i]))||badEnd.test(text(units[i-1])))continue;if(used<=width+.1&&other<=width+.1&&Math.abs(used-other)<score){best=i;score=Math.abs(used-other);}}
  if(best<0)return;
  const a=document.createElement('div'),b=document.createElement('div');a.style.whiteSpace=b.style.whiteSpace='pre';
  a.append(...units.slice(0,best));b.append(...units.slice(best));element.replaceChildren(a,b);
 }

 function captionAt(t){const i=USER_INPUT.captions.findIndex(c=>t>=c.start&&t<c.end);if(i<0){box.style.opacity=0;current=-1;return;}const c=USER_INPUT.captions[i];if(i!==current){current=i;box.replaceChildren();us=[];delete box.dataset.publishCue;let line=document.createElement('div');line.style.whiteSpace='nowrap';box.append(line);const values=c.units?.length?c.units:MotionCaptionSafeArea.page()?[...new Intl.Segmenter(USER_INPUT.language||'zh',{granularity:'word'}).segment(c.text)].map(v=>({text:v.segment})):[{text:c.text}];for(let j=0;j<values.length;j++){if(c.breakAfter?.includes(j-1)){line=document.createElement('div');line.style.whiteSpace='nowrap';box.append(line);}const u=values[j],e=document.createElement('span');e.textContent=u.text;e.style.cssText='position:relative;display:inline-block;white-space:pre';if(u.start!==undefined){const fill=document.createElement('span');fill.textContent=u.text;fill.style.cssText='position:absolute;inset:0;color:#7db2ff;white-space:pre';e.append(fill);us.push({u,fill});}line.append(e);if(modernBasicCaption(t)&&/^(?:\r?\n|\r)+$/.test(u.text)){if((u.text.match(/\r\n|\r|\n/g)||[]).length>1)throw Error('CAPTION_READABLE_LINES: keep complete text and explicit hard breaks; review a layout needing more than two rows.');Object.assign(e.style,{width:'0px',height:'0px',lineHeight:'0',overflow:'hidden'});if(j<values.length-1&&!c.breakAfter?.includes(j)){line=document.createElement('div');line.style.whiteSpace='nowrap';box.append(line);}}}}
  if(USER_INPUT.creationProfile==='narrated-story/1'){for(const line of box.children){line.style.whiteSpace='pre-wrap';line.style.overflowWrap='anywhere';for(const span of line.children)if(!c.units?.length){span.style.display='inline';span.style.whiteSpace='pre-wrap';}}}
  const publishArea=MotionCaptionSafeArea.page();MotionCaptionSafeArea.position(box,publishArea);
  if(publishArea&&box.dataset.publishCue!==String(i)){MotionCaptionSafeArea.reflowUnits(box,publishArea.width);if(modernBasicCaption(t)&&!c.breakAfter?.length&&!/[\r\n]/.test(c.text)&&!c.units?.some(u=>/[\r\n]/.test(u.text)))balancePortraitCaption(box,publishArea.width);box.dataset.publishCue=String(i);}
  for(const{u,fill}of us)fill.style.clipPath=`inset(0 ${100*(1-clamp((t-u.start)/Math.max(.02,u.end-u.start)))}% 0 0)`;
  box.style.opacity=Math.min(pr(t,c.start,c.start+.08),1-pr(t,c.end-.08,c.end));
 }
 window.renderAt=async t=>{
  if(!Number.isFinite(t)||t<0||t>=USER_INPUT.duration)throw Error('Output time outside plan');
  const p=USER_INPUT.plan.find(p=>t>=p.outputStart&&t<p.outputEnd)||USER_INPUT.plan.at(-1),u=t-p.outputStart,extra=p.outputEnd-p.outputStart-(p.sourceEnd-p.sourceStart),hold=p.holdAt===undefined?Infinity:p.holdAt-p.sourceStart,s=p.sourceStart+(u<hold?u:u<hold+extra?hold:u-extra);
  window.USER_OUTPUT_TIME=t;for(const scene of SCENES)if(p.activeUnits.includes(scene.id)){scene.label=p.title;if(window._kineticSpanKey!==p.key&&scene.bindBasic)scene.bindBasic(p.basic||USER_INPUT.basic);}window._kineticSpanKey=p.key;native(s);if(USER_INPUT.layout==='portrait')window.kineticPortraitAfter(s);$('fade').style.opacity=clamp((t-(USER_INPUT.duration-.5))/.45);HUD.tl.style.opacity=HUD.tr.style.opacity=0;captionAt(t);await window.kineticStoryVisualAt(p,t);
  await imgWait();
  const tone=USER_INPUT.layout==='portrait'?window.kineticPortraitTone(s,956,116,toneAt(s)):toneAt(s),ink=tone==='path'?'#171d21':'#a5b2c0',w=USER_INPUT.markWindows.find(w=>t>=w.start&&t<w.end),a=w?Math.min(pr(t,w.start,w.start+.4),1-pr(t,w.end-.4,w.end))*.52:0;
  top.textContent=p.title;clock.textContent=tcode(t);const portraitHud=USER_INPUT.layout==='portrait'?(SCENES.find(q=>s>=q.s&&s<q.e)?.hudO??1):1;top.style.opacity=portraitHud;top.style.color=USER_INPUT.layout==='portrait'?(window.kineticPortraitTone(s,200,116,toneAt(s))==='path'?'#171d21':'#a5b2c0'):ink;clock.style.color=ink;clock.style.opacity=(1-a/.52)*portraitHud;mark.style.opacity=a*portraitHud;
  if(w)mark.src=marks[tone][Math.min(131,Math.floor((t-w.start)*24))].src;
  window.USER_STATE={storyVisual:window.STORY_VISUAL_STATE,outputTime:t,sourceTime:s,unit:p.id,shotIndex:p.shotIndex,chapter:p.title,phraseFocus:(p.narrationBeats||[]).filter(b=>t>=b.at&&t<b.until).map(b=>b.target),presenter:tkState(s),mark:{tone,opacity:a*portraitHud},captions:[...box.children].map(e=>({text:e.textContent,width:e.getBoundingClientRect().width}))};
  await imgWait();
 };
 if(USER_INPUT.layout==='portrait')await window.kineticPortraitInit();
 window.USER_READY=true;
};
