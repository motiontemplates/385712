


(() => {
if(!USER_INPUT.selected.includes("A"))return;
window.CURRENT_UNIT="A";

  const [T0, T1] = BR.A;
  const sc = SC(T0, T1, '#030405', 'B-ROLL — WORKS', { noGrid: true });
  const D = sc.top;
  mk(D, `<div style="width:1920px;height:1080px;background:#030405"></div>`, 0, 0);
  const COLS = 11, TW = 300, TH = 169;
  const w = wall3d(D, 77, COLS, TW, TH, 12);
  
  const order = w._cells.map(c => c).sort((a, b) => Math.hypot(a.cx, a.cy * 1.6) - Math.hypot(b.cx, b.cy * 1.6));
  const MAP = {}; order.forEach((c, r) => { MAP[c.i] = r % 62; });
  const labBg = mk(D, `<div style="width:1920px;height:1080px;background:radial-gradient(ellipse 34% 30% at 50% 48%,rgba(3,4,5,.88),rgba(3,4,5,0))"></div>`, 0, 0);
  const lab = mk(D, `<div style="display:flex;flex-direction:column;align-items:center;gap:10px">
      <div class="n" style="${AN(220, SILVER, 6)};${METAL}">${TEXT("A.text001")}</div>
      <div style="${MONO(24, GOLD, 12)}">${TEXT("A.text002")}</div>
      <div style="${MONO(16, DIM, 6)}">${TEXT("A.text003")}</div></div>`, 960, 520, { ax: .5, ay: .5 });
  const ln = lab.querySelector('.n');
  const tag = mk(D, `<div style="${MONO(18, SILVER, 6)}">${TEXT("A.text004")} <span class="c">${TEXT("A.text005")}</span> ${TEXT("A.text006")}</div>`, 72, 1030, { ax: 0, ay: .5 });
  const tc = tag.querySelector('.c');
  const bt = BEATS.filter(b => b[0] >= T0 - 1e-3 && b[0] < T1).map(b => b[0]);   
  const bb = k => bt[Math.min(k, bt.length - 1)];
  sc.update = t => {
    const u = t - T0, Lb = bt.length;
    
    const pull = EZ.expo(pr(t, bb(0) + .12, bb(2)));
    const zoom = lerp((USER_INPUT.layout==='portrait'?1080:1920)/TW,.62,pull);
    const pan = (t - bb(2)) * 60;
    const suck = EZ.in(pr(t, bb(Lb - 2), T1));
    
    const downs = bt.filter((b, i) => i >= 3 && i % 2 === 1), di = downs.filter(b => t >= b).length;
    const SW = [[-16, 0], [14, .06], [-10, -.04], [18, .08], [-14, .02], [8, .1]];
    const prevS = di ? SW[(di - 1) % SW.length] : [-16, 0], curS = di ? SW[di % SW.length] : [-16, 0];
    const sw = di ? EZ.expo(pr(t, downs[di - 1], downs[di - 1] + .28)) : 0;
    const swY = di ? lerp(prevS[0], curS[0], sw) : -16, swZ = di ? lerp(prevS[1], curS[1], sw) : 0;
    const rx = lerp(0, 18, pull) - suck * 10, ry = lerp(0, swY, pull) + Math.sin(u * .9) * 3 * pull, rz = lerp(0, -4, pull);
    const sc2 = zoom * (1 + swZ * pull) * (1 - suck * .97);
    w._g.style.transform = `translate(${(-pan * pull * (1 - suck)).toFixed(1)}px,0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${(rz + suck * 40).toFixed(2)}deg) scale(${sc2.toFixed(4)})`;
    const dimL = pr(t, bb(bt.length - 5) - .1, bb(bt.length - 5) + .15) * (1 - pr(t, bb(bt.length - 2), bb(bt.length - 2) + .1));
    w._g.style.filter = `brightness(${(1 - suck * .5 - dimL * .62).toFixed(2)})`;
    
    w._cells.forEach(c => {
      const d = Math.hypot(c.cx, c.cy * 1.6), on = pr(t, bb(1) + d * .07, bb(1) + .15 + d * .07);
      c.el.style.opacity = (c.cx === 0 && c.cy === 0 ? 1 : on).toFixed(2);
      
      const popK = di ? (hash(c.i * 3.7 + di) < .045 ? 1 - EZ.out(pr(t, downs[di - 1], downs[di - 1] + .6)) * .6 : 0) : 0;
      c.el.style.transform = popK > 0 ? `translateZ(${(popK * 160).toFixed(1)}px) scale(${(1 + popK * .25).toFixed(3)})` : '';
      c.el.style.outlineColor = popK > 0 ? 'rgba(245,185,46,.95)' : 'rgba(233,236,239,.12)'; c.el.style.outlineWidth = popK > 0 ? '3px' : '1px';
      c.el.style.zIndex = popK > 0 ? 5 : 1;
    });
    wallFrames(w, t, T0, k => MAP[k], c => +c.el.style.opacity > .01);
    place(w, { o: 1 - pr(t, T1 - .08, T1) });
    
    const cp = pr(t, bb(Lb - 5), bb(Lb - 4) + .3);
    setTxt(ln, String(Math.round(EZ.out(cp) * 62)).padStart(2, '0'));
    place(lab, { o: clamp(cp * 3) * (1 - pr(t, bb(Lb - 2), bb(Lb - 2) + .2)), s: 1 + (1 - EZ.out5(pr(t, bb(Lb - 5), bb(Lb - 5) + .25))) * .5 });
    place(labBg, { o: dimL });
    setTxt(tc, String(Math.min(62, Math.round(pr(t, bb(1), bb(4)) * 62))).padStart(2, '0'));
    place(tag, { o: pr(t, bb(1), bb(1) + .2) * (1 - suck) });
  };
  sc.cam = t => ({ x: 960, y: 540, z: zoomPunch(t, BEATS.find(b => b[0] >= t - .35 && b[0] <= t && b[1]) ? BEATS.find(b => b[0] >= t - .35 && b[0] <= t && b[1])[0] : -9, .025) });
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      const Lb = bt.length;
      if (t > bb(Lb - 2)) { radialLines(c, t, 960, 540, pr(t, bb(Lb - 2), T1), 160, '200,215,255', 4, true); glow(c, 960, 540, lerp(40, 360, pr(t, bb(Lb - 2), T1)), '170,200,255', pr(t, bb(Lb - 2), T1)); }
      scanSweep(c, t, bb(3), .6, '245,185,46');
    }, 'top');
  };
  tFlash(T0, .8, .18);
  SOURCE_S("A.sound000",T0, 'hit', 1); SOURCE_S("A.sound001",bt[0] + .12, 'whoosh', .7); bt.slice(1, -2).forEach((b, i) => { if (i % 2 === 0) SOURCE_S("A.sound002",b, 'tick', .35, ((i % 4) - 1.5) * .4); });
  SOURCE_S("A.sound003",bt[bt.length - 5], 'counter', .5, 0, { d: 1.2 }); SOURCE_S("A.sound004",bt[bt.length - 2], 'suck', .8, 0, { d: T1 - bt[bt.length - 2] });
})();


(() => {
if(!USER_INPUT.selected.includes("B"))return;
window.CURRENT_UNIT="B";

  const [T0, T1] = BR.B;
  const sc = SC(T0, T1, '#030405', 'B-ROLL — .MOTION', { noGrid: true });
  const D = sc.top;
  mk(D, `<div style="width:1920px;height:1080px;background:#030405"></div>`, 0, 0);
  const CL = [['pr591_62', RAW_TEXT("B.text001")], ['pr585_30', RAW_TEXT("B.text002")], ['pr589_30', RAW_TEXT("B.text003")], ['pr587_62', RAW_TEXT("B.text004")],
    ['pr586_30', RAW_TEXT("B.text005")], ['pr588_30', RAW_TEXT("B.text006")], ['pr591_30', RAW_TEXT("B.text007")], ['pr585_62', RAW_TEXT("B.text008")],
    ['pr592_30', RAW_TEXT("B.text009")], ['pr588_62', RAW_TEXT("B.text010")], ['pr587_30', RAW_TEXT("B.text011")], ['pr589_62', RAW_TEXT("B.text012")], ['pr590_62', RAW_TEXT("B.text013")], ['pr586_62', RAW_TEXT("B.text014")]];
  const bt = BEATS.filter(b => b[0] >= T0 - 1e-3 && b[0] < T1).map(b => b[0]);
  const v = mk(D, `<div style="position:relative;width:1920px;height:1080px;overflow:hidden;background:#000"><img class="a" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><img class="b" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>`, 0, 0);
  const ia = v.querySelector('.a'), ib = v.querySelector('.b');
  const frameK = ['left:56px;top:56px;border-left:3px solid;border-top:3px solid', 'right:56px;top:56px;border-right:3px solid;border-top:3px solid', 'left:56px;bottom:56px;border-left:3px solid;border-bottom:3px solid', 'right:56px;bottom:56px;border-right:3px solid;border-bottom:3px solid']
    .map(st => mk(D, `<div style="position:absolute;width:46px;height:46px;${st};border-color:${SILVER}"></div>`, 0, 0));
  const cap = mk(D, `<div style="display:flex;align-items:center;gap:16px;padding:12px 22px;background:rgba(3,4,5,.78);border-left:4px solid ${LAV}"><span class="n" style="${MONO(18, LAV, 4)}"></span><span class="tt" style="${AN(40, SILVER, 3)}"></span></div>`, 96, 960, { ax: 0, ay: .5 });
  const cn = cap.querySelector('.n'), ctt = cap.querySelector('.tt');
  const brand = mk(D, `<div style="display:flex;align-items:center;gap:14px">${MOTION_MARK(70, '#fff', '#7B7BFF')}<span style="${MONO(18, SILVER, 6)}">${TEXT("B.text015")}</span></div>`, 1840, 104, { ax: 1, ay: .5 });
  sc.update = t => {
    let k = 0; while (k < bt.length - 1 && t >= bt[k + 1]) k++;
    const c = CL[k % CL.length], cut = bt[k], loc = t - cut;
    setFrame(ia, seqAt(c[0], 48, 30, t, cut - .4, false));
    
    const mode = k % 4, p = pr(t, cut, cut + .16);
    ib.style.display = 'none'; ia.style.clipPath = ''; ia.style.transform = ''; ia.style.filter = '';
    if (k > 0 && p < 1) {
      const pc = CL[(k - 1) % CL.length];
      if (mode === 2) { ib.style.display = 'block'; setFrame(ib, seqAt(pc[0], 48, 30, t, bt[k - 1] - .4, false)); ib.style.transform = `translateX(${(-EZ.inout(p) * 100).toFixed(1)}%)`; ia.style.transform = `translateX(${((1 - EZ.inout(p)) * 100).toFixed(1)}%)`; }
      if (mode === 3) { ib.style.display = 'block'; setFrame(ib, seqAt(pc[0], 48, 30, t, bt[k - 1] - .4, false)); ib.style.transform = ''; ia.style.clipPath = `circle(${(EZ.out(p) * 75).toFixed(1)}% at 50% 50%)`; ib.style.zIndex = 0; ia.style.zIndex = 1; }
      if (mode === 1) { const j = Math.floor(t * 60); ia.style.filter = `drop-shadow(${((hash(j) - .5) * 60 * (1 - p)).toFixed(0)}px 0 0 rgba(255,40,60,.9)) drop-shadow(${((hash(j + 1) - .5) * -60 * (1 - p)).toFixed(0)}px 0 0 rgba(40,210,255,.9))`; }
    }
    if (mode === 0) ia.style.transform = `scale(${(1 + .06 * (1 - EZ.out(pr(t, cut, cut + .25)))).toFixed(4)})`;
    else if (mode !== 2) ia.style.transform = `scale(${(1 + loc * .03).toFixed(4)})`;
    setTxt(cn, String(k + 1).padStart(2, '0') + ' / ' + String(bt.length).padStart(2, '0')); setTxt(ctt, c[1]);
    place(cap, { o: 1, x: 96 - (1 - EZ.out(pr(t, cut, cut + .2))) * 40 });
    frameK.forEach((f, i) => { const q = beatPulse(t); place(f, { o: .85, x: [1, -1, 1, -1][i] * q * 10, y: [1, 1, -1, -1][i] * q * 10 }); });
    place(brand, { o: pr(t, T0, T0 + .2) });
    place(v, { o: 1 - pr(t, T1 - .1, T1) });
  };
  tFlash(T0, .9, .2);
  SOURCE_S("B.sound000",T0, 'hit', 1); bt.slice(1).forEach((b, i) => SOURCE_S("B.sound001",b, ['swoosh', 'glitch', 'whoosh', 'pop'][(i + 1) % 4], .45, ((i % 3) - 1) * .4));
})();


(() => {
if(!USER_INPUT.selected.includes("C"))return;
window.CURRENT_UNIT="C";

  const [T0, T1] = BR.C;
  const sc = SC(T0, T1, '#030405', 'B-ROLL — UPGRADE', { noGrid: true });
  const D = sc.top;
  mk(D, `<div style="width:${USER_INPUT.layout==='portrait'?1080:1920}px;height:${USER_INPUT.layout==='portrait'?1920:1080}px;background:#030405"></div>`, 0, 0);
  const bt = BEATS.filter(b => b[0] >= T0 - 1e-3 && b[0] < T1).map(b => b[0]);
  
  const STAGES = USER_INPUT.layout==='portrait'?[[1,1],[2,2],[2,8],[4,12]]:[[1,1],[2,2],[4,4],[8,6]];   
  const grid = mk(D, `<div style="position:relative;width:${USER_INPUT.layout==='portrait'?1080:1920}px;height:${USER_INPUT.layout==='portrait'?1920:1080}px;overflow:hidden"></div>`, 0, 0);
  const G = grid.firstChild, cells = [];
  for (let i = 0; i < 48; i++) {
    const c = document.createElement('div');
    c.style.cssText = 'position:absolute;overflow:hidden;background:#0b0c0e';
    c.innerHTML = `<img style="width:100%;height:100%;object-fit:cover;display:block"><div class="ok" style="position:absolute;right:8px;bottom:8px;padding:3px 9px;border-radius:5px;background:${GOLD};font:700 13px 'Geist Mono';color:#0A0B0D;opacity:0">${TEXT("C.text001")}</div>`;
    G.appendChild(c); cells.push({ el: c, img: c.firstChild, ok: c.querySelector('.ok') });
  }
  const cnt = mk(D, `<div style="display:flex;align-items:baseline;gap:18px;padding:14px 26px;background:rgba(3,4,5,.82);border-left:5px solid ${GOLD}"><span class="n" style="${AN(96, GOLD, 2)};${GOLDF}">${TEXT("C.text002")}</span><span style="${MONO(20, SILVER, 6)}">${TEXT("C.text003")}</span></div>`, 96, 960, { ax: 0, ay: .5 });
  const cn = cnt.querySelector('.n');
  const SRC = [0, 24, 26, 30, 1, 36, 40, 50, 2, 3, 28, 32, 44, 46, 54, 58, 4, 5, 6, 7, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  sc.update = t => {
    const k = bt.filter(b => t >= b).length - 1;              
    const st = Math.min(STAGES.length - 1, Math.floor(Math.max(0, k) / 4)), [cols, rows] = STAGES[st];
    const prevSt = Math.max(0, st - 1), sp = EZ.expo(pr(t, bt[st * 4] || T0, (bt[st * 4] || T0) + .22));
    const [pc, pr_] = STAGES[prevSt];
    const PW=USER_INPUT.layout==='portrait'?1080:1920,PH=USER_INPUT.layout==='portrait'?1920:1080;const cw=lerp(PW/pc,PW/cols,st?sp:1),ch=lerp(PH/pr_,PH/rows,st?sp:1);
    const n = cols * rows;
    const fi = Math.floor(Math.max(0, t - T0) * 24);       
    cells.forEach((c, i) => {
      const on = i < n; c.el.style.display = on ? 'block' : 'none'; if (!on) return;
      const x = (i % cols) * cw, y = Math.floor(i / cols) * ch;
      c.el.style.left = x.toFixed(1) + 'px'; c.el.style.top = y.toFixed(1) + 'px'; c.el.style.width = (cw - 4).toFixed(1) + 'px'; c.el.style.height = (ch - 4).toFixed(1) + 'px';
      if (i === 0) setFrame(c.img, seqAt('own_hud2', 96, 30, t, T0, false));
      else setFrame(c.img, `sc/wall2/${String(SRC[i % SRC.length]).padStart(3, '0')}/f_${String(1 + ((fi + i * 5) % 30)).padStart(2, '0')}.jpg`);
      const stampT = (bt[st * 4] || T0) + .15 + (i / n) * .9;
      c.ok.style.opacity = pr(t, stampT, stampT + .06).toFixed(2); c.ok.style.transform = `scale(${(1 + (1 - EZ.out5(pr(t, stampT, stampT + .15))) * .8).toFixed(3)})`;
      c.ok.style.fontSize = (st >= 3 ? 10 : 13) + 'px';
    });
    const total = Math.round(lerp(1, parseInt(RAW_TEXT("C.text002")), EZ.in(pr(t, T0, T1 - .5))));
    setTxt(cn, total >= parseInt(RAW_TEXT("C.text002")) ? RAW_TEXT("C.text002") : String(total).padStart(3, '0'));
    place(cnt, { o: 1 });
    place(grid, { o: 1 - pr(t, T1 - .1, T1), s: zoomPunch(t, bt[k] || T0, .05, .25) });
  };
  const U = sc.update; sc.update = t => { U(t); fxDraw(c => { bt.filter((b, i) => i % 4 === 0).forEach(b => scanSweep(c, t, b + .1, .9, '245,185,46')); }, 'top'); };
  tFlash(T0, .9, .2);
  SOURCE_S("C.sound000",T0, 'hit', 1); bt.forEach((b, i) => { if (i % 4 === 0 && i) SOURCE_S("C.sound001",b, 'whoosh', .6); else if (i) SOURCE_S("C.sound002",b, 'tick', .3, ((i % 3) - 1) * .5); });
  bt.filter((b, i) => i % 4 === 0).forEach(b => SOURCE_S("C.sound003",b + .3, 'shine', .35));
})();


(() => {
if(!USER_INPUT.selected.includes("D"))return;
window.CURRENT_UNIT="D";

  const [T0, T1] = BR.D;
  const sc = SC(T0, T1, '#030405', 'B-ROLL — GOODBYE', { noGrid: true });
  const D = sc.top;
  mk(D, `<div style="width:1920px;height:1080px;background:#030405"></div>`, 0, 0);
  const tLast = HIT('return');        
  const quiet = T1 - 1.85;            
  const v1 = vcard(D, 560, 996, { r: 10, label: RAW_TEXT("D.text001"), badge: RAW_TEXT("D.text002") }), v2 = vcard(D, 560, 996, { r: 10, label: RAW_TEXT("D.text003"), badge: RAW_TEXT("D.text004") });
  const date = mk(D, `<div style="display:flex;flex-direction:column;gap:10px"><span style="${MONO(20, DIM, 6)}">${TEXT("D.text005")}</span><span class="d" style="${AN(130, SILVER, 2)};${METAL}">${TEXT("D.text006")}</span><span class="c" style="${MONO(24, GOLD, 4)}">${TEXT("D.text007")}</span></div>`, 150, 470, { ax: 0, ay: .5 });
  const dd = date.querySelector('.d'), dc = date.querySelector('.c');
  const card = mk(D, `<div style="width:620px;padding:34px 40px;border-radius:20px;border:2px solid ${GOLD};background:linear-gradient(180deg,#16181d,#0c0d10)">
      <div style="${MONO(16, GOLD, 4)}">${TEXT("D.text008")}</div><div style="font:700 48px 'Geist Mono';color:${SILVER};margin-top:14px">${TEXT("D.text009")}</div>
      <div style="${ZH(24, DIM, 500)};margin-top:10px">${TEXT("D.text010")}</div></div>`, 960, 500, { ax: .5, ay: .5 });
  const pts = (() => { const a = []; for (let y = -90; y <= 90; y += 7) for (let x = -310; x <= 310; x += 7) a.push([x, y]); return a; })();
  const bye = mk(D, `<div style="${MONO(22, DIM, 12)}">${TEXT("D.text011")}</div>`, 960, 700, { ax: .5, ay: .5 });
  const DAYS = [RAW_TEXT("D.text012"), RAW_TEXT("D.text013"), RAW_TEXT("D.text014"), RAW_TEXT("D.text015"), RAW_TEXT("D.text016"), RAW_TEXT("D.text017"), RAW_TEXT("D.text018"), RAW_TEXT("D.text019"), RAW_TEXT("D.text020"), RAW_TEXT("D.text021")];
  sc.update = t => {
    const vo = 1 - pr(t, quiet - .25, quiet);
    place(v1, { x: 1170, y: 540, o: vo, s: .98 + (t - T0) * .006, r: -1.5 }); place(v2, { x: 1560, y: 560, o: vo * pr(t, T0 + .2, T0 + .4), s: .9, r: 2 });
    vseq(v1, 'w6827', 374, T0 + (t - T0) * 6, T0); vseq(v2, 'w6813', 420, T0 + (t - T0) * 6, T0);
    const di = Math.min(DAYS.length - 1, Math.floor(pr(t, T0, quiet - .1) * DAYS.length));
    setTxt(dd, DAYS[di]); setTxt(dc, RAW_TEXT("D.text022") + String(Math.round(EZ.in(pr(t, T0, quiet - .1)) * Number(RAW_TEXT("D.number001")))).padStart(3, '0') + RAW_TEXT("D.text023"));
    place(date, { o: vo });
    
    const cin = pr(t, quiet - .1, quiet + .25), dis = pr(t, quiet + .55, T1 - .1);
    place(card, { o: clamp(cin * 3) * (dis > 0 ? 0 : 1), s: .94 + .06 * EZ.out(cin) });
    show(bye, t, quiet + .3, { k: 'blur', d: .5, out: T1 - .3 });
    sc._dis = dis;
  };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      const p = sc._dis; if (p <= 0) return;
      c.save(); c.globalCompositeOperation = 'lighter';
      pts.forEach(([x, y], i) => {
        const d = clamp(p * 1.4 - (x + 310) / 620 * .5), e = EZ.in(d);
        const X = 960 + x + e * (300 + hash(i) * 500), Y = 500 + y - e * (120 + hash(i * 3) * 380) + Math.sin(i + t * 3) * e * 20;
        c.fillStyle = `rgba(${hash(i * 7) < .3 ? '245,185,46' : '233,236,239'},${(.9 * (1 - e)).toFixed(3)})`; c.fillRect(X, Y, 2.6, 2.6);
      });
      c.restore();
    }, 'top');
  };
  SOURCE_S("D.sound000",T0, 'swoosh', .5); SOURCE_S("D.sound001",T0 + .1, 'tick_run', .4, 0, { d: quiet - T0 - .2 }); SOURCE_S("D.sound002",quiet, 'powerdown', .4); SOURCE_S("D.sound003",quiet + .55, 'dissolve', .6); SOURCE_S("D.sound004",quiet + .6, 'sparkle', .4);
})();


(() => {
if(!USER_INPUT.selected.includes("F"))return;
window.CURRENT_UNIT="F";

  const [T0, T1] = BR.F;
  const sc = SC(T0, T1, '#030405', 'B-ROLL — PROJECT MOTION', { noGrid: true });
  const D = sc.top;
  mk(D, `<div style="width:1920px;height:1080px;background:#030405"></div>`, 0, 0);
  const bt = BEATS.filter(b => b[0] >= T0 - 1e-3 && b[0] < T1).map(b => b[0]);
  const CL = [['cmA', 76], ['cmB', 76]];
  const win = mk(D, `<div style="position:relative;width:1500px;height:844px;border-radius:16px;overflow:hidden;background:#000;box-shadow:0 40px 120px rgba(0,0,0,.7);outline:1px solid rgba(233,236,239,.2)"><img style="width:100%;height:100%;object-fit:cover;display:block"></div>`, 960, 520, { ax: .5, ay: .5 });
  const im = win.querySelector('img');
  const lab = mk(D, `<div style="display:flex;align-items:center;gap:16px"><span style="padding:6px 14px;border-radius:6px;background:${GOLD};${MONO(18, '#0A0B0D', 3)};font-weight:700">${TEXT("F.text001")}</span><span style="${AN(44, SILVER, 3)}">${TEXT("F.text002")}</span><span class="sp" style="${MONO(16, DIM, 4)}">${TEXT("F.text003")}</span></div>`, 210, 1000, { ax: 0, ay: .5 });
  const sp = lab.querySelector('.sp');
  const src = mk(D, `<div style="${MONO(14, DIM, 3)}">${TEXT("F.text004")}</div>`, 1710, 1000, { ax: 1, ay: .5 });
  sc.update = t => {
    
    const k = t < bt[8] ? 0 : 1;
    const seg0 = k ? bt[8] : T0, [dir, n] = CL[k];
    setFrame(im, seqAt(dir, n, 30, t, seg0, false));
    setTxt(sp, [RAW_TEXT("F.metric001"), RAW_TEXT("F.metric002")][k]);
    const p = pr(t, seg0, seg0 + .25);
    place(win, { o: 1 - pr(t, T1 - .1, T1), s: (.96 + .04 * EZ.out(p)) * (1 + (t - T0) * .006), r: (1 - EZ.out(p)) * (k % 2 ? 1.5 : -1.5) });
    place(lab, { o: pr(t, T0, T0 + .25) }); place(src, { o: pr(t, T0 + .2, T0 + .5) * .9 });
  };
  const U = sc.update; sc.update = t => { U(t); fxDraw(c => { scanSweep(c, t, bt[8], .5, '245,185,46'); }, 'top'); };
  tFlash(T0, .9, .2);
  SOURCE_S("F.sound000",T0, 'hit', 1); SOURCE_S("F.sound001",bt[8], 'whoosh', .6);
})();
