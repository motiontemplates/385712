


(() => {
if(!USER_INPUT.selected.includes("S15"))return;
window.CURRENT_UNIT="S15";

  const T0 = O(161.92), T1 = O(169.82);
  const sc = SC(T0, T1, BG, '15 — 设置');
  const D = sc.el, X0 = 150;
  const tTip = NATIVE_CUE("cue-170"), tOpen = NATIVE_CUE("cue-171"), tWork = NATIVE_CUE("cue-172"), tModel = NATIVE_CUE("cue-173"), tMax = NATIVE_CUE("cue-174"), tEff = NATIVE_CUE("cue-175"), tHook = NATIVE_CUE("cue-176");
  TKF.push([T0, 'R', .5, true]);
  
  const effT = mk(D, `<div style="${HV(84, SILVER, 4)}">${TEXT("S15.text001")}<span style="${GOLDF}">${TEXT("S15.text002")}</span></div>`, X0, 220, { ax: 0, ay: .5 });
  const tip = mk(D, `<div style="display:flex;align-items:center;gap:18px;padding:14px 28px 14px 18px;border-left:6px solid ${GOLD};background:linear-gradient(90deg,rgba(245,185,46,.16),rgba(245,185,46,0))">
      <span style="color:${GOLD}">${ICON('alert', 34, 2)}</span><span style="${MONO(20, GOLD, 6)}">${TEXT("S15.text003")}</span></div>`, X0, 200, { ax: 0, ay: .5 });
  
  const sw = mk(D, `<div class="glass" style="width:720px;height:150px;border-radius:24px;display:flex;align-items:center;padding:0 40px;gap:30px">
      <div style="flex:1"><div style="${HV(54, SILVER, 2)}">${TEXT("S15.text004")}</div><div style="${MONO(16, DIM, 4)};margin-top:8px">${TEXT("S15.text005")}</div></div>
      <div class="sl" style="${MONO(20, DIM, 3)};width:70px;text-align:right">${TEXT("S15.text006")}</div>
      <div class="tr" style="position:relative;width:150px;height:76px;border-radius:40px;background:#262a31;border:1.5px solid rgba(233,236,239,.2)">
        <div class="kn" style="position:absolute;left:6px;top:6px;width:62px;height:62px;border-radius:50%;background:linear-gradient(180deg,#fff,#b8c0c8);box-shadow:0 6px 16px rgba(0,0,0,.5)"></div></div></div>`, X0, 390, { ax: 0, ay: .5 });
  const trk = sw.querySelector('.tr'), knob = sw.querySelector('.kn'), swl = sw.querySelector('.sl');
  
  const LV = [RAW_TEXT("S15.text007"), RAW_TEXT("S15.text008"), RAW_TEXT("S15.text009"), RAW_TEXT("S15.text010")];
  const tier = mk(D, `<div class="glass" style="width:720px;height:190px;border-radius:24px;padding:26px 40px">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="${HV(46, SILVER, 2)}">${TEXT("S15.text011")}</div><div class="tv" style="${AN(54, SILVER, 2)}">${TEXT("S15.text012")}</div></div>
      <div style="position:relative;margin-top:26px;height:10px;border-radius:6px;background:#262a31">
        <div class="fl" style="position:absolute;left:0;top:0;height:10px;border-radius:6px;width:0;background:linear-gradient(90deg,${BLUE},${GOLD})"></div>
        ${LV.map((l, i) => `<div style="position:absolute;left:${i / 3 * 100}%;top:-9px;width:2px;height:28px;background:rgba(233,236,239,.25)"></div><div style="position:absolute;left:${i / 3 * 100}%;top:26px;transform:translateX(-50%);${MONO(15, DIM, 3)}">${TEXT_GLOBAL(l)}</div>`).join('')}
        <div class="th" style="position:absolute;left:0;top:-13px;width:36px;height:36px;margin-left:-18px;border-radius:50%;background:#fff;box-shadow:0 0 0 6px rgba(245,185,46,.0),0 6px 14px rgba(0,0,0,.5)"></div></div></div>`, X0, 610, { ax: 0, ay: .5 });
  const tv = tier.querySelector('.tv'), tfl = tier.querySelector('.fl'), tth = tier.querySelector('.th');
  
  const graph = mk(D, `<svg width="820" height="330" viewBox="0 0 760 330" style="overflow:visible">
      <path d="M40 290 H740 M40 290 V20" stroke="rgba(233,236,239,.25)" stroke-width="1.5" fill="none"/>
      <path class="c1" d="M40 270 C200 262 300 230 400 170 S620 50 740 34" stroke="${BLUE2}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path class="c2" d="M40 284 C200 278 300 252 400 196 S620 80 740 62" stroke="${GOLD}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="lk" opacity="0"><path d="M560 92 V 150" stroke="${SILVER}" stroke-width="2" stroke-dasharray="5 6"/><circle cx="560" cy="92" r="7" fill="${BLUE2}"/><circle cx="560" cy="150" r="7" fill="${GOLD}"/></g>
      <text x="40" y="320" fill="${DIM}" style="font:500 15px 'Geist Mono';letter-spacing:3px">${TEXT("S15.text013")}</text>
      <text x="752" y="32" fill="${BLUE2}" style="font:600 22px 'PingFang SC';letter-spacing:2px">${TEXT("S15.text014")}</text>
      <text x="752" y="76" fill="${GOLD}" style="font:600 22px 'PingFang SC';letter-spacing:2px">${TEXT("S15.text015")}</text></svg>`, X0, 540, { ax: 0, ay: .5 });
  const c1 = graph.querySelector('.c1'), c2 = graph.querySelector('.c2'), lk = graph.querySelector('.lk');
  const linked = mk(D, `<div class="chip" style="border-color:${GOLD};color:${GOLD};font-size:24px;padding:10px 24px">${ICON('link', 26, 2)} ${TEXT("S15.text016")}</div>`, X0, 300, { ax: 0, ay: .5 });
  sc.update = t => {
    show(tip, t, tTip - .1, { k: 'left', d: .4, out: tEff - .3 });
    
    show(sw, t, tOpen - .45, { k: 'up', d: .45, out: tEff - .3 });
    const on = EZ.spring(pr(t, tWork - .05, tWork + .35));
    knob.style.left = lerp(6, 82, on).toFixed(1) + 'px';
    trk.style.background = on > .5 ? BLUE : '#262a31'; trk.style.boxShadow = on > .5 ? `0 0 26px rgba(47,123,255,${(.6 * on).toFixed(2)})` : 'none';
    setTxt(swl, on > .5 ? RAW_TEXT("S15.onLabel") : RAW_TEXT("S15.text017")); swl.style.color = on > .5 ? BLUE2 : DIM;
    
    show(tier, t, tModel - .35, { k: 'up', d: .45, out: tEff - .3 });
    const MT = NATIVE_CUE("cue-177"), step = MT.filter(x => t >= x).length;   
    const v = clamp(lerp(0, 1, EZ.out(pr(t, MT[0] - .05, MT[3] + .15))));
    tfl.style.width = (v * 100).toFixed(1) + '%'; tth.style.left = (v * 100).toFixed(1) + '%';
    const lv = LV[Math.min(3, step)]; setTxt(tv, step ? lv : RAW_TEXT("S15.text018"));
    tv.style.color = step >= 4 ? GOLD : SILVER; tth.style.boxShadow = step >= 4 ? `0 0 0 ${(6 + beatPulse(t) * 8).toFixed(1)}px rgba(245,185,46,.35),0 6px 14px rgba(0,0,0,.5)` : '0 6px 14px rgba(0,0,0,.5)';
    
    const L1 = 900, p = EZ.inout(pr(t, tEff - .1, tHook));
    [c1, c2].forEach(c => { c.style.strokeDasharray = `${L1} ${L1}`; c.style.strokeDashoffset = (L1 * (1 - p)).toFixed(1); });
    place(graph, { o: pr(t, tEff - .2, tEff + .05) * (1 - pr(t, T1 - .2, T1)), y: 560 });
    lk.setAttribute('opacity', pr(t, tHook - .05, tHook + .15).toFixed(2));
    show(linked, t, tHook, { k: 'pop', d: .4, out: T1 - .25, y: 340 });
    show(effT, t, tEff - .05, { k: 'mask', d: .45, out: T1 - .25 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tMax + .3, .25, 8); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx, sy }; };
  SOURCE_S("S15.sound000",tTip - .1, 'swipe', .5, -.4); SOURCE_S("S15.sound001",tWork, 'click', .9); SOURCE_S("S15.sound002",tWork + .05, 'ding', .45);
  NATIVE_CUE("cue-178").forEach((x, i) => SOURCE_S("S15.sound003",x, 'tick', .5 + i * .1)); SOURCE_S("S15.sound004",NATIVE_CUE("cue-179")[3] + .1, 'shine', .5);
  SOURCE_S("S15.sound005",tEff - .1, 'rise', .35); SOURCE_S("S15.sound006",tHook, 'check', .5);
})();


(() => {
if(!USER_INPUT.selected.includes("S16"))return;
window.CURRENT_UNIT="S16";

  const T0 = O(169.82), T1 = O(176.05);
  const sc = SC(T0, T1, BG, '16 — 内测');
  const D = sc.el;
  const tCl = NATIVE_CUE("cue-180"), tBeta = NATIVE_CUE("cue-181"), tNext = NATIVE_CUE("cue-182"), tIt = NATIVE_CUE("cue-183"), tFast = NATIVE_CUE("cue-184");
  TKF.push([T0, 'TR', .5, true], [BR.F[1] - .01, { x: 1640, y: 470, w: 380, h: 540, r: 4 }, 0, false], [BR.F[1], { x: 1640, y: 470, w: 380, h: 540, r: 4 }, 0, true]);
  const tm = term(D, 1060, 430, TEXT("S16.text001"));
  const stamp = seal(D, TEXT("S16.text002"), 1180, 700, GOLD, 80, -7, RAW_TEXT("S16.text003"));
  
  const ver = mk(D, `<div style="display:flex;align-items:baseline;gap:22px"><span style="${MONO(22, DIM, 4)}">${TEXT("S16.text004")}</span><span class="v" style="${AN(220, SILVER, 2)};${METAL}">${TEXT("S16.text005")}</span></div>`, 150, 380, { ax: 0, ay: .5 });
  const vv = ver.querySelector('.v');
  const fast = mk(D, `<div style="${HV(130, SILVER, 4)};${BLUEF}">${TEXT("S16.text006")}</div>`, 150, 620, { ax: 0, ay: .5 });
  const ruler = mk(D, `<div style="position:relative;width:1220px;height:60px;overflow:hidden"></div>`, 150, 790, { ax: 0, ay: .5 });
  const ticks = Array.from({ length: 90 }, (_, i) => { const d = document.createElement('i'); d.style.cssText = `position:absolute;top:0;width:2px;height:${i % 10 ? 18 : 40}px;background:rgba(233,236,239,.35)`; ruler.firstChild.appendChild(d); return d; });
  sc.update = t => {
    
    const termOn = 1 - pr(t, tNext - .02, tNext + .28);
    place(tm, { x: 840, y: 470, o: pr(t, T0, T0 + .3) * termOn, s: 1 + beatPulse(t, true) * .004 + (t > tBeta ? .02 * (1 - EZ.out(pr(t, tBeta, tBeta + .5))) : 0) });
    termAt(tm, t, [[T0 + .15, `<span style="color:#6c7480">${TEXT_GLOBAL(RAW_TEXT("S16.terminal001"))}</span>`, 40], [tCl - .5, `<span style="color:#7DB2FF">$</span> ${TEXT_GLOBAL(RAW_TEXT("S16.terminal002"))}`, 22],
      [tCl + .45, `<span style="color:#6c7480">${TEXT_GLOBAL(RAW_TEXT("S16.terminal003"))}</span>`, 30], [tBeta, `<span style="color:#F5B92E">${TEXT_GLOBAL(RAW_TEXT("S16.terminal004"))}</span>`, 200], [tBeta + .25, `<span style="color:#cfd6df">${TEXT_GLOBAL(RAW_TEXT("S16.terminal005"))}</span>`, 40]]);
    sealAt(stamp, t, tBeta + .08, tNext + .05);
    
    const vi = t < tIt ? Number(RAW_TEXT("S16.versionStart")) : Math.min(Number(RAW_TEXT("S16.versionEnd")), Number(RAW_TEXT("S16.versionStart")) + Math.floor(Math.pow((t - tIt) * 2.2, 2.1)));
    setTxt(vv, RAW_TEXT("S16.versionPrefix") + vi);
    show(ver, t, tNext + .2, { k: 'left', d: .4 });
    const fp = pr(t, tFast - .02, tFast + .2);
    place(fast, { s: 1 + (1 - EZ.out5(fp)) * 1.2, o: clamp(fp * 5), blur: (1 - fp) * 10 });
    const dens = 1 + Math.pow(clamp((t - tIt) / 1.6), 2) * 5, sh = (t - tNext) * 900 * dens;
    place(ruler, { o: pr(t, tNext + .2, tNext + .5) });
    ticks.forEach((d, i) => { const x = ((i * 50 / dens - sh) % 1220 + 1220) % 1220; d.style.left = x.toFixed(1) + 'px'; });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tBeta, .4, 20); const [fx, fy] = shake(t, tFast, .25, 10); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx: sx + fx, sy: sy + fy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      if (t > tIt) { 
        const k = clamp((t - tIt) / 1.2);
        for (let i = 0; i < 40; i++) { const y = hash(i * 3.1) * 1080, L = 120 + hash(i) * 380, x = 1920 - ((t * (1800 + hash(i * 7) * 1400) + hash(i * 5) * 1920) % 2400);
          c.strokeStyle = `rgba(125,178,255,${(k * .35 * hash(i * 2.2)).toFixed(3)})`; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + L, y); c.stroke(); }
      }
      if (t >= tBeta && t < tBeta + .8) sparks(c, t, tBeta, 1180, 700, { n: 70, life: .8, dir: 0, spread: 6.3, speed: 1100, g: 700, col: '255,214,120', seed: 16 });
    }, true);
  };
  SOURCE_S("S16.sound000",tCl - .5, 'typing', .45, 0, { d: .9 }); SOURCE_S("S16.sound001",tCl + .45, 'tick_run', .3, 0, { d: 1.2 }); SOURCE_S("S16.sound002",tBeta, 'stamp', .9);
  SOURCE_S("S16.sound003",tNext - .05, 'whoosh', .5); SOURCE_S("S16.sound004",tIt, 'counter', .45, 0, { d: 1.3 }); SOURCE_S("S16.sound005",tFast, 'hit', .8);
})();


(() => {
if(!USER_INPUT.selected.includes("S17"))return;
window.CURRENT_UNIT="S17";

  const T0 = O(176.05), T1 = TALK_END;
  const sc = SC(T0, T1, BG, '17 — 汇聚观点');
  const D = sc.el;
  const tAs = NATIVE_CUE("cue-185"), tEng = NATIVE_CUE("cue-186"), tNews = NATIVE_CUE("cue-187"), tGoal = NATIVE_CUE("cue-188"), tTog = NATIVE_CUE("cue-189"), tNew = NATIVE_CUE("cue-190"),
    tIf = NATIVE_CUE("cue-191"), tFol = NATIVE_CUE("cue-192"), tLike = NATIVE_CUE("cue-193"), tMot = NATIVE_CUE("cue-194"), tThx = NATIVE_CUE("cue-195"), tBye = NATIVE_CUE("cue-196");
  TKF.push([T0, 'R', .5, true], [tGoal - .15, 'TR', .55, true], [tIf - .2, 'R', .55, true], [tThx - .25, { x: 1300, y: 480, w: 600, h: 800, r: 4 }, .6, true]);
  
  const plate = mk(D, `<div style="display:flex;flex-direction:column;gap:14px">
      <div style="${MONO(18, BLUE2, 6)}">${TEXT("S17.text001")}</div>
      <div style="${HV(112, SILVER, 4)};${METAL}">${TEXT("S17.text002")}</div>
      <div class="nm" style="${MONO(20, SILVER, 4)}">${TEXT("S17.text003")}</div></div>`, 150, 420, { ax: 0, ay: .5 });
  const nm = plate.querySelector('.nm');
  
  const NEWS = [RAW_TEXT("S17.text004"), RAW_TEXT("S17.text005"), RAW_TEXT("S17.text006"), RAW_TEXT("S17.text007"), RAW_TEXT("S17.text008")];
  const news = NEWS.map((s, i) => mk(D, `<div style="width:520px;padding:18px 22px;border-radius:12px;background:#15181d;border:1px solid rgba(233,236,239,.1)">
      <div style="${MONO(13, DIM, 3)}">${TEXT("S17.text009")} ${String(i + 1).padStart(2, '0')}</div><div style="${ZH(26, 'rgba(233,236,239,.7)', 600)};margin-top:8px">${TEXT_GLOBAL(s)}</div></div>`, 160 + (i % 2) * 120, 250 + i * 118, { ax: 0, ay: .5 }));
  const notOnly = mk(D, `<div style="${HV(64, SILVER, 2)}">${TEXT("S17.text010")}<span style="color:${DIM}">${TEXT("S17.text011")}</span></div>`, 880, 520, { ax: 0, ay: .5 });
  
  const tog1 = mk(D, `<div style="${HV(150, SILVER, 6)};${METAL}">${TEXT("S17.text012")}</div>`, 860, 420, { ax: .5, ay: .5 });
  const tog2 = mk(D, `<div style="${HV(112, SILVER, 4)};${BLUEF}">${TEXT("S17.text013")}</div>`, 860, 610, { ax: .5, ay: .5 });
  
  const fol = mk(D, `<div style="display:flex;align-items:center;gap:16px;padding:22px 44px;border-radius:60px;background:${BLUE};${HV(48, '#fff', 4)};box-shadow:0 18px 50px rgba(47,123,255,.45)"><span class="fi" style="font:700 46px 'Geist';line-height:1">+</span><span class="ft">${TEXT("S17.text014")}</span></div>`, 470, 400, { ax: .5, ay: .5 });
  const ft = fol.querySelector('.ft'), fi = fol.querySelector('.fi');
  const like = mk(D, `<div style="position:relative;width:220px;height:220px"><div class="hh">${lineIcon('heart', 220, '#FF6A5C', '255,90,70')}</div></div>`, 470, 640, { ax: .5, ay: .5 });
  const likeN = mk(D, `<div style="${MONO(22, GOLD, 4)}">${TEXT("S17.text015")}</div>`, 640, 640, { ax: 0, ay: .5 });
  const motv = mk(D, `<div style="${MONO(20, DIM, 5)}">${TEXT("S17.text016")}</div>`, 470, 820, { ax: .5, ay: .5 });
  const bye = mk(D, `<div style="display:flex;flex-direction:column;gap:10px"><div style="${AN(150, SILVER, 6)};${METAL}">${TEXT("S17.text017")}</div><div style="${AN(150, SILVER, 6)};${GOLDF}">${TEXT("S17.text018")}</div><div style="${MONO(20, DIM, 6)}">${TEXT("S17.text019")}</div></div>`, 150, 470, { ax: 0, ay: .5 });
  
  const PTS = Array.from({ length: 140 }, (_, i) => ({ a: hash(i * 1.7) * 6.2832, r: 700 + hash(i * 3.3) * 700, d: hash(i * 5.1) * .5 }));
  sc.update = t => {
    show(plate, t, tAs - .1, { k: 'left', d: .5, out: tNews - .4 });
    if (t >= tEng) scrambleAt(nm, RAW_TEXT("S17.text020"), t, tEng, .5);
    news.forEach((n, i) => {
      const a = tNews - .55 + i * .06, push = EZ.in(pr(t, tNews + .25 + i * .04, tNews + .7 + i * .04));
      show(n, t, a, { k: 'up', d: .35, o: 1 - push, x: n._x - push * (500 + i * 80), r: -push * (8 + i * 3) });
    });
    show(notOnly, t, tNews + .3, { k: 'right', d: .4, out: tGoal - .2 });
    const p1 = pr(t, tTog - .03, tTog + .25), p2 = pr(t, tNew - .03, tNew + .25), outT = tIf - .3;
    place(tog1, { s: 1 + (1 - EZ.out5(p1)) * 1.3, o: clamp(p1 * 5) * (1 - pr(t, outT, outT + .25)), blur: (1 - p1) * 12 });
    place(tog2, { s: 1 + (1 - EZ.out5(p2)) * 1.1, o: clamp(p2 * 5) * (1 - pr(t, outT, outT + .25)), blur: (1 - p2) * 12 });
    
    show(fol, t, tIf - .1, { k: 'pop', d: .45, out: tThx - .35 });
    const clicked = t >= tFol + .12; setTxt(ft, clicked ? RAW_TEXT("S17.text021") : RAW_TEXT("S17.text022")); setTxt(fi, clicked ? '✓' : '+');
    fol.firstChild.style.background = clicked ? '#1b1f26' : BLUE; fol.firstChild.style.boxShadow = clicked ? '0 0 0 2px rgba(233,236,239,.25)' : '0 18px 50px rgba(47,123,255,.45)';
    const cp = pr(t, tFol + .05, tFol + .3); if (cp > 0 && cp < 1) place(fol, { s: 1 - Math.sin(cp * Math.PI) * .08 });
    const lp = pr(t, tLike - .05, tLike + .4);
    place(like, { o: clamp(lp * 5) * (1 - pr(t, tThx - .35, tThx - .1)), s: lp > 0 ? .6 + .4 * EZ.spring(lp) + beatPulse(t, true) * .03 : .6, r: (1 - EZ.spring(lp)) * -14 });
    show(likeN, t, tLike + .15, { k: 'up', d: .35, out: tThx - .35 });
    show(motv, t, tMot - .1, { k: 'up', d: .4, out: tThx - .35 });
    const bp = pr(t, tThx - .05, tThx + .3);
    place(bye, { s: 1 + (1 - EZ.out5(bp)) * .8, o: clamp(bp * 4), blur: (1 - bp) * 10 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tTog, .3, 12); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx, sy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      const k = pr(t, tGoal - .2, tNew + .3), fade = 1 - pr(t, tIf - .4, tIf);
      if (k > 0 && fade > 0) PTS.forEach((p, i) => {
        const x = clamp((k - p.d) / (1 - p.d)), r = p.r * (1 - EZ.inout(x)) + 30, X = 860 + Math.cos(p.a + t * .2) * r, Y = 520 + Math.sin(p.a + t * .2) * r * .6;
        c.fillStyle = `rgba(${i % 3 ? '125,178,255' : '255,214,120'},${(fade * (.25 + .6 * x)).toFixed(3)})`; c.fillRect(X - 1.5, Y - 1.5, 3, 3);
      });
      if (t > tNew && t < tNew + 1 && fade > 0) glow(c, 860, 520, 420, '125,178,255', (1 - pr(t, tNew, tNew + 1)) * .5 * fade);
      if (t >= tLike && t < tLike + .9) sparks(c, t, tLike, 470, 640, { n: 40, life: .7, dir: -Math.PI / 2, spread: 3.2, speed: 700, g: 900, col: '255,214,120', seed: 21 });
    });
  };
  SOURCE_S("S17.sound000",tAs - .1, 'swoosh', .5); SOURCE_S("S17.sound001",tEng, 'type', .35); SOURCE_S("S17.sound002",tNews + .25, 'whoosh', .55); SOURCE_S("S17.sound003",tTog, 'hit', .9); SOURCE_S("S17.sound004",tNew, 'shine', .5);
  SOURCE_S("S17.sound005",tIf - .1, 'pop', .5); SOURCE_S("S17.sound006",tFol + .1, 'click', .9); SOURCE_S("S17.sound007",tFol + .14, 'check', .5, 0, { n: 2 }); SOURCE_S("S17.sound008",tLike, 'bubble_pop', .7); SOURCE_S("S17.sound009",tLike + .05, 'sparkle', .5);
  SOURCE_S("S17.sound010",tThx, 'hit', .6);
})();


(() => {
if(!USER_INPUT.selected.includes("END"))return;
window.CURRENT_UNIT="END";

  const T0 = TALK_END, T1 = END_T;
  const sc = SC(T0, T1, BG, 'END — .MOTION');
  const D = sc.el;
  const tHit = HIT('endcard'), tCard = tHit + 1.65, tFin = HIT('final');
  TKF.push([tHit - .55, { x: 960, y: 470, w: 60, h: 60, r: 30 }, .52, true], [tHit - .02, { x: 960, y: 470, w: 40, h: 40, r: 20 }, 0, false]);
  
  const mark = mk(D, `<div style="filter:drop-shadow(0 0 40px rgba(123,123,255,.45))">${MOTION_MARK(300, '#fff', '#7B7BFF')}</div>`, 960, 400, { ax: .5, ay: .5 });
  const made1 = mk(D, `<div style="${MONO(22, DIM, 8)}">${TEXT("END.text001")}</div>`, 960, 600, { ax: .5, ay: .5 });
  const made2 = mk(D, `<div style="${HV(64, SILVER, 4)}">${TEXT("END.text002")} <span style="${METAL}">${TEXT("END.text003")}</span> ${TEXT("END.text004")}</div>`, 960, 680, { ax: .5, ay: .5 });
  
  const URL = 'motiongit.com';
  const card = mk(D, `<div style="position:relative;width:1500px;padding:56px 70px 52px;border-radius:28px" class="glass">
      <div style="display:flex;align-items:center;gap:34px">
        <div style="width:132px;height:132px;border-radius:30px;background:#0d0f12;border:1.5px solid rgba(233,236,239,.18);display:flex;align-items:center;justify-content:center">${MOTION_MARK(96, '#fff', '#7B7BFF')}</div>
        <div><div style="${MONO(18, DIM, 6)}">${TEXT("END.text005")}</div><div style="${HV(96, SILVER, 6)};${METAL};margin-top:6px">${TEXT("END.text006")}</div></div>
        <div style="margin-left:auto;text-align:right"><div style="${MONO(16, DIM, 4)}">${TEXT("END.text007")}</div><div style="${HV(36, SILVER, 2)};margin-top:6px">${TEXT("END.text008")}</div></div></div>
      <div style="height:1px;background:rgba(233,236,239,.12);margin:40px 0 34px"></div>
      <div style="${MONO(18, DIM, 6)}">${TEXT("END.text009")}</div>
      <div style="display:flex;align-items:center;gap:22px;margin-top:14px">
        <div class="url" style="font:600 52px 'Geist Mono',monospace;color:${SILVER};letter-spacing:.5px;border-bottom:3px solid ${BLUE};padding-bottom:8px;min-height:72px"></div>
        <div class="cp" style="color:${BLUE2}">${ICON('link', 40, 2)}</div></div>
      <div class="g1" style="${ZH(38, SILVER, 600)};margin-top:38px;line-height:1.45">${TEXT("END.text010")}</div>
      <div class="g2" style="${ZH(26, DIM, 500)};margin-top:14px">${TEXT("END.text011")}</div>
      <div class="pl" style="display:flex;gap:14px;margin-top:34px">${['.MOTION', RAW_TEXT("END.text012"), RAW_TEXT("END.text013"), RAW_TEXT("END.text014")].map((s, i) => `<span class="chip" style="${i === 0 ? `border-color:${LAV};color:${LAV}` : ''}">${TEXT_GLOBAL(s)}</span>`).join('')}</div></div>`, 960, 520, { ax: .5, ay: .5 });
  const url = card.querySelector('.url'), cpI = card.querySelector('.cp'), g1 = card.querySelector('.g1'), g2 = card.querySelector('.g2'), pills = [...card.querySelectorAll('.chip')];
  
  const shut = ['left:0;top:0;border-left:4px solid;border-top:4px solid', 'right:0;top:0;border-right:4px solid;border-top:4px solid', 'left:0;bottom:0;border-left:4px solid;border-bottom:4px solid', 'right:0;bottom:0;border-right:4px solid;border-bottom:4px solid']
    .map(st => mk(sc.top, `<div style="position:absolute;width:54px;height:54px;${st};border-color:${GOLD}"></div>`, 0, 0));
  const shot = mk(sc.top, `<div style="display:flex;align-items:center;gap:12px;padding:10px 22px;border-radius:40px;background:${GOLD};${MONO(18, '#0A0B0D', 4)}">${ICON('camera', 24, 2, '#0A0B0D')} ${TEXT("END.text015")}</div>`, 960, 1010, { ax: .5, ay: .5 });
  sc.update = t => {
    const rv = pr(t, tHit, tHit + .5), out1 = pr(t, tCard - .4, tCard - .05);
    place(mark, { s: (.4 + .6 * EZ.spring(rv)) * (1 - out1 * .6), o: clamp(rv * 4) * (1 - out1), y: 400 - out1 * 120 });
    show(made1, t, tHit + .35, { k: 'up', d: .4, out: tCard - .4 });
    show(made2, t, tHit + .5, { k: 'up', d: .45, out: tCard - .4 });
    
    const cp = pr(t, tCard, tCard + .55);
    place(card, { o: clamp(cp * 3), s: .94 + .06 * EZ.spring(cp), y: 520 + (1 - EZ.out(cp)) * 50, blur: (1 - cp) * 8 });
    typeAt(url, URL, t, tCard + .35, 40);
    cpI.style.opacity = pr(t, tCard + 1.4, tCard + 1.6).toFixed(2);
    g1.style.opacity = pr(t, tCard + 1.3, tCard + 1.6).toFixed(2); g1.style.transform = `translateY(${((1 - EZ.out(pr(t, tCard + 1.3, tCard + 1.7))) * 16).toFixed(1)}px)`;
    g2.style.opacity = pr(t, tCard + 1.6, tCard + 1.9).toFixed(2);
    pills.forEach((p, i) => { const x = pr(t, tCard + 1.8 + i * .08, tCard + 2.1 + i * .08); p.style.opacity = x.toFixed(2); p.style.transform = `scale(${(.8 + .2 * EZ.spring(x)).toFixed(3)})`; });
    
    const sp = EZ.out5(pr(t, tFin - .02, tFin + .28)), on = t >= tFin - .02 ? 1 : 0;
    const box = { l: 960 - 750 - 26, r: 960 + 750 + 26, t: 520 - 300 - 26, b: 520 + 300 + 26 };
    const pos = [[lerp(30, box.l, sp), lerp(30, box.t, sp)], [lerp(1890, box.r, sp) - 54, lerp(30, box.t, sp)], [lerp(30, box.l, sp), lerp(1050, box.b, sp) - 54], [lerp(1890, box.r, sp) - 54, lerp(1050, box.b, sp) - 54]];
    shut.forEach((s, i) => place(s, { x: pos[i][0], y: pos[i][1], o: on }));
    show(shot, t, tFin + .2, { k: 'up', d: .4 });
  };
  sc.cam = t => ({ x: 960, y: 540, z: 1 + (t > tFin ? .012 * (1 - EZ.out(pr(t, tFin, tFin + .6))) : 0) });
  
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      if (t >= tHit - .05 && t < tHit + 1.4) { sparks(c, t, tHit, 960, 400, { n: 140, life: 1.3, dir: 0, spread: 6.3, speed: 1700, g: 300, col: '200,215,255', seed: 31 }); glow(c, 960, 400, 520, '123,123,255', (1 - pr(t, tHit, tHit + 1.2)) * .7); }
      if (t > tHit) stars(c, t, 90, .5 * pr(t, tHit, tHit + 1), 41, '125,178,255');
    });
  };
  tFlash(tHit, .9, .24); tFlash(tFin + .02, .55, .16);
  SOURCE_S("END.sound000",tHit, 'hit', 1); SOURCE_S("END.sound001",tHit + .5, 'shine', .5); SOURCE_S("END.sound002",tCard, 'whoosh', .5); SOURCE_S("END.sound003",tCard + .35, 'typing', .45, 0, { d: 1.05 });
  SOURCE_S("END.sound004",tCard + 1.3, 'pop', .4); pills.forEach((_, i) => SOURCE_S("END.sound005",tCard + 1.8 + i * .08, 'tick', .35)); SOURCE_S("END.sound006",tFin, 'click', .9); SOURCE_S("END.sound007",tFin + .02, 'shine', .6);
})();
