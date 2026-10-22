


(() => {
if(!USER_INPUT.selected.includes("S08"))return;
window.CURRENT_UNIT="S08";

  const T0 = O(74.10), T1 = O(83.10);
  const sc = SC(T0, T1, BG, '08 — 取舍');
  const D = sc.el;
  const tSure = NATIVE_CUE("cue-079"), tWith = NATIVE_CUE("cue-080"), tPop = NATIVE_CUE("cue-081"), tMost = NATIVE_CUE("cue-082"), tMine = NATIVE_CUE("cue-083"), tSoon = NATIVE_CUE("cue-084"), tOut = NATIVE_CUE("cue-085");
  TKF.push([T0, 'L', .6, true]);
  
  const sure = mk(D, `<div style="display:flex;flex-direction:column;gap:10px"><span style="${MONO(20, BLUE2, 6)}">${TEXT("S08.text001")}</span><span style="${HV(84, SILVER, 4)};${METAL}">${TEXT("S08.text002")}</span></div>`, 840, 230, { ax: 0, ay: .5 });
  
  const rail = mk(D, `<div style="position:relative;width:1000px;height:40px">
      <div style="position:absolute;left:0;top:20px;width:1000px;height:2px;background:rgba(233,236,239,.25)"></div>
      ${[RAW_TEXT("S08.year001"), RAW_TEXT("S08.year002"), RAW_TEXT("S08.text003")].map((y, i) => `<div style="position:absolute;left:${i * 480}px;top:0;${MONO(16, DIM, 3)}">${TEXT_GLOBAL(y)}</div><div style="position:absolute;left:${i * 480}px;top:15px;width:2px;height:12px;background:rgba(233,236,239,.5)"></div>`).join('')}</div>`, 1340, 820, { ax: .5, ay: .5 });
  const SK = [[RAW_TEXT("S08.label001"), RAW_TEXT("S08.text004")], [RAW_TEXT("S08.label002"), RAW_TEXT("S08.text004")], [RAW_TEXT("S08.label003"), RAW_TEXT("S08.text004")], [RAW_TEXT("S08.label004"), RAW_TEXT("S08.text004")], [RAW_TEXT("S08.label005"), RAW_TEXT("S08.text005")]];
  const cards = SK.map(([n, s], i) => {
    const mine = i === 4;
    const e = mk(D, `<div style="position:relative;width:330px;height:190px;border-radius:14px;background:#181c22;border:${mine ? 2.5 : 1.5}px solid ${mine ? GOLD : 'rgba(233,236,239,.2)'};padding:22px 24px;overflow:hidden">
        <div style="${MONO(14, mine ? GOLD : DIM, 3)}">${TEXT_GLOBAL(s)}</div><div style="font:600 28px 'Geist Mono';color:${SILVER};margin-top:12px">${TEXT_GLOBAL(n)}</div>
        <div style="position:absolute;left:24px;bottom:20px;display:flex;gap:8px">${[0, 1, 2].map(() => `<i style="width:44px;height:6px;border-radius:3px;background:rgba(233,236,239,.18)"></i>`).join('')}</div>
        <div class="px" style="position:absolute;inset:0"></div></div>`, 0, 0, { ax: .5, ay: .5 });
    e._px = e.querySelector('.px'); e._mine = mine;
    
    e._bits = Array.from({ length: 24 }, (_, k) => { const b = document.createElement('div'); b.style.cssText = `position:absolute;left:${(k % 6) * 55}px;top:${Math.floor(k / 6) * 48}px;width:55px;height:48px;background:${mine ? 'rgba(245,185,46,.85)' : '#2a2f37'};opacity:0`; e._px.appendChild(b); return b; });
    return e;
  });
  const POSC = [[1010, 360], [1370, 360], [1730, 360], [1190, 590], [1550, 590]];
  const wave = mk(D, `<div style="width:260px;height:640px;background:linear-gradient(90deg,rgba(47,123,255,0),rgba(47,123,255,.55) 70%,rgba(160,200,255,.95) 92%,rgba(47,123,255,0));filter:blur(2px)"></div>`, 0, 500, { ax: .5, ay: .5 });
  const wLab = mk(D, `<div class="chip" style="border-color:${BLUE2};color:${BLUE2}">${TEXT("S08.text006")}</div>`, 0, 200, { ax: .5, ay: .5 });
  const stamp = seal(D, TEXT("S08.text007"), 1370, 470, RED, 130, -8, RAW_TEXT("S08.text008"));
  const outT = mk(D, `<div style="${HV(84, SILVER, 4)}">${TEXT("S08.text009")}<span style="color:${RED}">${TEXT("S08.text010")}</span></div>`, 840, 150, { ax: 0, ay: .5 });
  const mine = mk(D, `<div style="${MONO(18, GOLD, 4)}">${TEXT("S08.text011")}</div>`, 1730, 700, { ax: 0, ay: .5 });
  sc.update = t => {
    show(sure, t, tSure - .15, { k: 'mask', d: .45, out: tWith - .1 });
    show(rail, t, tWith - .1, { k: 'up', d: .4, out: T1 - .25 });
    
    const wx = lerp(780, 2000, EZ.inout(pr(t, tPop - .2, tMine + .2)));
    place(wave, { x: wx, o: pr(t, tPop - .2, tPop) * (1 - pr(t, tMine, tMine + .3)) });
    place(wLab, { x: wx - 60, o: pr(t, tPop - .1, tPop + .1) * (1 - pr(t, tMine, tMine + .3)) });
    cards.forEach((c, i) => {
      const [x, y] = POSC[i];
      const tIn = (i === 4 ? tMine - .1 : tMost - .3 + i * .1);
      const pin = pr(t, tIn, tIn + .4);
      const swept = !c._mine && wx > x + 150 ? 1 : 0;
      const greyMine = c._mine ? pr(t, tSoon - .1, tSoon + .2) : 0;
      const shatter = pr(t, tOut + (c._mine ? .32 : i * .05), tOut + (c._mine ? 1.2 : .9 + i * .05));
      const g = Math.max(swept, greyMine); c.firstChild.style.filter = `grayscale(${g.toFixed(2)}) brightness(${(1 - g * .3).toFixed(2)})`; c.firstChild.style.boxShadow = g < .5 && !shatter ? `0 0 0 1px rgba(125,178,255,.25),0 18px 40px rgba(0,0,0,.5)` : 'none';
      c._bits.forEach((b, k) => {
        const kk = clamp(shatter * 1.6 - hash(k * 3.1 + i) * .6);
        b.style.opacity = shatter > 0 ? (1 - kk * .9).toFixed(2) : 0;
        b.style.transform = kk > 0 ? `translate(${((hash(k + i) - .5) * 80 * kk).toFixed(1)}px,${(kk * kk * 380).toFixed(1)}px) rotate(${((hash(k * 7) - .5) * 160 * kk).toFixed(1)}deg)` : '';
      });
      const body = shatter > 0 ? 0 : 1;
      [...c.firstChild.children].forEach(ch => { if (ch !== c._px) ch.style.opacity = body; });
      c.firstChild.style.background = shatter > 0 ? 'transparent' : '#181c22'; c.firstChild.style.borderColor = shatter > 0 ? 'transparent' : (c._mine ? GOLD : 'rgba(233,236,239,.2)');
      place(c, { x, y: y + (1 - EZ.out(pin)) * 50, o: clamp(pin * 3) * (1 - pr(t, T1 - .3, T1 - .05)), s: c._mine ? 1 + Math.sin(Math.PI * pr(t, tMine, tMine + .4)) * .06 : 1 });
    });
    show(mine, t, tMine + .15, { k: 'up', d: .4, out: tOut + .2 });
    sealAt(stamp, t, tOut, T1 - .3);
    show(outT, t, tSoon - .1, { k: 'mask', d: .45, out: T1 - .25 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tOut, .45, 20); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx, sy }; };
  SOURCE_S("S08.sound000",tSure - .15, 'swoosh', .45); SOURCE_S("S08.sound001",tMost - .3, 'card', .4, .1); SOURCE_S("S08.sound002",tMost - .1, 'card', .4, .3); SOURCE_S("S08.sound003",tMost + .1, 'card', .4, .5); SOURCE_S("S08.sound004",tMost + .3, 'card', .4, .2);
  SOURCE_S("S08.sound005",tPop - .2, 'whoosh', .55, 0, { d: 1.2 }); SOURCE_S("S08.sound006",tMine - .1, 'card', .5, .4); SOURCE_S("S08.sound007",tOut, 'stamp', 1); SOURCE_S("S08.sound008",tOut + .05, 'crack', .6); SOURCE_S("S08.sound009",tOut + .35, 'dissolve', .5);
})();


(() => {
if(!USER_INPUT.selected.includes("S09"))return;
window.CURRENT_UNIT="S09";

  const T0 = O(83.10), T1 = BR.D[0];
  const sc = SC(T0, T1, BG, '09 — 再见');
  const D = sc.el;
  const tRight = NATIVE_CUE("cue-086"), tHeart = NATIVE_CUE("cue-087"), tUpd = NATIVE_CUE("cue-088"), tFlow = NATIVE_CUE("cue-089"), tBut = NATIVE_CUE("cue-090"), tEra = NATIVE_CUE("cue-091"), tYes = NATIVE_CUE("cue-092"), tBye = NATIVE_CUE("cue-093"),
    tEven = NATIVE_CUE("cue-094"), tHard = NATIVE_CUE("cue-095");
  TKF.push([T0, 'L', .5, true], [tBut + .1, { x: 432, y: 492, w: 470, h: 640, r: 4 }, .9, true], [tEra - .03, 'TL', 0, false], [tEven - .25, 'TL', .45, true]);
  
  const work = vcard(D, 450, 800, { label: RAW_TEXT("S09.text001"), badge: RAW_TEXT("S09.text002") });
  const log = mk(D, `<div style="width:430px;height:250px;overflow:hidden;padding:14px 16px;border-radius:0 0 10px 10px;background:linear-gradient(180deg,rgba(5,6,8,0),rgba(5,6,8,.92) 30%);font:500 16px/1.75 'Geist Mono',monospace;color:#b5c3d3"><div class="ll"></div></div>`, 0, 0, { ax: 0, ay: 0 });
  const ll = log.querySelector('.ll');
  const LOG = [RAW_TEXT("S09.text003"), RAW_TEXT("S09.text004"), RAW_TEXT("S09.text005"), RAW_TEXT("S09.text006"), RAW_TEXT("S09.text007"), RAW_TEXT("S09.text008"), RAW_TEXT("S09.text009"), RAW_TEXT("S09.text010"), RAW_TEXT("S09.text011"), RAW_TEXT("S09.text012"), RAW_TEXT("S09.text013"), RAW_TEXT("S09.text014"), RAW_TEXT("S09.text015"), RAW_TEXT("S09.text016")];
  ll.innerHTML = LOG.map((m, i) => `<div><span style="color:${GOLD}">${(0x3fa1c + i * 7919).toString(16).slice(-6)}</span> ${TEXT_GLOBAL(m)}</div>`).join('');
  const heart = mk(D, `<div style="display:flex;flex-direction:column;gap:12px"><span style="${MONO(20, GOLD, 6)}">${TEXT("S09.text017")}</span><span style="${HV(110, SILVER, 6)};${METAL}">${TEXT("S09.text018")}</span></div>`, 1250, 300, { ax: 0, ay: .5 });
  const commits = mk(D, `<div style="display:flex;align-items:baseline;gap:18px"><span style="${MONO(18, DIM, 4)}">${TEXT("S09.text019")}</span><span class="cn" style="${AN(96, SILVER, 2)};${METAL}">${TEXT("S09.text020")}</span><span style="${MONO(14, DIM, 3)}">${TEXT("S09.text021")}</span></div>`, 1250, 470, { ax: 0, ay: .5 });
  const cn = commits.querySelector('.cn');
  const curve = mk(D, `<svg width="560" height="220" viewBox="0 0 560 220" style="overflow:visible"><path d="M0 210 H560" stroke="rgba(233,236,239,.25)" stroke-width="1.5"/>
      <path class="cv" d="M0 200 C80 196 140 186 200 160 S320 120 380 80 S500 20 560 12" fill="none" stroke="${BLUE2}" stroke-width="4" stroke-linecap="round"/>
      <text x="0" y="240" fill="${DIM}" style="font:500 15px 'Geist Mono';letter-spacing:3px">${TEXT("S09.text022")}</text></svg>`, 1250, 640, { ax: 0, ay: .5 });
  const cv = curve.querySelector('.cv');
  
  const bye1 = mk(sc.top, `<div style="${HV(150, SILVER, 6)};${METAL}">${TEXT("S09.text023")}</div>`, 960, 380, { ax: .5, ay: .5 });
  const bye2 = mk(sc.top, `<div style="${HV(230, SILVER, 10)};${GOLDF}">${TEXT("S09.text024")}</div>`, 960, 610, { ax: .5, ay: .5 });
  const byeTag = mk(sc.top, `<div style="${MONO(22, DIM, 10)}">${TEXT("S09.text025")}</div>`, 960, 210, { ax: .5, ay: .5 });
  
  const halfA = vcard(D, 760, 428, { r: 12 }), halfB = vcard(D, 760, 428, { r: 12 });
  halfA.firstChild.firstElementChild.style.clipPath = 'polygon(0 0,58% 0,42% 100%,0 100%)';
  halfB.firstChild.firstElementChild.style.clipPath = 'polygon(58% 0,100% 0,100% 100%,42% 100%)';
  const evenT = mk(D, `<div style="display:flex;flex-direction:column;gap:10px"><span style="${MONO(20, DIM, 6)}">${TEXT("S09.text026")}</span><span style="${HV(72, SILVER, 4)}">${TEXT("S09.text027")} <span style="${GOLDF}">${TEXT("S09.text028")}</span></span></div>`, 960, 160, { ax: .5, ay: .5 });
  sc.update = t => {
    
    const wIn = pr(t, tRight - .2, tRight + .3), back = EZ.inout(pr(t, tBut, tEra - .1));
    place(work, { x: lerp(1010, 1080, back), y: 492, o: clamp(wIn * 3) * (1 - pr(t, tEra - .15, tEra)), s: (.92 + .08 * EZ.out(wIn)) * (1 - back * .3), blur: back * 4 });
    work.firstChild.style.filter = `brightness(${(1 - back * .55).toFixed(2)})`;
    vseq(work, 'w6827', 374, t, tRight - .2);
    
    place(log, { x: 795, y: 632, o: pr(t, tRight + .3, tRight + .6) * (1 - back) });
    ll.style.transform = `translateY(${(-Math.max(0, t - tRight) * 46).toFixed(1)}px)`;
    show(heart, t, tHeart - .2, { k: 'mask', d: .45, out: tBut - .1 });
    show(commits, t, tUpd - .15, { k: 'up', d: .4, out: tBut - .1 });
    setTxt(cn, String(Math.round(counter(t, tUpd - .1, tUpd + 1.3, 0, Number(RAW_TEXT("S09.text020"))))));
    show(curve, t, tFlow - .2, { k: 'up', d: .4, out: tBut - .1 });
    const L = 700; cv.style.strokeDasharray = `${L} ${L}`; cv.style.strokeDashoffset = (L * (1 - EZ.inout(pr(t, tFlow - .1, tFlow + .8)))).toFixed(1);
    
    const b1 = pr(t, tEra, tEra + .22), b2 = pr(t, tBye - .02, tBye + .22), bout = pr(t, tEven - .35, tEven - .1);
    place(bye1, { s: 1 + (1 - EZ.out5(b1)) * 1.1, o: clamp(b1 * 5) * (1 - bout), blur: (1 - b1) * 12 });
    place(bye2, { s: 1 + (1 - EZ.out5(b2)) * 1.4, o: clamp(b2 * 5) * (1 - bout), blur: (1 - b2) * 14 });
    show(byeTag, t, tEra + .15, { k: 'blur', d: .4, out: tEven - .35 });
    
    const fIn = pr(t, tEven - .1, tEven + .35), cut = pr(t, tHard + .25, tHard + .45), sep = EZ.inout(pr(t, tHard + .45, T1 - .1));
    [halfA, halfB].forEach((h, i) => {
      place(h, { x: 1100 + (i ? 1 : -1) * sep * 260, y: 560 + (i ? 1 : -1) * sep * 40, o: clamp(fIn * 3) * (1 - sep * .9), s: 1 + (t - tEven) * .02, r: (i ? 1 : -1) * sep * 6 });
      vseq(h, 'w6813', 420, t, tEven - .1);
    });
    show(evenT, t, tEven, { k: 'up', d: .4, x: 1100, out: T1 - .2 });
    sc._cut = cut;
  };
  sc.cam = t => { const [sx, sy] = shake(t, tEra, .45, 24), [bx, by] = shake(t, tBye, .35, 18); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006 + (t > tBut && t < tEra ? .025 * pr(t, tBut, tEra) : 0), sx: sx + bx, sy: sy + by }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      
      const p = pr(t, NATIVE_CUE("cue-096") + .2, NATIVE_CUE("cue-097") + .5);
      if (p > 0 && p < 1.4) {
        const x0 = 1100 + 760 * (.58 - .5), x1 = 1100 + 760 * (.42 - .5), y0 = 560 - 214, y1 = 560 + 214, k = EZ.out(p);
        const X = lerp(x0, x1, k), Y = lerp(y0, y1, k);
        c.strokeStyle = 'rgba(255,240,200,.95)'; c.lineWidth = 4; c.shadowColor = GOLD; c.shadowBlur = 24; c.beginPath(); c.moveTo(x0, y0); c.lineTo(X, Y); c.stroke(); c.shadowBlur = 0;
        glow(c, X, Y, 60); sparks(c, t, NATIVE_CUE("cue-098") + .2, X, Y, { rate: 120, n: 60, life: .5, col: '255,214,120', px: b => lerp(x0, x1, EZ.out(pr(b, NATIVE_CUE("cue-099") + .2, NATIVE_CUE("cue-100") + .5))), py: b => lerp(y0, y1, EZ.out(pr(b, NATIVE_CUE("cue-101") + .2, NATIVE_CUE("cue-102") + .5))) });
      }
    }, true);
  };
  tFlash(NATIVE_CUE("cue-103"), .9, .22);
  SOURCE_S("S09.sound000",tRight - .2, 'whoosh', .5); SOURCE_S("S09.sound001",tRight + .3, 'typing', .3, .4, { d: 1.5 }); SOURCE_S("S09.sound002",tHeart, 'hit', .6); SOURCE_S("S09.sound003",tUpd - .1, 'counter', .4, .4, { d: 1.3 }); SOURCE_S("S09.sound004",tFlow, 'rise', .35);
  SOURCE_S("S09.sound005",tBut, 'powerdown', .4); SOURCE_S("S09.sound006",NATIVE_CUE("cue-104"), 'hit', 1); SOURCE_S("S09.sound007",tBye, 'hit', 1); SOURCE_S("S09.sound008",tEven, 'swoosh', .45); SOURCE_S("S09.sound009",tHard + .25, 'slash', .9); SOURCE_S("S09.sound010",tHard + .5, 'whoosh', .5);
})();


(() => {
if(!USER_INPUT.selected.includes("S10"))return;
window.CURRENT_UNIT="S10";

  const T0 = BR.D[1], T1 = O(103.02);
  const sc = SC(T0, T1, BG, '10 — 直达重点');
  const D = sc.el;
  const tNot = NATIVE_CUE("cue-105"), tCon = NATIVE_CUE("cue-106"), tSlow = NATIVE_CUE("cue-107"), tNo = NATIVE_CUE("cue-108"), tDet = NATIVE_CUE("cue-109"), tOne = NATIVE_CUE("cue-110"), tOneW = NATIVE_CUE("cue-111"), tMot = NATIVE_CUE("cue-112");
  TKF.push([T0 - .01, 'R', 0, false], [T0, 'R', 0, true], [tCon - .2, { x: 1500, y: 470, w: 520, h: 700, r: 4 }, .5, true], [tSlow - .1, 'R', .5, true]);
  const A = [180, 760], B = [1040, 300];
  
  const detour = svgPath(D, 'M180 760 C 260 560, 520 820, 470 600 S 220 380, 430 330 S 760 520, 700 300 S 940 120, 1040 300', 1200, 900, 'rgba(233,236,239,.45)', 4, { blur: 3, glow: 'rgba(233,236,239,.2)' });
  detour._p.forEach(p => p.setAttribute('stroke-dasharray', '10 12'));
  const dLab = mk(D, `<div style="${MONO(18, DIM, 4)}">${TEXT("S10.text001")}</div>`, 300, 860, { ax: 0, ay: .5 });
  const sA = mk(D, `<div style="width:26px;height:26px;border-radius:50%;background:${SILVER}"></div>`, A[0], A[1], { ax: .5, ay: .5 });
  const sB = motionFile(D, B[0], B[1] - 10, 150, { name: 'new.motion' });
  const straight = svgPath(D, `M${A[0]} ${A[1]} L${B[0]} ${B[1]}`, 1200, 900, GOLD, 7, { glow: GOLD, hi: true });
  const xMark = mk(D, `<div style="color:${RED}">${ICON('x', 150, 3)}</div>`, 520, 560, { ax: .5, ay: .5 });
  const con = mk(D, `<div style="display:flex;align-items:center;gap:30px">${lineIcon('trophy', 220, GOLD2, '245,185,46')}<div><div style="${MONO(20, GOLD, 6)}">${TEXT("S10.text002")}</div><div style="${HV(140, SILVER, 6)};${GOLDF}">${TEXT("S10.text003")}</div></div></div>`, 150, 470, { ax: 0, ay: .5 });
  const slow = mk(D, `<div style="${HV(66, SILVER, 4)}">${TEXT("S10.text004")} <span style="${GOLDF}">${TEXT("S10.text005")}</span></div>`, 150, 180, { ax: 0, ay: .5 });
  const one = mk(D, `<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start"><span style="${MONO(20, BLUE2, 6)}">${TEXT("S10.text006")}</span><span style="${HV(120, SILVER, 6)};${BLUEF}">${TEXT("S10.text007")}</span></div>`, 150, 190, { ax: 0, ay: .5 });
  const notYet = mk(D, `<div style="${HV(64, SILVER, 4)}">${TEXT("S10.text008")} <span style="color:${DIM}">${TEXT("S10.text009")}</span>？</div>`, 150, 180, { ax: 0, ay: .5 });
  sc.update = t => {
    
    const dp = EZ.inout(pr(t, tNot - .1, tNot + 2.6)), dOut = pr(t, tOneW + .6, T1 - .2);
    pathAt(detour, dp, (1 - dOut * .7) * pr(t, tNot - .2, tNot) * (t > tDet + .2 ? .35 : 1));
    show(dLab, t, tNot + .3, { k: 'up', d: .4, out: tCon - .2 });
    place(sA, { o: pr(t, tNot - .2, tNot), s: 1 + beatPulse(t) * .2 });
    show(notYet, t, tNot, { k: 'mask', d: .45, out: tCon - .25 });
    
    const cp = pr(t, tCon - .05, tCon + .3);
    place(con, { o: clamp(cp * 4) * (1 - pr(t, tSlow - .3, tSlow - .05)), s: .8 + .2 * EZ.spring(cp) });
    detour.style.opacity = t > tCon - .2 && t < tSlow - .1 ? .15 : '';
    
    show(slow, t, tSlow - .1, { k: 'mask', d: .45, out: tOne - .3 });
    const xp = pr(t, tDet - .05, tDet + .15);
    place(xMark, { o: clamp(xp * 5) * (1 - pr(t, tOne - .2, tOne)), s: 1 + (1 - EZ.out5(xp)) * 1.4, r: -8 });
    const sp = EZ.inout(pr(t, tNo - .1, tOneW + .1));
    const tip = pathAt(straight, sp, pr(t, tNo - .2, tNo));
    sc._tip = tip; sc._sp = sp;
    place(sB, { o: pr(t, tNot + .5, tNot + 1), s: (.85 + .15 * EZ.spring(pr(t, tNot + .5, tNot + 1.1))) * (1 + (sp >= 1 ? .12 * Math.sin(Math.PI * pr(t, tOneW + .1, tOneW + .5)) + beatPulse(t, true) * .04 : 0)) });
    show(one, t, tOneW - .05, { k: 'slam', d: .3, out: T1 - .25 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tOneW + .1, .3, 14); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx, sy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      if (sc._sp > 0 && sc._sp < 1) { glow(c, sc._tip[0], sc._tip[1], 46); sparks(c, t, NATIVE_CUE("cue-113") - .1, 0, 0, { rate: 90, n: 400, life: .55, col: '255,206,120', seed: 9, px: b => lerp(180, 1040, EZ.inout(pr(b, NATIVE_CUE("cue-114") - .1, NATIVE_CUE("cue-115") + .1))), py: b => lerp(760, 300, EZ.inout(pr(b, NATIVE_CUE("cue-116") - .1, NATIVE_CUE("cue-117") + .1))) }); }
      if (sc._sp >= 1) { const k = 1 - pr(t, NATIVE_CUE("cue-118") + .1, NATIVE_CUE("cue-119") + 1); if (k > 0) glow(c, 1040, 290, 220, '255,214,120', k * .7); }
      
      const t0 = NATIVE_CUE("cue-120") - .05;
      if (t > t0 && t < t0 + 2.2) for (let i = 0; i < 120; i++) {
        const age = t - t0 - hash(i * 1.3) * .2; if (age <= 0) continue;
        const side = i % 2 ? 1 : -1, a = -Math.PI / 2 + side * (.35 + hash(i * 2.7) * .5), v = 900 + hash(i * 4.1) * 900;
        const x = (side < 0 ? 120 : 1800) + Math.cos(a) * v * age * (side < 0 ? -1 : 1) * -1, y = 1080 + Math.sin(a) * v * age + 900 * age * age;
        c.save(); c.translate(x, y); c.rotate(age * (6 + hash(i) * 8)); c.globalAlpha = clamp(1 - (age - 1.4) / .8);
        c.fillStyle = [GOLD, BLUE2, SILVER, GOLD2][i % 4]; c.fillRect(-7, -3.5, 14 * Math.abs(Math.cos(age * 9 + i)), 7); c.restore();
      }
    }, true);
  };
  SOURCE_S("S10.sound000",tNot, 'swoosh', .4); SOURCE_S("S10.sound001",tNot + .2, 'write', .35, 0, { d: 2 }); SOURCE_S("S10.sound002",tCon, 'achieve', .7); SOURCE_S("S10.sound003",tCon + .05, 'pop', .5, -.6); SOURCE_S("S10.sound004",tCon + .1, 'pop', .5, .6);
  SOURCE_S("S10.sound005",tDet - .05, 'slash', .8); SOURCE_S("S10.sound006",tNo - .1, 'rise', .45); SOURCE_S("S10.sound007",tOneW + .1, 'hit', .9); SOURCE_S("S10.sound008",tOneW + .15, 'shine', .5);
})();


(() => {
if(!USER_INPUT.selected.includes("S11"))return;
window.CURRENT_UNIT="S11";

  const T0 = O(103.02), T1 = O(113.05);
  const sc = SC(T0, T1, BG, '11 — 循环');
  const D = sc.el;
  const tCyc = NATIVE_CUE("cue-121"), tMake = NATIVE_CUE("cue-122"), tShare = NATIVE_CUE("cue-123"), tSell = NATIVE_CUE("cue-124"), tForm = NATIVE_CUE("cue-125"), tGood = NATIVE_CUE("cue-126");
  TKF.push([T0, 'R', .5, true]);
  const CX = 680, CY = 500, R = 290;
  const NODES = [[RAW_TEXT("S11.text001"), 'tool', tMake], [RAW_TEXT("S11.text002"), 'share', tShare], [RAW_TEXT("S11.text003"), 'tag', tSell], [RAW_TEXT("S11.text004"), 'users', tForm]];
  const ring = mk(D, `<svg width="${R * 2 + 200}" height="${R * 2 + 200}" viewBox="${-R - 100} ${-R - 100} ${R * 2 + 200} ${R * 2 + 200}" style="overflow:visible">
      <circle r="${R}" fill="none" stroke="rgba(233,236,239,.14)" stroke-width="18"/>
      <circle class="rp" r="${R}" fill="none" stroke="url(#rg)" stroke-width="6" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="${(2 * Math.PI * R).toFixed(1)} ${(2 * Math.PI * R).toFixed(1)}"/>
      <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BLUE}"/><stop offset="1" stop-color="${GOLD}"/></linearGradient></defs>
      ${Array.from({ length: 72 }, (_, i) => { const a = i / 72 * 6.2832, l = i % 6 ? 8 : 18; return `<line x1="${(Math.cos(a) * (R + 22)).toFixed(1)}" y1="${(Math.sin(a) * (R + 22)).toFixed(1)}" x2="${(Math.cos(a) * (R + 22 + l)).toFixed(1)}" y2="${(Math.sin(a) * (R + 22 + l)).toFixed(1)}" stroke="rgba(233,236,239,.3)" stroke-width="1.5"/>`; }).join('')}</svg>`, CX, CY, { ax: .5, ay: .5 });
  const rp = ring.querySelector('.rp'), CIRC = 2 * Math.PI * R;
  const nodes = NODES.map(([n, ic], i) => {
    const a = -Math.PI / 2 + i * Math.PI / 2;
    return mk(D, `<div style="display:flex;flex-direction:column;align-items:center;gap:10px"><div class="nb" style="width:120px;height:120px;border-radius:50%;background:#14171c;border:2px solid rgba(233,236,239,.25);display:flex;align-items:center;justify-content:center;color:${SILVER}">${ICON(ic, 54, 1.8)}</div><div style="${HV(36, SILVER, 2)}">${TEXT_GLOBAL(n)}</div><div style="${MONO(13, DIM, 3)}">${TEXT("S11.text005")}${i + 1}</div></div>`,
      CX + Math.cos(a) * R, CY + Math.sin(a) * R + 30, { ax: .5, ay: .5 });
  });
  const thumb = vcard(D, 260, 146, { r: 8, badge: '.motion' }); vthumb(thumb, 596, 2);
  const price = mk(D, `<div style="display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:10px;background:${GOLD};${MONO(18, '#0A0B0D', 2)}">${ICON('tag', 22, 2, '#0A0B0D')} ${TEXT("S11.text006")}</div>`, 0, 0, { ax: .5, ay: .5 });
  const center = mk(D, `<div style="text-align:center"><div style="${MONO(16, DIM, 5)}">${TEXT("S11.text007")}</div><div style="${HV(76, SILVER, 4)};${METAL};margin-top:6px">${TEXT("S11.text008")}</div></div>`, CX, CY, { ax: .5, ay: .5 });
  const side = mk(D, `<div style="display:flex;flex-direction:column;gap:18px;width:420px">
      <div style="${MONO(18, BLUE2, 5)}">${TEXT("S11.text009")}</div>
      <div style="${ZH(30, SILVER, 600)};line-height:1.6">${TEXT("S11.text010")}<br>${TEXT("S11.text011")}<br>${TEXT("S11.text012")}</div></div>`, 1080, 300, { ax: 0, ay: .5 });
  side.style.display = 'none';
  sc.update = t => {
    const rin = pr(t, T0, tCyc + .2);
    place(ring, { o: clamp(rin * 3), s: .9 + .1 * EZ.out(rin), r: (t - T0) * 4 });
    
    const speed = 1 + 3 * EZ.in(pr(t, tForm - .2, tGood));
    const prog = EZ.inout(pr(t, tCyc - .3, tCyc + .9));
    rp.style.strokeDashoffset = (CIRC * (1 - prog)).toFixed(1);
    sc._ang = -Math.PI / 2 + (t - T0) * 1.1 * speed + Math.max(0, t - tForm) * 3 * speed;
    nodes.forEach((n, i) => {
      const t0 = NODES[i][2];
      const pin = pr(t, tCyc + i * .12, tCyc + .4 + i * .12);
      const on = t >= t0 - .05;
      place(n, { o: clamp(pin * 3), s: (.7 + .3 * EZ.spring(pin)) * (on ? 1 + Math.sin(Math.PI * pr(t, t0 - .05, t0 + .35)) * .15 : 1) });
      const nb = n.querySelector('.nb'); nb.style.borderColor = on ? (i === 2 ? GOLD : BLUE2) : 'rgba(233,236,239,.25)'; nb.style.color = on ? (i === 2 ? GOLD : BLUE2) : SILVER;
      nb.style.boxShadow = on ? `0 0 ${(24 + beatPulse(t) * 20).toFixed(0)}px rgba(${i === 2 ? '245,185,46' : '47,123,255'},.45)` : 'none';
    });
    place(thumb, { x: CX + 300, y: CY - R + 10, o: pr(t, tMake, tMake + .3) * (1 - pr(t, tForm - .3, tForm)), s: .8 + .2 * EZ.spring(pr(t, tMake, tMake + .5)), r: 4 });
    place(price, { x: CX - 230, y: CY + R + 100, o: pr(t, tSell + .1, tSell + .35) * (1 - pr(t, tForm - .3, tForm)), s: .8 + .2 * EZ.spring(pr(t, tSell + .1, tSell + .6)) });
    const cp = pr(t, tGood - .05, tGood + .25);
    place(center, { o: clamp(pr(t, tCyc, tCyc + .4) * 3), s: 1 + (t > tGood - .05 ? (1 - EZ.out5(cp)) * .5 : 0) + beatPulse(t, true) * .02 });
    show(side, t, tMake - .2, { k: 'right', d: .45, out: tForm - .2 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, NATIVE_CUE("cue-127"), .3, 12); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx, sy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      const o = pr(t, NATIVE_CUE("cue-128"), NATIVE_CUE("cue-129") + .5); if (o <= 0) return;
      for (let k = 0; k < 3; k++) { const a = sc._ang - k * .09; glow(c, CX + Math.cos(a) * R, CY + Math.sin(a) * R, 34 - k * 8, '255,214,120', o * (1 - k * .3)); }
    });
  };
  SOURCE_S("S11.sound000",tCyc, 'swoosh', .5); SOURCE_S("S11.sound001",tMake, 'pop', .5, -.2); SOURCE_S("S11.sound002",tShare, 'pop', .5, .3); SOURCE_S("S11.sound003",tSell, 'coin', .6, -.3); SOURCE_S("S11.sound004",tForm - .2, 'rise', .45); SOURCE_S("S11.sound005",tGood, 'hit', .8);
})();
