


function nleTimeline(parent, x, y, w, h, tracks = 6, seed = 1) {
  const COLS = ['#3a6fd8', '#b8862a', '#6a4fc9', '#2f9a7a', '#c45a3c', '#5f6b7a'];
  let html = `<div style="position:relative;width:${w}px;height:${h}px;border-radius:14px;background:#111419;border:1px solid rgba(233,236,239,.12);overflow:hidden">
    <div style="position:absolute;left:0;right:0;top:0;height:34px;background:#171b21;border-bottom:1px solid rgba(233,236,239,.08)"></div>`;
  for (let i = 0; i <= 40; i++) html += `<div style="position:absolute;left:${110 + i * (w - 120) / 40}px;top:${i % 5 ? 22 : 12}px;width:1px;height:${i % 5 ? 12 : 22}px;background:rgba(233,236,239,.25)"></div>`;
  const th = (h - 46) / tracks;
  const clips = [];
  for (let r = 0; r < tracks; r++) {
    html += `<div style="position:absolute;left:12px;top:${42 + r * th + th / 2 - 9}px;${MONO(13, DIM, 1)}">${r < 3 ? 'V' + (3 - r) : 'A' + (r - 2)}</div>`;
    let cx = 110;
    while (cx < w - 10) {
      const cw = 14 + hash(r * 91 + cx * .37 + seed) * 70;
      clips.push({ r, x: cx, w: Math.min(cw, w - 10 - cx), c: COLS[(r + Math.floor(cx / 37)) % COLS.length] });
      cx += cw + 3;
    }
  }
  html += clips.map((c, i) => `<div class="cl" style="position:absolute;left:${c.x.toFixed(1)}px;top:${(42 + c.r * th + 4).toFixed(1)}px;width:${c.w.toFixed(1)}px;height:${(th - 8).toFixed(1)}px;border-radius:3px;background:${c.c};opacity:.85"></div>`).join('');
  html += `<div class="ph" style="position:absolute;left:110px;top:0;width:2px;height:100%;background:#FF4D3D"><div style="position:absolute;left:-7px;top:0;width:16px;height:16px;background:#FF4D3D;clip-path:polygon(0 0,100% 0,50% 100%)"></div></div>
    <div class="fc" style="position:absolute;right:16px;top:6px;font:600 18px 'Geist Mono';color:#FF8A7A;letter-spacing:1px"></div></div>`;
  const e = mk(parent, html, x, y, { ax: .5, ay: .5 });
  e._cl = [...e.querySelectorAll('.cl')]; e._clips = clips; e._ph = e.querySelector('.ph'); e._fc = e.querySelector('.fc'); e._w = w;
  return e;
}


(() => {
if(!USER_INPUT.selected.includes("S12"))return;
window.CURRENT_UNIT="S12";

  const T0 = O(113.05), T1 = O(131.26);
  const sc = SC(T0, T1, BG, '12 — 初衷');
  const D = sc.el;
  const tSafe = NATIVE_CUE("cue-130"), tDay = NATIVE_CUE("cue-131"), tWhy = NATIVE_CUE("cue-132"), tFrame = NATIVE_CUE("cue-133"), tMad = NATIVE_CUE("cue-134"), tLow = NATIVE_CUE("cue-135"), tEasy = NATIVE_CUE("cue-136"),
    tMy = NATIVE_CUE("cue-137"), tFree = HIT('free'), tEnd = NATIVE_CUE("cue-138"), tCur = NATIVE_CUE("cue-139");
  TKF.push([T0, 'R', .5, true], [tSafe - .1, 'C', .6, true], [tFrame - .3, 'TR', .5, true], [tFree - .02, 'TR', 0, false], [tEnd - .25, 'R', .45, true]);
  
  const day = mk(D, `<div style="display:flex;justify-content:space-between;width:1560px"><span style="${MONO(20, DIM, 8)}">${TEXT("S12.text001")}</span><span style="${MONO(20, DIM, 8)}">${TEXT("S12.text002")}</span></div>`, 960, 160, { ax: .5, ay: .5 });
  const whyL = mk(D, `<div style="${HV(110, SILVER, 6)};${METAL}">${TEXT("S12.text003")}</div>`, 200, 470, { ax: 0, ay: .5 });
  const whyR = mk(D, `<div style="${MONO(20, BLUE2, 5)};line-height:2">${TEXT("S12.text004")}<br>${TEXT("S12.text005")}</div>`, 1460, 470, { ax: 0, ay: .5 });
  
  const tl = nleTimeline(D, 860, 560, 1440, 380, 6, 7);
  const tlLab = mk(D, `<div style="display:flex;align-items:baseline;gap:20px"><span style="${HV(70, SILVER, 4)}">${TEXT("S12.text006")}</span><span style="${MONO(20, DIM, 4)}">${TEXT("S12.text007")}</span></div>`, 140, 260, { ax: 0, ay: .5 });
  const mad = mk(D, `<div style="${HV(150, RED, 6)};filter:drop-shadow(0 0 30px rgba(255,77,61,.4))">${TEXT("S12.text008")}</div>`, 860, 560, { ax: .5, ay: .5 });
  
  const thr = mk(D, `<div style="position:relative;width:520px;height:380px">
      <div class="bar" style="position:absolute;left:0;bottom:0;width:520px;height:300px;background:linear-gradient(180deg,rgba(47,123,255,.9),rgba(47,123,255,.25));border-top:4px solid ${BLUE2};transform-origin:50% 100%"></div>
      <div style="position:absolute;left:-20px;right:-20px;bottom:0;height:2px;background:rgba(233,236,239,.4)"></div>
      <div class="lb" style="position:absolute;left:0;top:-10px;${HV(64, SILVER, 4)}">${TEXT("S12.text009")}</div></div>`, 430, 560, { ax: .5, ay: .5 });
  const thrBar = thr.querySelector('.bar'), thrLb = thr.querySelector('.lb');
  const file = motionFile(D, 1500, 560, 200, { name: 'template.motion' });
  const clean = mk(D, `<div style="width:780px"><div style="${MONO(18, DIM, 4)};margin-bottom:12px">${TEXT("S12.text010")}</div><div style="height:16px;border-radius:9px;background:#1b1f26;overflow:hidden"><div class="cf" style="height:100%;width:0;background:linear-gradient(90deg,${BLUE},${BLUE2})"></div></div></div>`, 860, 800, { ax: .5, ay: .5 });
  const cf = clean.querySelector('.cf');
  
  const IDS = [605, 607, 609, 611, 613, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 615, 616, 617, 618, 619, 620, 621, 622];
  const wall = mk(D, `<div style="display:grid;grid-template-columns:repeat(7,180px);gap:10px">${Array.from({ length: 35 }, (_, i) => `<div style="width:180px;height:101px;border-radius:6px;overflow:hidden;background:#111"><img class="wi" style="width:100%;height:100%;object-fit:cover;display:block"></div>`).join('')}</div>`, 840, 470, { ax: .5, ay: .5 });
  const wis = [...wall.querySelectorAll('.wi')];   
  
  const free = mk(sc.top, `<div style="position:relative;width:1920px;height:1080px;background:radial-gradient(ellipse 80% 70% at 50% 45%,#FFD25A 0%,#F5B92E 55%,#C98A10 100%);overflow:hidden">
      <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(0,0,0,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.07) 1px,transparent 1px);background-size:64px 64px"></div>
      <div class="gf" style="position:absolute;right:170px;top:200px">${lineIcon('gift', 460, '#0A0B0D', '255,255,255')}</div>
      <div class="fz" style="position:absolute;left:150px;top:300px;${HV(210, '#0A0B0D', 8)}">${TEXT("S12.text011")}</div>
      <div class="fe" style="position:absolute;left:156px;top:560px;${AN(150, '#0A0B0D', 6)}">${TEXT("S12.text012")}</div>
      <div style="position:absolute;left:160px;top:760px;${MONO(22, '#0A0B0D', 6)};opacity:.75">${TEXT("S12.text013")}</div></div>`, 0, 0, { ax: 0, ay: 0 });
  const fz = free.querySelector('.fz'), fe = free.querySelector('.fe'), gf = free.querySelector('.gf');
  
  const prog = mk(D, `<div style="position:relative;width:900px;height:120px">
      <div style="position:absolute;left:0;top:60px;width:900px;height:6px;border-radius:3px;background:#1d2128"></div>
      <div class="pf" style="position:absolute;left:0;top:60px;height:6px;border-radius:3px;background:${BLUE};width:0"></div>
      <div class="ed" style="position:absolute;right:-14px;top:49px;width:28px;height:28px;border-radius:50%;background:${GOLD};box-shadow:0 0 0 0 rgba(245,185,46,.5)"></div>
      <div style="position:absolute;right:-40px;top:0;${MONO(18, GOLD, 4)}">${TEXT("S12.text014")}</div>
      <div style="position:absolute;left:0;top:90px;${MONO(16, DIM, 3)}">${TEXT("S12.text015")}</div></div>`, 600, 520, { ax: .5, ay: .5 });
  const pf = prog.querySelector('.pf'), ed = prog.querySelector('.ed');
  const teach = mk(D, `<div style="display:flex;flex-direction:column;gap:12px"><span style="${MONO(20, BLUE2, 5)}">${TEXT("S12.text016")}</span><span style="${HV(88, SILVER, 4)}">${TEXT("S12.text017")}<span style="${GOLDF}">${TEXT("S12.text018")}</span></span></div>`, 150, 330, { ax: 0, ay: .5 });
  const this1 = mk(D, `<div class="chip" style="font-size:22px;padding:10px 22px;border-color:${GOLD};color:${GOLD}">${TEXT("S12.text019")}</div>`, 150, 700, { ax: 0, ay: .5 });

  sc.update = t => {
    show(day, t, tDay - .1, { k: 'blur', d: .5, out: tFrame - .4 });
    show(whyL, t, tWhy - .05, { k: 'mask', d: .45, out: tFrame - .4 });
    show(whyR, t, tWhy + .1, { k: 'right', d: .45, out: tFrame - .4 });
    
    const tlIn = pr(t, tFrame - .35, tFrame + .1), suck = EZ.in(pr(t, tEasy - .4, tEasy + .25));
    const madK = pr(t, tMad - .1, tMad + .1) * (1 - pr(t, tLow - .3, tLow));
    const jx = madK * (hash(Math.floor(t * 30)) - .5) * 24, jy = madK * (hash(Math.floor(t * 30) + 3) - .5) * 14;
    const side = EZ.inout(pr(t, tLow - .3, tLow + .2));
    place(tl, { o: clamp(tlIn * 3) * (1 - suck), y: lerp(560 + (1 - EZ.out(tlIn)) * 80, 580, side) + jy, x: lerp(lerp(860, 1040, side), 1500, suck) + jx, s: lerp(1, .45, side) * (1 - suck * .8), r: madK * (hash(Math.floor(t * 20)) - .5) * 3 });
    const steps = Math.floor(Math.max(0, t - tFrame) * 6.5);
    tl._ph.style.left = (110 + Math.min(steps * 3, tl._w - 130)) + 'px';
    setTxt(tl._fc, RAW_TEXT("S12.text020") + String(Math.floor(Math.max(0, USER_OUTPUT_TIME) * 60) % 100000).padStart(5, '0'));
    tl._cl.forEach((c, i) => {
      const k = madK * hash(i * 1.7);
      c.style.transform = k > .02 ? `translate(${((hash(i * 3.1) - .5) * 260 * k).toFixed(1)}px,${((hash(i * 5.3) - .5) * 160 * k).toFixed(1)}px) rotate(${((hash(i) - .5) * 60 * k).toFixed(1)}deg)` : '';
    });
    show(tlLab, t, tFrame - .2, { k: 'left', d: .4, out: tLow - .3 });
    const mp = pr(t, tMad - .03, tMad + .2);
    place(mad, { s: 1 + (1 - EZ.out5(mp)) * 1.4, o: clamp(mp * 5) * (1 - pr(t, tLow - .3, tLow - .05)), r: -4 });
    
    show(thr, t, tLow - .25, { k: 'up', d: .4, out: tMy - .3 });
    const drop = EZ.spring(pr(t, NATIVE_CUE("cue-140")[2], NATIVE_CUE("cue-141")[3] + .5));
    thrBar.style.transform = `scaleY(${lerp(1, .18, drop).toFixed(3)})`; thrLb.style.top = lerp(-10, 240, drop).toFixed(1) + 'px';
    place(file, { o: pr(t, tLow + .2, tLow + .5) * (1 - pr(t, tMy - .3, tMy)), s: (.8 + .2 * EZ.spring(pr(t, tLow + .2, tLow + .7))) * (1 + Math.sin(Math.PI * pr(t, tEasy - .2, tEasy + .4)) * .12) });
    show(clean, t, tEasy + .1, { k: 'up', d: .4, out: tMy - .3, x: 980 });
    cf.style.width = (EZ.inout(pr(t, tEasy + .2, tMy - .3)) * 100).toFixed(1) + '%';
    
    const wp = pr(t, tMy - .2, tMy + .5);
    const wo = clamp(wp * 2) * .55 * (1 - pr(t, tFree - .1, tFree));
    place(wall, { o: wo, s: 1.15 - .15 * EZ.out(wp) + (t - tMy) * .01 });
    if (wo > 0) { const fi = Math.floor(Math.max(0, t - tMy) * 36); wis.forEach((im, i) => setFrame(im, `sc/wall2/${String(24 + (i * 11) % 38).padStart(3, '0')}/f_${String(1 + ((fi + i * 7) % 30)).padStart(2, '0')}.jpg`)); }   
    
    const fOn = t >= tFree - .01 && t < tEnd - .2;
    place(free, { o: fOn ? 1 : 0 });
    if (fOn) {
      const fp = pr(t, tFree, tFree + .2), j = Math.floor(t * 30), g = 1 - EZ.out(pr(t, tFree, tFree + .3));
      fz.style.transform = `scale(${(1 + (1 - EZ.out5(fp)) * .6).toFixed(3)})`; fz.style.transformOrigin = '0 50%';
      fe.style.transform = `translateX(${((hash(j) - .5) * 80 * g).toFixed(1)}px)`;
      fe.style.filter = g > .05 ? `drop-shadow(${(14 * g).toFixed(1)}px 0 0 rgba(255,40,60,.8)) drop-shadow(${(-14 * g).toFixed(1)}px 0 0 rgba(40,210,255,.8))` : '';
      gf.style.transform = `translateY(${(Math.sin(t * 2.2) * 10).toFixed(1)}px) rotate(${(-8 + Math.sin(t * 1.4) * 3).toFixed(2)}deg) scale(${(.7 + .3 * EZ.spring(pr(t, tFree + .1, tFree + .6))).toFixed(3)})`;
    }
    sc.inkHud = fOn;
    
    show(teach, t, tEnd - .15, { k: 'left', d: .45 });
    show(prog, t, tEnd, { k: 'up', d: .4 });
    pf.style.width = (EZ.inout(pr(t, tEnd + .1, tEnd + 1.4)) * 100).toFixed(1) + '%';
    ed.style.boxShadow = `0 0 0 ${(beatPulse(t) * 18).toFixed(1)}px rgba(245,185,46,${(.5 * beatPulse(t)).toFixed(2)})`;
    show(this1, t, tCur - .05, { k: 'pop', d: .4 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tMad, .5, 16); const [fx, fy] = shake(t, tFree, .35, 22); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx: sx + fx, sy: sy + fy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => { if (t >= tFree && t < tFree + .9) sparks(c, t, tFree, 980, 520, { n: 80, life: .8, dir: 0, spread: 6.3, speed: 1400, g: 600, col: '255,255,255', seed: 12 }); }, true);
  };
  tFlash(tFree, .7, .2);
  SOURCE_S("S12.sound000",tDay - .1, 'swoosh', .4); SOURCE_S("S12.sound001",tWhy, 'hit', .6); SOURCE_S("S12.sound002",tFrame - .3, 'whoosh', .5); SOURCE_S("S12.sound003",tFrame, 'tick_run', .4, 0, { d: 1.5 });
  SOURCE_S("S12.sound004",tMad, 'glitch', .8); SOURCE_S("S12.sound005",tMad + .02, 'err', .5); SOURCE_S("S12.sound006",tLow, 'slide', .5, 0, { d: .5 }); SOURCE_S("S12.sound007",tEasy, 'suck', .6, 0, { d: .5 }); SOURCE_S("S12.sound008",tEasy + .3, 'pop', .5);
  SOURCE_S("S12.sound009",tFree, 'hit', 1); SOURCE_S("S12.sound010",tFree + .1, 'coin', .7); SOURCE_S("S12.sound011",tEnd - .15, 'whoosh', .5); SOURCE_S("S12.sound012",tCur, 'pop', .4);
})();


(() => {
if(!USER_INPUT.selected.includes("S13"))return;
window.CURRENT_UNIT="S13";

  const T0 = O(131.26), T1 = O(146.22);
  const sc = SC(T0, T1, BG, '13 — 计时器');
  const D = sc.el;
  const tBel = NATIVE_CUE("cue-142"), tSimple = NATIVE_CUE("cue-143"), tDare = NATIVE_CUE("cue-144"), tHalf = NATIVE_CUE("cue-145"), tRep = NATIVE_CUE("cue-146"), tLike = NATIVE_CUE("cue-147"), tDrop = NATIVE_CUE("cue-148"),
    tHr = NATIVE_CUE("cue-149"), tOut = NATIVE_CUE("cue-150"), tExp = NATIVE_CUE("cue-151"), tBack = NATIVE_CUE("cue-152"), tFr = NATIVE_CUE("cue-153");
  TKF.push([T0, 'R', .5, true], [tDare - .2, 'TR', .5, true], [tExp - .25, 'R', .5, true]);
  
  const STEP = [['folder', RAW_TEXT("S13.text001")], ['cpu', RAW_TEXT("S13.text002")], ['play', RAW_TEXT("S13.text003")]];
  const steps = STEP.map(([ic, s], i) => mk(D, `<div class="glass" style="width:250px;height:230px;border-radius:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:${i === 2 ? GOLD : SILVER}">${ICON(ic, 76, 1.6)}<div style="${HV(40, i === 2 ? GOLD : SILVER, 2)}">${TEXT_GLOBAL(s)}</div><div style="${MONO(14, DIM, 3)}">${TEXT("S13.text004")}${i + 1}</div></div>`, 270 + i * 360, 470, { ax: .5, ay: .5 }));
  const arrows = [0, 1].map(i => mk(D, `<div style="color:${BLUE2}">${ICON('arrow', 56, 2)}</div>`, 450 + i * 360, 470, { ax: .5, ay: .5 }));
  const simple = mk(D, `<div style="${HV(84, SILVER, 4)}">${TEXT("S13.text005")}<span style="${BLUEF}">${TEXT("S13.text006")}</span></div>`, 150, 250, { ax: 0, ay: .5 });
  
  const gauge = mk(D, `<svg width="760" height="430" viewBox="-380 -380 760 430" style="overflow:visible">
      <path d="M-330 0 A330 330 0 0 1 330 0" fill="none" stroke="#1d2128" stroke-width="40"/>
      <path class="ga" d="M-330 0 A330 330 0 0 1 330 0" fill="none" stroke="url(#gg)" stroke-width="40" stroke-dasharray="1037 1037" stroke-dashoffset="1037"/>
      <defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="${BLUE}"/><stop offset="1" stop-color="${GOLD}"/></linearGradient></defs>
      ${Array.from({ length: 21 }, (_, i) => { const a = Math.PI * (1 - i / 20); return `<line x1="${(Math.cos(a) * 280).toFixed(1)}" y1="${(-Math.sin(a) * 280).toFixed(1)}" x2="${(Math.cos(a) * (i % 5 ? 262 : 246)).toFixed(1)}" y2="${(-Math.sin(a) * (i % 5 ? 262 : 246)).toFixed(1)}" stroke="rgba(233,236,239,.4)" stroke-width="2"/>`; }).join('')}
      <g class="nd"><path d="M-8 0 L0 -300 L8 0 Z" fill="${SILVER}"/><circle r="20" fill="${SILVER}"/></g>
      <text x="-330" y="44" fill="${DIM}" text-anchor="middle" style="font:500 18px 'Geist Mono'">${TEXT("S13.text007")}</text><text x="330" y="44" fill="${DIM}" text-anchor="middle" style="font:500 18px 'Geist Mono'">${TEXT("S13.text008")}</text></svg>`, 640, 560, { ax: .5, ay: .5 });
  const ga = gauge.querySelector('.ga'), nd = gauge.querySelector('.nd');
  const halfN = mk(D, `<div style="text-align:center"><div style="${MONO(18, DIM, 5)}">${TEXT("S13.text009")}</div><div class="hv" style="${AN(150, SILVER, 2)};${GOLDF}">${TEXT("S13.text010")}</div><div style="${MONO(15, DIM, 3)}">${TEXT("S13.text011")}</div></div>`, 640, 700, { ax: .5, ay: .5 });
  const hv = halfN.querySelector('.hv');
  const months = mk(D, `<div class="chip" style="font-size:22px;padding:10px 22px">${TEXT("S13.text012")}</div>`, 640, 210, { ax: .5, ay: .5 });
  
  const quote = mk(D, `<div style="max-width:780px;padding:26px 32px;border-radius:24px 24px 24px 6px;background:#1a1e25;border:1px solid rgba(233,236,239,.12)">
      <div style="display:flex;align-items:center;gap:12px;${MONO(15, DIM, 3)}"><span style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3a6fd8,#7DB2FF);display:inline-block"></span>${TEXT("S13.text013")}</div>
      <div style="${ZH(50, SILVER, 600)};margin-top:14px">${TEXT("S13.text014")}<span style="color:${GOLD}">${TEXT("S13.text015")}</span>${TEXT("S13.text016")}</div></div>`, 150, 300, { ax: 0, ay: .5 });
  
  const box = mk(D, `<div style="position:relative;width:420px;height:300px">
      <div style="position:absolute;left:0;top:60px;width:420px;height:240px;border-radius:20px;border:2px solid rgba(233,236,239,.3);background:linear-gradient(180deg,#151920,#0c0e12)"></div>
      <div style="position:absolute;left:50%;top:150px;transform:translateX(-50%);${MONO(16, DIM, 4)}">${TEXT("S13.text017")}</div>
      <div class="tm" style="position:absolute;left:50%;top:190px;transform:translateX(-50%);${AN(64, SILVER, 2)}">${TEXT("S13.text018")}</div></div>`, 520, 610, { ax: .5, ay: .5 });
  const tmr = box.querySelector('.tm');
  const FILES = ['video', 'mic', 'image', 'file'].map((ic, i) => mk(D, `<div style="width:96px;height:96px;border-radius:18px;background:#1b1f26;border:1px solid rgba(233,236,239,.18);display:flex;align-items:center;justify-content:center;color:${[BLUE2, GOLD, SILVER, LAV][i]}">${ICON(ic, 50, 1.8)}</div>`, 0, 0, { ax: .5, ay: .5 }));
  const outV = vcard(D, 640, 360, { label: RAW_TEXT("S13.text019"), badge: RAW_TEXT("S13.text020") });
  const min30 = mk(D, `<div style="${AN(170, GOLD, 4)};${GOLDF}">${TEXT("S13.text021")}</div>`, 1000, 300, { ax: 0, ay: .5 });
  
  const nle = mk(D, `<div style="width:820px;border-radius:14px;overflow:hidden;background:#15181d;border:1px solid rgba(233,236,239,.12);box-shadow:0 30px 80px rgba(0,0,0,.6)">
      <div style="height:38px;display:flex;align-items:center;gap:8px;padding:0 14px;background:#1d2128"><i class="xb" style="width:12px;height:12px;border-radius:50%;background:#ff5f57"></i><i style="width:12px;height:12px;border-radius:50%;background:#febc2e"></i><i style="width:12px;height:12px;border-radius:50%;background:#28c840"></i><span style="margin-left:10px;${MONO(13, DIM, 1)};text-transform:none">${TEXT("S13.text022")}</span></div>
      <div style="display:flex;gap:10px;padding:14px"><div style="flex:1;height:200px;border-radius:8px;background:#0c0e11"></div><div style="width:240px;height:200px;border-radius:8px;background:#0c0e11"></div></div>
      <div class="tlc" style="position:relative;height:150px;margin:0 14px 14px;border-radius:8px;background:#0c0e11"></div></div>`, 640, 520, { ax: .5, ay: .5 });
  const tlc = nle.querySelector('.tlc');
  tlc.innerHTML = Array.from({ length: 60 }, (_, i) => `<div style="position:absolute;left:${(i % 20) * 39 + 4}px;top:${Math.floor(i / 20) * 46 + 8}px;width:${18 + hash(i) * 18}px;height:36px;border-radius:3px;background:${['#3a6fd8', '#b8862a', '#6a4fc9'][Math.floor(i / 20)]};opacity:.7"></div>`).join('');
  const bigX = mk(D, `<div style="color:${RED};filter:drop-shadow(0 0 24px rgba(255,77,61,.5))">${ICON('x', 260, 3)}</div>`, 640, 520, { ax: .5, ay: .5 });
  const noBack = mk(D, `<div style="${HV(70, SILVER, 4)}">${TEXT("S13.text023")}</div>`, 150, 190, { ax: 0, ay: .5 });
  sc.update = t => {
    
    const s1out = tDare - .3;
    show(simple, t, tSimple - .1, { k: 'mask', d: .45, out: s1out });
    steps.forEach((e, i) => show(e, t, tBel + i * .35, { k: 'up', d: .45, out: s1out + i * .04 }));
    arrows.forEach((e, i) => show(e, t, tBel + .2 + i * .35, { k: 'left', d: .35, dist: 40, out: s1out }));
    
    const gIn = pr(t, tDare - .2, tDare + .2), gOut = pr(t, tLike - .3, tLike);
    place(gauge, { o: clamp(gIn * 3) * (1 - gOut), y: 560 + (1 - EZ.out(gIn)) * 40 });
    const v = parseFloat(RAW_TEXT("S13.text010"))/100 * EZ.spring(pr(t, tHalf - .05, tHalf + .9));
    ga.style.strokeDashoffset = (1037 * (1 - v)).toFixed(1);
    nd.setAttribute('transform', `rotate(${(-90 + v * 180).toFixed(2)})`);
    setTxt(hv, Math.round(v * 100) + '%');
    show(halfN, t, tHalf - .1, { k: 'up', d: .4, out: tLike - .3 });
    show(months, t, NATIVE_CUE("cue-154") - .05, { k: 'pop', d: .4, out: tLike - .3 });
    
    show(quote, t, tLike - .05, { k: 'up', d: .45, out: tExp - .35 });
    
    show(box, t, tDrop - .3, { k: 'up', d: .4, out: tExp - .35 });
    FILES.forEach((f, i) => {
      const a = tDrop + i * .12, x = pr(t, a, a + .5), y = EZ.in(x);
      place(f, { x: 360 + i * 105 - y * (i - 1.5) * 70, y: lerp(150, 650, y), o: x > 0 && x < 1 ? 1 : 0, r: (1 - y) * (i - 1.5) * 20, s: 1 - y * .4 });
    });
    const tp = pr(t, tHr - .1, tOut + .1), mins = Math.floor(EZ.inout(tp) * Number(RAW_TEXT("S13.timerSeconds"))/60), secs = Math.floor(EZ.inout(tp) * Number(RAW_TEXT("S13.timerSeconds"))) % 60;
    setTxt(tmr, `${String(mins).padStart(2, '0')}:${String(tp >= 1 ? 0 : secs).padStart(2, '0')}`); tmr.style.color = tp >= 1 ? GOLD : SILVER;
    const op = pr(t, tOut, tOut + .5);
    place(outV, { x: lerp(520, 1150, EZ.out(op)), y: lerp(610, 640, EZ.out(op)), s: .3 + .55 * EZ.out(op), o: clamp(op * 4) * (1 - pr(t, tExp - .35, tExp - .1)) });
    vseq(outV, 'd605', 90, t, tOut);
    const mp = pr(t, tHr - .03, tHr + .22);
    place(min30, { s: 1 + (1 - EZ.out5(mp)) * 1.2, o: clamp(mp * 5) * (1 - pr(t, tExp - .35, tExp - .1)), blur: (1 - mp) * 10 });
    
    const nIn = pr(t, tExp - .05, tExp + .35), kill = EZ.in(pr(t, tFr - .05, tFr + .35));
    place(nle, { o: clamp(nIn * 3) * (1 - kill), s: (.95 + .05 * EZ.out(nIn)) * (1 - kill * .5), y: 520 + kill * 60, blur: kill * 6 });
    const xp = pr(t, tBack + .4, tBack + .6);
    place(bigX, { o: clamp(xp * 5) * (1 - pr(t, tFr + .3, tFr + .5)), s: 1 + (1 - EZ.out5(xp)) * 1.5, r: -6 });
    show(noBack, t, tBack, { k: 'mask', d: .45, out: T1 - .25 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tHr, .3, 12); const [bx, by] = shake(t, tBack + .4, .3, 14); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx: sx + bx, sy: sy + by }; };
  SOURCE_S("S13.sound000",tBel, 'card', .5, -.5); SOURCE_S("S13.sound001",tBel + .35, 'card', .5, 0); SOURCE_S("S13.sound002",tBel + .7, 'card', .5, .5); SOURCE_S("S13.sound003",tSimple, 'ding', .35);
  SOURCE_S("S13.sound004",tDare - .2, 'whoosh', .45); SOURCE_S("S13.sound005",tHalf, 'rise', .45); SOURCE_S("S13.sound006",tHalf + .6, 'hit', .6); SOURCE_S("S13.sound007",tLike, 'msg', .5);
  [0, 1, 2, 3].forEach(i => SOURCE_S("S13.sound008",tDrop + i * .12 + .45, 'thud', .45, -.3 + i * .2)); SOURCE_S("S13.sound009",tHr - .1, 'counter', .45, 0, { d: 1.1 }); SOURCE_S("S13.sound010",tHr, 'hit', .8); SOURCE_S("S13.sound011",tOut, 'win_pop', .6);
  SOURCE_S("S13.sound012",tExp - .2, 'card', .5); SOURCE_S("S13.sound013",tBack + .4, 'slash', .8); SOURCE_S("S13.sound014",tFr, 'powerdown', .5);
})();


(() => {
if(!USER_INPUT.selected.includes("S14"))return;
window.CURRENT_UNIT="S14";

  const T0 = O(146.22), T1 = O(161.92);
  const sc = SC(T0, T1, BG, '14 — 兼容');
  const D = sc.el;
  const tNat = NATIVE_CUE("cue-155"), tFor = NATIVE_CUE("cue-156"), tOK = HIT('no_problem'), tAwk = NATIVE_CUE("cue-157"), tNight = NATIVE_CUE("cue-158"), tForce = NATIVE_CUE("cue-159"), tBreak = NATIVE_CUE("cue-160"),
    tNow = NATIVE_CUE("cue-161"), tAll = NATIVE_CUE("cue-162"), tTest = NATIVE_CUE("cue-163"), tPart = NATIVE_CUE("cue-164"), tBet = NATIVE_CUE("cue-165");
  const NAMES = [[RAW_TEXT("S14.text001"), NATIVE_CUE("cue-166")], [RAW_TEXT("S14.text002"), NATIVE_CUE("cue-167")], [RAW_TEXT("S14.text003"), NATIVE_CUE("cue-168")], [RAW_TEXT("S14.text004"), NATIVE_CUE("cue-169")]];
  TKF.push([T0 - .02, 'TR', .45, true], [T0 + .4, { x: 1780, y: 900, w: 180, h: 180, r: 90 }, .4, true], [tFor + .8, 'TR', .45, true], [tPart - .3, 'R', .5, true]);
  
  const panel = (title, sub, col, lock) => mk(D, `<div class="glass" style="position:relative;width:560px;height:330px;border-radius:24px;padding:34px 38px">
      <div style="${MONO(16, DIM, 4)}">${TEXT_GLOBAL(sub)}</div><div style="${HV(64, SILVER, 2)};margin-top:10px">${TEXT_GLOBAL(title)}</div>
      <div class="st" style="position:absolute;right:34px;top:30px;width:74px;height:74px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${col}">${ICON(lock ? 'lock' : 'check', 40, 2.4, '#0A0B0D')}</div>
      <div class="ld" style="position:absolute;left:38px;bottom:34px;display:flex;align-items:center;gap:14px;${MONO(18, DIM, 3)}"><span class="lamp" style="width:18px;height:18px;border-radius:50%;background:${lock ? RED : '#3DDC97'}"></span><span class="lt">${lock ? RAW_TEXT("S14.text005") : RAW_TEXT("S14.text006")}</span></div></div>`, 0, 0, { ax: .5, ay: .5 });
  const pA = panel(RAW_TEXT("S14.text007"), RAW_TEXT("S14.text008"), '#3DDC97', false), pB = panel(RAW_TEXT("S14.text009"), RAW_TEXT("S14.text010"), RED, true);
  const lampB = pB.querySelector('.lamp'), ltB = pB.querySelector('.lt'), stB = pB.querySelector('.st');
  const lockImg = mk(D, `<div>${lineIcon('lock', 150, '#FF6A5C', '255,90,70')}</div>`, 1000, 560, { ax: .5, ay: .5 });
  const okT = mk(D, `<div style="${HV(150, SILVER, 6)};${METAL}">${TEXT("S14.text011")}</div>`, 640, 500, { ax: .5, ay: .5 });
  
  const BW = 1600, BH = 1028;
  const site = mk(D, `<div style="position:relative;width:${BW}px;height:${BH + 44}px;border-radius:16px;overflow:hidden;background:#05060a;box-shadow:0 40px 120px rgba(0,0,0,.7);outline:1px solid rgba(233,236,239,.18)">
      <div style="height:44px;display:flex;align-items:center;gap:9px;padding:0 18px;background:#14161b"><i style="width:12px;height:12px;border-radius:50%;background:#ff5f57"></i><i style="width:12px;height:12px;border-radius:50%;background:#febc2e"></i><i style="width:12px;height:12px;border-radius:50%;background:#28c840"></i>
        <span style="margin-left:22px;padding:5px 18px;border-radius:8px;background:#0b0c10;${MONO(15, SILVER, 1)};text-transform:none">${TEXT("S14.text012")}</span></div>
      <img class="bi" style="display:block;width:${BW}px;height:${BH}px">
      <div class="hl" style="position:absolute;border:3px solid ${GOLD};border-radius:10px;box-shadow:0 0 30px rgba(245,185,46,.5);opacity:0"></div></div>`, 960, 540, { ax: .5, ay: .5 });
  const bi = site.querySelector('.bi'), hl = site.querySelector('.hl');
  
  const TOOLS = USER_INPUT.media.banner.focus.highlights.map(r=>["",r.x*BW,r.w*BW,r.y*BH,r.h*BH]);
  const siteTag = mk(D, `<div style="display:flex;align-items:center;gap:14px;padding:12px 22px;background:rgba(3,4,5,.85);border-left:4px solid ${RED}"><span style="${MONO(16, RED, 4)}">${TEXT("S14.text015")}</span><span style="${HV(56, SILVER, 2)}">${TEXT("S14.text016")}<span style="color:${RED}">${TEXT("S14.text017")}</span>${TEXT("S14.text018")}</span></div>`, 960, 720, { ax: .5, ay: .5 });
  const siteSrc = mk(D, `<div style="${MONO(14, DIM, 3)}">${TEXT("S14.text019")}</div>`, 1780, 1000, { ax: 1, ay: .5 });
  
  const clock = mk(D, `<svg width="300" height="300" viewBox="-150 -150 300 300"><circle r="130" fill="#101317" stroke="rgba(233,236,239,.35)" stroke-width="3"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * 6.2832; return `<line x1="${(Math.sin(a) * 112).toFixed(1)}" y1="${(-Math.cos(a) * 112).toFixed(1)}" x2="${(Math.sin(a) * 124).toFixed(1)}" y2="${(-Math.cos(a) * 124).toFixed(1)}" stroke="rgba(233,236,239,.6)" stroke-width="3"/>`; }).join('')}
      <line class="hh" x1="0" y1="0" x2="0" y2="-62" stroke="${SILVER}" stroke-width="8" stroke-linecap="round"/><line class="mh" x1="0" y1="0" x2="0" y2="-100" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/><circle r="9" fill="${GOLD}"/></svg>`, 330, 520, { ax: .5, ay: .5 });
  const hh = clock.querySelector('.hh'), mh = clock.querySelector('.mh');
  const coffee = mk(D, `<div>${lineIcon('coffee', 230, GOLD2, '245,185,46')}</div>`, 680, 560, { ax: .5, ay: .5 });
  const nights = mk(D, `<div><div style="${HV(76, SILVER, 4)}">${TEXT("S14.text020")}<span style="${GOLDF}">${TEXT("S14.text021")}</span></div><div class="nc" style="${MONO(20, DIM, 4)};margin-top:12px">${TEXT("S14.text022")}</div></div>`, 150, 250, { ax: 0, ay: .5 });
  const nc = nights.querySelector('.nc');
  
  const WC = 8, WR = 6, BS = 62;
  const wall = mk(D, `<div style="position:relative;width:${WC * (BS + 6)}px;height:${WR * (BS + 6)}px">${Array.from({ length: WC * WR }, (_, i) => `<div class="bk" style="position:absolute;left:${(i % WC) * (BS + 6)}px;top:${Math.floor(i / WC) * (BS + 6)}px;width:${BS}px;height:${BS}px;background:#1d222a;border:1px solid rgba(233,236,239,.18)"></div>`).join('')}</div>`, 980, 540, { ax: .5, ay: .5 });
  const bks = [...wall.querySelectorAll('.bk')];
  const brk = mk(D, `<div style="${HV(84, SILVER, 4)}">${TEXT("S14.text023")} <span style="${BLUEF}">${TEXT("S14.text024")}</span></div>`, 150, 250, { ax: 0, ay: .5 });
  
  const plates = NAMES.map(([n], i) => mk(D, `<div style="position:relative;width:340px;height:150px;border-radius:18px;background:#14171c;border:1.5px solid rgba(233,236,239,.2);display:flex;align-items:center;justify-content:center">
      <div class="nm" style="${n.length > 6 ? AN(54, SILVER, 2) : HV(58, SILVER, 2)};text-transform:none">${TEXT_GLOBAL(n)}</div>
      <div class="ck" style="position:absolute;right:-14px;top:-14px;width:46px;height:46px;border-radius:50%;background:#3DDC97;display:flex;align-items:center;justify-content:center">${ICON('check', 28, 3, '#0A0B0D')}</div></div>`, 255 + i * 380, 470, { ax: .5, ay: .5 }));
  const allT = mk(D, `<div style="${HV(96, SILVER, 4)}">${TEXT("S14.text025")} <span style="${GOLDF}">${TEXT("S14.text026")}</span></div>`, 960, 690, { ax: .5, ay: .5 });
  
  const bars = mk(D, `<div style="width:980px"><div style="${MONO(18, DIM, 4)};margin-bottom:22px">${TEXT("S14.text027")}</div>
      ${[[RAW_TEXT("S14.text028"), .78, BLUE2], [RAW_TEXT("S14.text029"), .86, GOLD]].map(([n, v, c]) => `<div style="display:flex;align-items:center;gap:24px;margin-bottom:22px"><div style="width:330px;${ZH(28, SILVER, 600)}">${TEXT_GLOBAL(n)}</div>
        <div style="flex:1;height:30px;border-radius:6px;background:#1b1f26;overflow:hidden"><div class="bv" data-v="${v}" style="height:100%;width:0;background:${c}"></div></div></div>`).join('')}</div>`, 150, 520, { ax: 0, ay: .5 });
  const bvs = [...bars.querySelectorAll('.bv')];
  const better = mk(D, `<div style="${HV(84, SILVER, 4)}">${TEXT("S14.text030")}<span style="${GOLDF}">${TEXT("S14.text031")}</span></div>`, 150, 260, { ax: 0, ay: .5 });
  sc.update = t => {
    
    const pin = pr(t, tFor + .9, tFor + 1.3), pOut = pr(t, tAwk - .35, tAwk - .05);
    place(pA, { x: 560, y: 560 + (1 - EZ.out(pin)) * 60, o: clamp(pin * 3) * (1 - pOut) });
    const bIn = pr(t, tFor + 1.0, tFor + 1.4), ok = t >= tOK;
    place(pB, { x: 1200, y: 560 + (1 - EZ.out(bIn)) * 60, o: clamp(bIn * 3) * (1 - pOut), s: 1 + (ok ? .04 * Math.sin(Math.PI * pr(t, tOK, tOK + .35)) : 0) });
    lampB.style.background = ok ? '#3DDC97' : RED; lampB.style.opacity = !ok && t > tFor + 1.3 ? (Math.floor(t * 4) % 2 ? .25 : 1) : 1;
    setTxt(ltB, ok ? RAW_TEXT("S14.text032") : RAW_TEXT("S14.text033")); stB.style.background = ok ? '#3DDC97' : RED;
    const lk = pr(t, tFor + 1.2, tFor + 1.5);
    place(lockImg, { x: 1360, y: 650, o: clamp(lk * 4) * (1 - pr(t, tOK - .05, tOK + .1)), s: (.6 + .4 * EZ.spring(lk)) * (1 + (ok ? .4 * pr(t, tOK - .05, tOK + .1) : 0)), r: Math.sin(t * 9) * (t > tFor + .5 && !ok ? 3 : 0) });
    const op = pr(t, tOK - .02, tOK + .2);
    place(okT, { s: 1 + (1 - EZ.out5(op)) * 1.4, o: clamp(op * 5) * (1 - pr(t, tAwk - .35, tAwk - .1)), blur: (1 - op) * 12, x: 880, y: 250 });
    
    const sIn = pr(t, T0 - .05, T0 + .35), sOut = pr(t, tFor + .7, tFor + 1.0);
    const push = EZ.inout(pr(t, tNat - .4, tNat + .5));
    const zs = lerp(.9, 1.75, push), fy = lerp(BH / 2 + 22, USER_INPUT.media.banner.focus.cy * BH + 44, push), fx = lerp(BW / 2, USER_INPUT.media.banner.focus.cx * BW, push), lift = push * 140;
    place(site, { x: 960 + (BW / 2 - fx) * zs, y: 540 + ((BH + 44) / 2 - fy) * zs - lift, s: zs * (.96 + .04 * EZ.out(sIn)), o: clamp(sIn * 3) * (1 - sOut), blur: sOut * 6 });
    setFrame(bi, seqAt('banner', 420, 30, t, T0 - .5, false));
    const ti = Math.min(TOOLS.length - 1, Math.floor(Math.max(0, t - (tFor - .3)) / .2)), hk = pr(t, tFor - .35, tFor - .15);
    const [, hx, hw, hy, hotspotHeight] = TOOLS[ti];
    hl.style.left = hx + 'px'; hl.style.top = (hy + 44) + 'px'; hl.style.width = hw + 'px'; hl.style.height = hotspotHeight + 'px'; hl.style.opacity = (hk * (1 - sOut)).toFixed(2);
    show(siteTag, t, tFor - .2, { k: 'up', d: .4, out: tFor + .7 });
    place(siteSrc, { o: pr(t, T0 + .2, T0 + .5) * (1 - sOut) });
    
    const nIn = pr(t, tAwk - .2, tAwk + .2), nOut = pr(t, tForce - .3, tForce);
    place(clock, { o: clamp(nIn * 3) * (1 - nOut), x: 1020, y: 560 });
    const spin = Math.max(0, t - tAwk) * 3.2;
    hh.setAttribute('transform', `rotate(${(spin * 360 / 12 * 2).toFixed(1)})`); mh.setAttribute('transform', `rotate(${(spin * 360).toFixed(1)})`);
    place(coffee, { o: clamp(nIn * 3) * (1 - nOut), x: 1430, y: 560 + Math.sin(t * 2.4) * 8, s: .7 + .3 * EZ.spring(pr(t, tNight - .1, tNight + .5)), r: -6 });
    show(nights, t, tAwk - .1, { k: 'mask', d: .45, out: tForce - .3 });
    setTxt(nc, RAW_TEXT("S14.text034") + Math.min(USER_INPUT.media.banner.focus.highlights.length, 1 + Math.floor(Math.max(0, t - tAwk) * 3.2)) + RAW_TEXT("S14.text035"));
    
    const wIn = pr(t, tForce - .25, tForce + .1), boom = pr(t, tBreak + .55, tBreak + 1.5);
    place(wall, { o: clamp(wIn * 3) * (1 - pr(t, tNow - .35, tNow - .1)), x: 1100, y: 540 });
    bks.forEach((b, i) => {
      const cx = (i % WC) - WC / 2 + .5, cy = Math.floor(i / WC) - WR / 2 + .5, d = Math.hypot(cx, cy);
      const k = EZ.out(clamp(boom * 1.6 - d * .12));
      b.style.transform = k > 0 ? `translate(${(cx * 120 * k + (hash(i) - .5) * 80 * k).toFixed(1)}px,${(cy * 90 * k + 260 * k * k).toFixed(1)}px) rotate(${((hash(i * 3) - .5) * 220 * k).toFixed(1)}deg)` : '';
      b.style.opacity = (1 - k * .9).toFixed(2);
      const crack = pr(t, tBreak - .1, tBreak + .55); b.style.background = crack > 0 && d < 1 + crack * 3 ? `rgba(47,123,255,${(.25 + .4 * crack).toFixed(2)})` : '#1d222a';
    });
    show(brk, t, tForce - .1, { k: 'mask', d: .45, out: tNow - .35 });
    
    plates.forEach((p, i) => {
      const t0 = NAMES[i][1] - .06, x = pr(t, t0, t0 + .2);
      place(p, { o: clamp(x * 5) * (1 - pr(t, tPart - .3, tPart - .05)), y: 470 - (1 - EZ.out5(x)) * 160, s: 1 + (1 - EZ.out5(x)) * .3 });
      const ck = p.querySelector('.ck'); const cx = pr(t, t0 + .25, t0 + .5); ck.style.transform = `scale(${EZ.spring(cx).toFixed(3)})`; ck.style.opacity = cx > 0 ? 1 : 0;
      const gold = t >= tAll; p.firstChild.style.borderColor = gold ? GOLD : 'rgba(233,236,239,.2)'; p.firstChild.style.boxShadow = gold ? `0 0 ${(20 + beatPulse(t) * 20).toFixed(0)}px rgba(245,185,46,.35)` : 'none';
      ck.style.background = gold ? GOLD : '#3DDC97';
    });
    show(allT, t, tAll - .1, { k: 'up', d: .45, out: tPart - .3 });
    
    show(better, t, tPart - .1, { k: 'mask', d: .45, out: T1 - .25 });
    show(bars, t, tPart, { k: 'up', d: .45, out: T1 - .25 });
    bvs.forEach((b, i) => { b.style.width = (EZ.out(pr(t, tPart + .2 + i * .25, tPart + 1.2 + i * .25)) * +b.dataset.v * 100).toFixed(1) + '%'; });
  };
  sc.cam = t => {
    const [sx, sy] = shake(t, tOK, .4, 22), [bx, by] = shake(t, tBreak + .55, .45, 20), [ax, ay] = shake(t, tAll, .25, 10);
    return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006 + (t > tOK - 1.3 && t < tOK ? .03 * pr(t, tOK - 1.3, tOK) : 0), sx: sx + bx + ax, sy: sy + by + ay };
  };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      if (t >= tBreak + .5 && t < tBreak + 1.6) sparks(c, t, tBreak + .55, 1100, 540, { n: 110, life: 1, dir: 0, spread: 6.3, speed: 1300, g: 900, col: '170,205,255', seed: 14 });
      
      const nk = pr(t, tAwk - .2, tAwk + .2) * (1 - pr(t, tForce - .3, tForce));
      if (nk > 0) { const day = .5 + .5 * Math.sin(Math.max(0, t - tAwk) * 3.2 * Math.PI); c.fillStyle = `rgba(245,185,46,${(nk * day * .07).toFixed(3)})`; if(USER_INPUT.layout==='portrait'){c.save();c.setTransform(1,0,0,1,0,0);c.fillRect(0,0,1080,1920);c.restore();}else c.fillRect(0,0,1920,1080); }
    });
  };
  SOURCE_S("S14.sound000",T0, 'whoosh', .5); SOURCE_S("S14.sound001",tNat - .4, 'swoosh', .45); TOOLS.forEach((_, i) => SOURCE_S("S14.sound002",tFor - .3 + i * .2, 'tick', .4, -.4 + i * .2)); SOURCE_S("S14.sound003",tFor + 1.0, 'card', .45); SOURCE_S("S14.sound004",tFor + 1.25, 'err', .55);
  SOURCE_S("S14.sound005",tOK, 'hit', 1); SOURCE_S("S14.sound006",tOK + .05, 'check', .5, 0, { n: 3 }); SOURCE_S("S14.sound007",tAwk - .1, 'clock', .5, 0, { d: 1.2 }); SOURCE_S("S14.sound008",tNight, 'pop', .4);
  SOURCE_S("S14.sound009",tForce - .2, 'swoosh', .5); SOURCE_S("S14.sound010",tBreak, 'crack', .6); SOURCE_S("S14.sound011",tBreak + .55, 'crash', .7); SOURCE_S("S14.sound012",tBreak + .56, 'hit', .9);
  NAMES.forEach(([, t0], i) => { SOURCE_S("S14.sound013",t0 - .06, 'thud', .7, -.6 + i * .4); SOURCE_S("S14.sound014",t0 + .3, 'check', .4, -.6 + i * .4, { n: i }); });
  SOURCE_S("S14.sound015",tAll, 'shine', .6); SOURCE_S("S14.sound016",tTest, 'whoosh', .4); SOURCE_S("S14.sound017",tPart, 'fill', .4, 0, { d: 1 });
})();
