/* Portrait positions are a derivative layer. Original node transforms and source clocks stay intact. */
(() => {
 if(USER_INPUT.layout!=='portrait')return;
 document.documentElement.dataset.layout='portrait';
 for(const c of document.querySelectorAll('#stage>canvas')){c.width=1080;c.height=1920;}
 const defs={
  A:[960,540,540,900,.8],B:[960,540,540,900,.8],C:[960,540,540,900,.8],D:[960,540,540,850,.75],F:[960,540,540,850,.72],
  S01:[650,540,540,690,.83],S02:[620,540,540,820,.8],S03:[680,540,540,800,.78],S04:[960,540,540,900,.8],S05:[700,540,540,780,.72],S06:[700,540,540,780,.8],S07:[960,540,540,800,.72],S08:[1120,540,540,800,.8],S09:[1050,540,540,820,.75],S10:[660,540,540,800,.83],S11:[680,530,540,870,1.12],S12:[960,540,540,850,.75],S13:[700,540,540,800,.78],S14:[900,540,540,800,.73],S15:[960,540,540,800,.75],S16:[700,540,540,800,.8],S17:[960,540,540,800,.75],END:[960,540,540,820,.8],
  B1:[650,540,540,800,.9],B2:[650,540,540,800,.9],B3:[785,540,540,800,.8],B4:[650,540,540,800,.9]
 };
 // kinetic-portrait-composition/2: independent upper content and centered person lanes.
 const centeredPresenter=USER_INPUT.portraitComposition!=='legacy'&&USER_INPUT.presenter.mode!=='none';
 const basicAt=t=>(t>=250&&t<258)||(t>=260&&t<270)||(t>=272&&t<282)||(t>=284&&t<292);
 if(centeredPresenter)for(const id of ['B1','B2','B4'])defs[id][3]=520;
 if(centeredPresenter){defs.B2[3]=490;if(USER_INPUT.plan.some(p=>p.id==='B2'&&p.basic?.points?.length>=5)){defs.B2[3]=430;defs.B2[4]=.78;}}
 const at=(sx,sy,x,y,s=1)=>({a:s,b:0,c:0,d:s,e:x-s*sx,f:y-s*sy});
 // fixed-branding/1: gallery backgrounds never trigger pixel sampling.
 window.kineticPortraitTone=(s,x,y,fallback)=>window.USER_RESOLVED_BRANDING?.tone||fallback||'lighter';
 const nodes={
  S01:{3:[72,450,.95],4:[72,650,1.15],5:[282,650,1.15],6:[512,650,1.15],7:[72,340,1.4],8:[72,600,1],9:[72,460,.88],10:[72,680,.85],11:[72,830,1.3],12:[72,920,1.3],13:[540,490,1.2],14:[540,710,1],15:[540,930,1.1],16:[72,1110,.98],17:[72,650,1.05]},
  A:{1:[0,0,1,0,0],3:[540,1000,1],4:[72,1775,1.4]},
  B:{1:[72,620,.4875,0,0],2:[72,620,1,0,0],3:[968,620,1,0,0],4:[72,1107,1,0,0],5:[968,1107,1,0,0],6:[72,1290,1.1],7:[1008,400,1.1]},
  C:{1:[0,0,1,0,0],2:[72,1750,1.1]},
  D:{1:[390,980,.65,1170,540],2:[690,980,.65,1560,560],3:[72,400,.8],4:[540,900,1.2],5:[540,1180,1.2]},
  F:{1:[72,620,.4875,0,0],2:[72,1290,1.1],3:[72,620,.4875,0,0]},
  S02:{0:[0,0,1,0,0],1:[72,1100,1.4],2:[72,320,1.05],3:[900,230,.8],4:[72,840,1],5:[-788,200,1,0,0],6:[72,560,1],17:[840,300,.9],18:[72,280,1.05]},
  S04:{0:[540,760,.8],1:[540,480,1.2],2:[72,460,.9],3:[540,670,.88],4:[540,460,.9],5:[540,900,.8],6:[540,1190,1.2]},
  S05:{0:[540,670,1],1:[540,910,1.1],2:[540,360,1.2],3:[540,830,.8],8:[72,390,.9],10:[540,820,1],11:[72,380,1],13:[72,1170,1.1],15:[540,1190,1.2],17:[1008,360,1.3],19:[540,470,1.1],20:[540,1180,1.2]},
  S06:{0:[72,430,.95],1:[540,820,1],6:[540,1140,1],7:[540,1150,1.2],8:[540,300,1.2],9:[72,450,1]},
  S07:{1:[72,320,.9],6:[540,320,1.3],19:[72,320,1],26:[72,350,.95]},
  S08:{0:[72,370,1],1:[540,1120,.88],9:[540,840,.85],10:[72,330,.95],11:[540,1080,1.1]},
  S09:{2:[72,400,1],3:[72,630,1],4:[72,910,1.3],7:[540,400,1]},
  S10:{1:[540,1150,1.3],6:[72,460,1],7:[72,350,.9],8:[72,350,.95],9:[72,350,.95]},
  S11:{8:[72,350,1]},
  S12:{0:[540,300,.58],1:[72,480,1],2:[72,680,1.4],4:[72,350,.9],5:[540,820,.9],6:[350,850,.9],7:[840,850,.9],8:[540,1150,1.1],10:[540,1000,.95],11:[72,430,1],12:[72,1180,1.2]},
  S13:{5:[72,370,1],8:[540,350,1.2],9:[72,390,1],16:[540,400,.9],19:[72,370,1]},
  S14:{3:[540,350,1],5:[540,1250,1.2],6:[1008,1450,1.3],9:[72,400,.95],11:[72,350,.95],16:[540,1100,.95],17:[72,820,.95],18:[72,380,1]},
  S15:{0:[72,350,1],1:[72,350,1.2],2:[72,670,1.15],3:[72,1030,1.15],4:[72,930,1],5:[72,350,1.2]},
  S16:{1:[850,1180,.85],2:[72,390,1],3:[72,1050,1],4:[72,1230,1]},
  S17:{0:[72,640,1],6:[540,850,.95],7:[540,780,.95],8:[540,1040,.95],9:[540,600,1],10:[540,930,1],11:[720,930,1],12:[540,1210,1.2],13:[72,750,1]},
  END:{0:[540,650,1],1:[540,950,1.3],2:[540,1120,1],3:[540,820,.8]}
 };
 // Each feedback carrier keeps its own original entry/rotation, in a two-column portrait arrangement.
 const commentBase=[[1090,300],[1540,360],[1150,500],[1600,580],[1070,720],[1500,790],[1300,260],[1660,450],[1130,620],[1470,690]];
 commentBase.forEach(([x,y],i)=>nodes.S02[7+i]=[i%2?780:300,500+Math.floor(i/2)*155,.9,x,y]);
 nodes.S01[1]=[0,0,1,0,0];
 Object.assign(nodes.S09,{'overlay:0':[540,650,.9],'overlay:1':[540,950,.85],'overlay:2':[540,430,1.3]});
 Object.assign(nodes.S05,{3:[350,834,.8],9:[254,866,.8,400,560],10:[526,866,.8,740,560],12:[540,850,1.1,560,470],13:[540,1169,1.1],14:[-76,333,1.1,0,0],15:[760,1050,1],16:[540,900,1]});
 for(let i=4;i<=7;i++)nodes.S05[i]=[-66,418,.8,0,0];
 Object.assign(nodes.S06,{0:[72,650,.8],1:[700,740,.7],6:[540,1080,1],7:[430,940,1.2]});
 for(let i=2;i<=5;i++)nodes.S06[i]=[70,404,.7,0,0];
 Object.assign(nodes.S09,{0:[330,860,.8,1010,492],1:[-478,466.4,.8,0,0],2:[600,500,.75],3:[600,730,1.1],4:[600,1000,.65],5:[540,850,1.05,1100,560],6:[540,850,1.05,1100,560]});
 Object.assign(nodes.S12,{3:[540,800,.65],6:[330,900,.85],7:[850,900,.9],8:[540,1150,1.1,980,800]});
 Object.assign(nodes.S13,{0:[216,800,.9],1:[540,800,.9],2:[864,800,.9],3:[378,800,.9],4:[702,800,.9],6:[540,850,1.1],7:[540,1160,1.1],9:[72,460,1],10:[540,900,1.3],15:[360,1100,1,1150,640],17:[540,850,1],18:[540,850,.9]});
 for(let i=11;i<=14;i++)nodes.S13[i]=[-136,107,1.3,0,0];
 Object.assign(nodes.S14,{0:[540,650,1.1,560,560],1:[540,1080,1.1,1200,560],2:[700,1180,1,1360,650],4:[540,850,.585],5:[540,1320,1.1],7:[330,850,1.3],8:[780,860,1.2,1430,560],10:[540,850,1.2,1100,540]});
 nodes.S14[6]=[1008,1260,1.3];
 [255,635,1015,1395].forEach((x,i)=>nodes.S14[12+i]=[i%2?780:300,i<2?670:1020,1.15,x,470]);
 nodes.S16[0]=[540,800,.88,840,470];nodes.S17[6]=[72,850,.95];
 nodes.S06[6]=[540,1010,1];
 for(let i=1;i<=5;i++)nodes.S17[i]=[72+(i%2?0:80),500+(i-1)*148,1.1];
 nodes.B3=centeredPresenter?{1:[72,280,1],2:[72,400,.95],3:[300,650,.82],4:[780,650,.82],5:[72,870,.79]}:{1:[72,400,1],2:[72,550,.95],3:[300,870,.82],4:[780,870,.82],5:[72,1180,.79]};
 const scanPositions=[[300,656],[300,1088],[780,1520],[780,872],[780,1304]],sourceScan=[[1010,360],[1370,360],[1730,360],[1190,590],[1550,590]];
 scanPositions.forEach(([x,y],i)=>nodes.S08[2+i]=[x,y,1,...sourceScan[i]]);nodes.S08[11]=[560,1440,1.3];
 const references=new Map();
 [[520,300],[1180,300],[520,690],[1180,690]].forEach(([x,y],i)=>nodes.S07[2+i]=[i%2?780:300,i<2?650:1050,.7,x,y]);
 for(let i=0;i<6;i++)nodes.S07[20+i]=[540,500+i*110,1.1];nodes.S07[26]=[540,320,1.1];
 function affine(unit){const a=defs[unit];if(!a)throw Error('Portrait mapping missing: '+unit);let sx=a[0];if(USER_INPUT.narrationLayout==='balanced'&&USER_INPUT.presenter.mode==='none'&&['B1','B2','B4'].includes(unit))sx+=300;return{a:a[4],b:0,c:0,d:a[4],e:a[2]-a[4]*sx,f:a[3]-a[4]*a[1]};}
 const matrix=m=>`matrix(${m.a},${m.b},${m.c},${m.d},${m.e},${m.f})`;
 window.kineticPortraitFX=(ctx,unit,fn,t)=>{
  let m=affine(unit);
  if(unit==='S02')m=t<NATIVE_CUE('cue-016')?at(1340,470,540,750,.9):at(860,640,72,840);
  if(unit==='S04')m=t<NATIVE_CUE('cue-038')?at(1120,630,540,1010,.9):at(960,540,540,900,t<NATIVE_CUE('cue-041')?.65:.8);
  if(unit==='S05')m=t<NATIVE_CUE('cue-044')?at(960,470,540,670,.95):t>=NATIVE_CUE('cue-055')?at(600,540,540,820,1):at(520,540,350,850,.8);
  if(unit==='S06')m=t<NATIVE_CUE('cue-066')?at(900,480,700,740,.7):at(960,470,540,900,.9);
  if(unit==='S14')m=at(1100,540,540,850,1.2);
  if(unit==='S16'&&t<NATIVE_CUE('cue-182'))m=at(1180,700,850,1180,.85);
  if(unit==='S17')m=t>=NATIVE_CUE('cue-193')?at(470,640,540,930):at(860,520,540,850);
  if(unit==='END')m=at(960,400,540,650);
  if(unit==='B3')m=at(785+(USER_INPUT.presenter.mode==='none'?175:0),530,540,centeredPresenter?650:870,54/110);
  if(unit==='D')m=at(960,500,540,900,1.2);
  ctx.transform(m.a,m.b,m.c,m.d,m.e,m.f);fn(ctx,t);
 };
 window.kineticPortraitCamera=cam=>`translate(${(cam.sx||0)*.75}px,${(cam.sy||0)*.75}px) scale(${cam.z||1}) rotate(${cam.r||0}deg) translate(${(960-(cam.x||960))*.75}px,${(540-(cam.y||540))*.75}px)`;
 function person(s,t){
  const round=Math.max(0,Math.min(1,(s.r/(Math.min(s.w,s.h)/2)-.3)/.7));
  const k=lerp(.67,.82,round),w=s.w*k,h=s.h*k;
  const lift=EZ.inout(pr(t,78.71666666666667,78.96666666666667))*(1-EZ.inout(pr(t,90.06666666666666,90.66666666666666)));
  if(centeredPresenter&&basicAt(t))return {...s,x:540,y:1040,w,h,r:Math.min(w,h)/2*round+4*(1-round)};
  return {...s,x:lerp(540+(s.x-960)*.40,540+(s.x-960)*.43,round),y:lerp(1470+(s.y-540)*.12,1420+(s.y-236)*.08-lift*1180,round),w,h,r:Math.min(w,h)/2*round+4*(1-round)};
 }
 window.kineticPortraitInit=async()=>{
  const oldState=tkState;tkState=t=>{TK._dim.style.display=centeredPresenter&&basicAt(t)?'none':'';const result=person(oldState(t),t),u=EZ.inout(pr(t,123.28666666666666,123.73666666666666))*(1-EZ.inout(pr(t,132.86666666666667,133.31666666666666)));if(u>0){result.x=lerp(result.x,850,u);result.y=lerp(result.y,1470,u);const k=lerp(1,270/375.2,u);result.w*=k;result.h*=k;result.r*=k;}return result;};
  const name=document.createElement('span'),row=document.createElement('div');name.textContent=USER_INPUT.presenterLabel;row.style.cssText='display:flex;align-items:center;gap:10px';row.append(TK._dot,name);TK._lab.replaceChildren(row,TK._dim);Object.assign(TK._lab.style,{top:'-62px',display:'flex',flexDirection:'column',gap:'3px',fontSize:'20px',letterSpacing:'1.5px'});TK._dim.style.fontSize='16px';
  const inventory=[];
  for(const sc of SCENES)for(const [layer,parent]of[['content',sc.el],['overlay',sc.top]]){
   const previousDisplay=parent.style.display;parent.style.display='block';
   for(const e of [...parent.children].filter(e=>e.classList.contains('e'))){
    const child=e.firstElementChild,index=e.dataset.nativeNode;
    if(sc.id==='END'&&layer==='content'&&index==='3'){
      child.style.width='888px';child.style.padding='44px';child.style.whiteSpace='normal';const head=child.firstElementChild;head.style.flexWrap='wrap';head.style.gap='24px';head.children[1].lastElementChild.style.fontSize='76px';head.children[2].style.width='100%';head.children[2].style.textAlign='left';head.children[2].style.marginLeft='0';head.children[2].style.display='flex';head.children[2].style.justifyContent='space-between';
      e.querySelector('.g1').style.fontSize='42px';e.querySelector('.g2').style.fontSize='30px';e.querySelector('.pl').style.flexWrap='wrap';for(const chip of e.querySelectorAll('.chip'))chip.style.fontSize='24px';nodes.END[3]=[540,950,1];
    }
    if(sc.id==='S05'&&index==='16'){child.style.width='936px';child.style.height='900px';e.querySelector('.at').style.flexWrap='wrap';e.querySelector('.st').style.gridTemplateColumns='repeat(2,330px)';}
    if(sc.id==='S08'&&index==='7'){child.style.width='936px';child.style.height='312px';child.style.background='linear-gradient(180deg,rgba(47,123,255,0),rgba(47,123,255,.55) 70%,rgba(160,200,255,.95) 92%,rgba(47,123,255,0))';}
    const w=child?.offsetWidth||e.offsetWidth,h=child?.offsetHeight||e.offsetHeight;
    inventory.push({unit:sc.id,layer,index,x:e._x,y:e._y,ax:e._ax,ay:e._ay,width:w,height:h,text:e.textContent.slice(0,120),images:e.querySelectorAll('img').length,tag:child?.tagName});
    const wrapper=document.createElement('div');wrapper.className='portrait-node';wrapper.dataset.forNode=index;parent.insertBefore(wrapper,e);wrapper.append(e);
    references.set(sc.id+':'+layer+':'+index,{e,wrapper});
    let m=affine(sc.id),custom=nodes[sc.id]?.[layer+':'+index]||((layer==='content'||['A','B','C','D','F'].includes(sc.id))?nodes[sc.id]?.[index]:null);
    if(custom)m=at(custom[3]??e._x,custom[4]??e._y,custom[0],custom[1],custom[2]);
    if(w>=1900&&h>=1070&&e._x===0&&e._y===0&&!e.querySelector('img')){
      // Backgrounds fill the real viewport independently of foreground placement.
      m={a:1,b:0,c:0,d:1,e:0,f:0};if(child){child.style.width='1080px';child.style.height='1920px';}
    }else if(child.tagName.toLowerCase()!=='svg'&&w>0&&w*m.a>936&&!((['A','C'].includes(sc.id)&&index==='1')||(sc.id==='S01'&&index==='1')||(sc.id==='S02'&&index==='0'))){const s=936/w,targetX=custom?.[0]??540,targetY=custom?.[1]??800;m=at(e._x,e._y,targetX,targetY,s);if(e._ax===0)m.e=72-s*e._x;}
    if(sc.id==='B'&&+index>=2&&+index<=5){child.style.left='0';child.style.top='0';child.style.right='';child.style.bottom='';}
    if(sc.id==='S12'&&layer==='overlay'&&index==='0'){
      const fz=e.querySelector('.fz'),fe=e.querySelector('.fe'),gift=e.querySelector('.gf');Object.assign(fz.style,{left:'72px',top:'480px',fontSize:'180px'});Object.assign(fe.style,{left:'76px',top:'800px',fontSize:'110px'});Object.assign(gift.style,{right:'310px',top:'1090px'});
      const line=gift.parentElement.lastElementChild;Object.assign(line.style,{left:'80px',top:'1600px',fontSize:'28px'});
    }
    if(sc.id==='S12'&&layer==='content'&&index==='9'){
      child.style.gridTemplateColumns='repeat(5,174px)';for(const tile of child.children){tile.style.width='174px';tile.style.height='98px';}m=at(e._x,e._y,540,850,1);
    }
    if(sc.id==='S14'&&layer==='content'&&index==='4'){
      const clip=document.createElement('div');clip.style.cssText='position:absolute;left:72px;top:440px;width:936px;height:780px;overflow:hidden;border:1.5px solid rgba(233,236,239,.18);border-radius:18px;background:#0b0e13';parent.insertBefore(clip,wrapper);clip.append(wrapper);m.e-=72;m.f-=440;references.get(sc.id+':'+layer+':'+index).clip=clip;
    }
    if(sc.id==='S07'&&layer==='overlay'){
      child.style.width='1080px';child.style.height='1920px';m=at(0,0,0,0);const word=e.querySelector('.w');word.style.fontSize=index==='2'?'150px':'160px';word.style.top=index==='2'?'22%':'50%';if(word.scrollWidth>610)word.style.fontSize=(parseFloat(word.style.fontSize)*610/word.scrollWidth)+'px';
      for(const q of child.querySelectorAll('.bar,.bf'))q.style.width='936px';for(const q of child.children)if(q.style.top==='56px')q.style.fontSize='30px';
      if(index==='2'){const rf=e.querySelector('.e>div');if(rf){rf.style.width='1080px';rf.style.height='1920px';}}
    }
    if(sc.id==='END'&&layer==='overlay'&&+index<4){child.style.left='0';child.style.top='0';child.style.right='';child.style.bottom='';}
    if(sc.id==='END'&&layer==='overlay'&&index==='4')m=at(e._x,e._y,540,1680,1.25);
    wrapper.style.transform=matrix(m);
   }
   parent.style.display=previousDisplay;
  }
  HUD.k.forEach((e,i)=>{e._x=i%2?1024:30;e._y=i<2?30:1858;});HUD.bl._x=72;HUD.bl._y=1840;HUD.br._x=930;HUD.br._y=1840;HUD.xh._x=972;HUD.xh._y=1840;HUD.bl.firstChild.style.fontSize='24px';
  const captions=$('user-captions');captions.style.left='80px';captions.style.right='80px';captions.style.top='1615px';captions.style.fontSize='50px';captions.style.lineHeight='1.28';
  const ov=$('ov'),texts=[...ov.children].filter(e=>e!==captions&&e.tagName==='DIV');
  for(const e of texts){if(e.style.left){e.style.top='94px';e.style.height='44px';e.style.fontSize='32px';e.style.left='96px';e.style.maxWidth='620px';e.style.whiteSpace='nowrap';}else if(e.style.right){e.style.top='94px';e.style.height='44px';e.style.fontSize='32px';e.style.right='96px';}}
  for(const e of ov.querySelectorAll(':scope>img')){e.style.top='88px';e.style.right='96px';e.style.width='56px';e.style.height='56px';}
  window.PORTRAIT_INVENTORY=inventory;
  window.kineticPortraitAfter=t=>{
    function move(unit,layer,index,x,y,s){const r=references.get(unit+':'+layer+':'+index);if(!r?.e._lastPlace)return;const p=r.e._lastPlace;r.wrapper.style.transform=matrix(at(p.x,p.y,x,y,s));}
    const file=references.get('S05:content:3');
    if(file&&t>NATIVE_CUE('cue-050')&&t<NATIVE_CUE('cue-051')+.4){const f=EZ.spring(pr(t,NATIVE_CUE('cue-050')+.08,NATIVE_CUE('cue-050')+.7)),c=EZ.inout(pr(t,NATIVE_CUE('cue-051')-.15,NATIVE_CUE('cue-051')+.35));move('S05','content',3,lerp(lerp(540,840,f),240,c),lerp(lerp(1170,800,f),520,c),.8);}else if(file)file.wrapper.style.transform=matrix(at(520,540,350,850,.8));
    const timeline=references.get('S12:content:3');if(timeline){const side=EZ.inout(pr(t,NATIVE_CUE('cue-135')-.3,NATIVE_CUE('cue-135')+.2)),suck=EZ.in(pr(t,NATIVE_CUE('cue-136')-.4,NATIVE_CUE('cue-136')+.25));move('S12','content',3,lerp(lerp(540,790,side),850,suck),lerp(lerp(800,740,side),900,suck),.65);}
    if(references.has('S08:content:7')){const x=references.get('S08:content:7').e._lastPlace?.x??780,Y=380+(x-780)*1.2;move('S08','content',7,540,Y,1);move('S08','content',8,650,Y-220,1.15);}
    for(let i=0;i<12;i++){const side=EZ.inout(pr(t,NATIVE_CUE('cue-076')-.3,NATIVE_CUE('cue-076')+.2));move('S07','content',7+i,lerp(i%2?780:300,132+(i%3)*145,side),lerp(430+Math.floor(i/2)*200,600+Math.floor(i/3)*120,side),lerp(.85,.6,side));}
    const category=references.get('S07:content:4');if(category?.e._lastPlace){const zoom=clamp((category.e._lastPlace.s-1)/1.4);move('S07','content',4,lerp(300,540,zoom),lerp(1050,850,zoom),lerp(.7,.62,zoom));}
    for(const r of references.values())if(r.clip){const o=+r.e.style.opacity;r.clip.style.visibility=r.e.style.visibility;r.clip.style.borderColor=`rgba(233,236,239,${.18*o})`;r.clip.style.background=`rgba(11,14,19,${o})`;}
    const card=references.get('END:content:3');if(card){const endHit=HIT('final'),sp=EZ.out5(pr(t,endHit-.02,endHit+.28)),r=card.e.getBoundingClientRect();const points=[[lerp(30,r.left-20,sp),lerp(30,r.top-20,sp)],[lerp(996,r.right+20-54,sp),lerp(30,r.top-20,sp)],[lerp(30,r.left-20,sp),lerp(1836,r.bottom+20-54,sp)],[lerp(996,r.right+20-54,sp),lerp(1836,r.bottom+20-54,sp)]];points.forEach(([x,y],i)=>move('END','overlay',i,x,y,1));}
  };
 };
})();
