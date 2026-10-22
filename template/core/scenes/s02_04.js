


(() => {
if(!USER_INPUT.selected.includes("S02"))return;
window.CURRENT_UNIT="S02";

  const T0 = O(8.20), T1 = O(16.75);
  const sc = SC(T0, T1, BG, '02 — 案例');
  const D = sc.el;
  const tDay = NATIVE_CUE("cue-012"), tOpen = NATIVE_CUE("cue-013"), tSkill = NATIVE_CUE("cue-014"), tFill = NATIVE_CUE("cue-015"), tCn = NATIVE_CUE("cue-016"), tVid = NATIVE_CUE("cue-017"), tGap = NATIVE_CUE("cue-018"),
    tHelp = NATIVE_CUE("cue-019"), tK = NATIVE_CUE("cue-020"), tEff = NATIVE_CUE("cue-021"), tTalk = NATIVE_CUE("cue-022");
  TKF.push([T0, 'L', .6, true]);
  const X = 860;
  
  const OWN = [['own_next', RAW_TEXT("S02.text001")], ['own_end', RAW_TEXT("S02.text002")], ['own_mac', RAW_TEXT("S02.text003")], ['own_hud', RAW_TEXT("S02.text004")], ['own_db', RAW_TEXT("S02.text005")], ['own_dev', RAW_TEXT("S02.text006")]];
  const stage = mk(D, `<div style="position:absolute;left:0;top:0;width:${USER_INPUT.layout==='portrait'?1080:1920}px;height:${USER_INPUT.layout==='portrait'?1920:1080}px;perspective:1600px;perspective-origin:${USER_INPUT.layout==='portrait'?540:1330}px ${USER_INPUT.layout==='portrait'?750:470}px"><div class="rg" style="position:absolute;left:${USER_INPUT.layout==='portrait'?540:1330}px;top:${USER_INPUT.layout==='portrait'?750:500}px;transform-style:preserve-3d"></div></div>`, 0, 0);
  const RG = stage.querySelector('.rg');
  const tiles = OWN.map(([dir, name], i) => {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:0;top:0;width:400px;height:225px;margin:-112px 0 0 -200px;transform-style:preserve-3d;backface-visibility:hidden';
    d.innerHTML = `<div style="position:absolute;inset:0;border-radius:10px;overflow:hidden;outline:1px solid rgba(233,236,239,.25);box-shadow:0 20px 60px rgba(0,0,0,.6)"><img style="width:100%;height:100%;object-fit:cover;display:block"></div>
      <div style="position:absolute;left:0;top:236px;${MONO(14, SILVER, 2)};text-transform:none;white-space:nowrap"><span style="color:${GOLD}">●</span> ${TEXT_GLOBAL(name)}</div>`;
    RG.appendChild(d); return { el: d, img: d.querySelector('img'), dir };
  });
  const stLab = mk(D, `<div style="display:flex;align-items:center;gap:12px"><span style="padding:4px 12px;border-radius:5px;border:1.5px solid ${GOLD};${MONO(15, GOLD, 3)}">${TEXT("S02.text007")}</span><span style="${MONO(15, DIM, 3)}">${TEXT("S02.text008")}</span></div>`, X, 860, { ax: 0, ay: .5 });
  
  const repo = mk(D, `<div class="glass" style="width:820px;border-radius:18px;padding:28px 34px">
      <div style="display:flex;align-items:center;gap:16px;color:${SILVER}">${ICON('code', 32, 1.8)}<span style="font:600 32px 'Geist Mono';color:${BLUE2}">${TEXT("S02.text009")}</span><span style="font:400 32px 'Geist Mono';color:${DIM}">/</span><span class="rn" style="font:700 32px 'Geist Mono';color:${SILVER}"></span>
        <span style="margin-left:6px;padding:3px 12px;border-radius:20px;border:1.5px solid rgba(233,236,239,.3);${MONO(14, DIM, 2)}">${TEXT("S02.text010")}</span></div>
      <div style="${ZH(24, 'rgba(233,236,239,.72)', 500)};margin-top:14px">${TEXT("S02.text011")}</div>
      <div style="display:flex;gap:18px;align-items:center;margin-top:20px"><span class="hot" style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:30px;background:linear-gradient(90deg,#FF6A3D,#F5B92E);font:700 20px 'Geist Mono';color:#120804;letter-spacing:2px">${TEXT("S02.text012")}</span><span style="${MONO(16, DIM, 2)}">${TEXT("S02.text013")}</span><span style="${MONO(16, DIM, 2)}">${TEXT("S02.text014")}</span><span style="${MONO(16, DIM, 2)}">${TEXT("S02.text015")}</span></div></div>`, X, 220, { ax: 0, ay: .5 });
  const rn = repo.querySelector('.rn'), hot = repo.querySelector('.hot');
  const os = seal(D, TEXT("S02.text016"), X + 700, 120, GOLD, 64, -8, RAW_TEXT("S02.text017"));
  
  const CAP = [RAW_TEXT("S02.text018"), RAW_TEXT("S02.text019"), RAW_TEXT("S02.text020"), RAW_TEXT("S02.text021")];
  const row = (name, full) => `<div style="display:flex;align-items:center;gap:22px;margin-bottom:22px"><div style="width:170px;${ZH(28, SILVER, 600)}">${TEXT_GLOBAL(name)}</div>
      ${CAP.map((c, i) => `<div class="cp ${!full && i === 3 ? 'gap' : ''}" style="position:relative;width:150px;height:62px;border-radius:10px;${!full && i === 3 ? `border:2px dashed ${RED};background:rgba(255,77,61,.06)` : `background:${full ? 'rgba(125,178,255,.18)' : 'rgba(233,236,239,.1)'};border:1.5px solid rgba(233,236,239,.15)`};display:flex;align-items:center;justify-content:center;${ZH(22, !full && i === 3 ? RED : SILVER, 600)}">${TEXT_GLOBAL(c)}${!full && i === 3 ? ' ✕' : ''}</div>`).join('')}</div>`;
  const caps = mk(D, `<div>${row(RAW_TEXT("S02.text022"), true)}${row(RAW_TEXT("S02.text023"), false)}</div>`, X, 640, { ax: 0, ay: .5 });
  const gapEl = caps.querySelector('.gap');
  const patch = mk(D, `<div style="width:150px;height:62px;border-radius:10px;background:linear-gradient(180deg,${GOLD2},${GOLD});display:flex;align-items:center;justify-content:center;${MONO(20, '#0A0B0D', 3)};font-weight:700;box-shadow:0 0 30px rgba(245,185,46,.5)">${TEXT("S02.text024")}</div>`, 0, 0, { ax: .5, ay: .5 });
  const gapT = mk(D, `<div style="${HV(56, SILVER, 2)}">${TEXT("S02.text025")}<span style="${GOLDF}">${TEXT("S02.text026")}</span></div>`, X, 470, { ax: 0, ay: .5 });
  
  const CM = [0, 3, 6, 1, 8, 4, 9, 2, 7, 5];
  const cmts = CM.map((k, i) => mk(D, `<div style="width:${[620, 560, 600, 540, 580, 600, 520, 560, 600, 540][i]}px;border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.6);outline:1px solid rgba(233,236,239,.15)"><img src="${USER_INPUT.media.feedback[k].file}" style="width:100%;display:block"></div>`, 0, 0, { ax: .5, ay: .5 }));
  const CPOS = [[1090, 300, -3], [1540, 360, 4], [1150, 500, 2], [1600, 580, -4], [1070, 720, -2], [1500, 790, 3], [1300, 260, 5], [1660, 450, -2], [1130, 620, 4], [1470, 690, -5]];
  const kNum = flipNum(D, RAW_TEXT("S02.text027"), 1560, 150, 96, GOLDF);
  const kLab = mk(D, `<div style="display:flex;flex-direction:column;gap:6px"><span style="${HV(48, SILVER, 2)}">${TEXT("S02.text028")}<span style="${GOLDF}">${TEXT("S02.text029")}</span></span><span style="${MONO(15, DIM, 4)}">${TEXT("S02.text030")}</span></div>`, 860, 150, { ax: 0, ay: .5 });
  sc.update = t => {
    
    const stIn = pr(t, tSkill - .2, tSkill + .5), stOut = pr(t, tCn - .45, tCn - .1);
    place(stage, { o: clamp(stIn * 2) * (1 - stOut) });
    const rot = (t - tSkill) * 34;
    tiles.forEach((tl, i) => {
      const a = i / tiles.length * 360 + rot, ar = a * Math.PI / 180, z = Math.cos(ar);
      tl.el.style.transform = `rotateY(${a.toFixed(2)}deg) translateZ(430px)`;
      tl.el.style.opacity = (stIn > 0 ? clamp((z + .35) * 2) : 0).toFixed(2);
      tl.el.style.filter = `brightness(${(.45 + .55 * clamp(z)).toFixed(2)})`;
      if (z > -.3 && stIn > 0 && stOut < 1) setFrame(tl.img, seqAt(tl.dir, 120, 30, t, tSkill - i * .5));
    });
    RG.style.transform = `rotateX(-8deg) scale(${(.85 + .15 * EZ.out(stIn)).toFixed(3)})`;
    show(stLab, t, tSkill + .2, { k: 'up', d: .4, out: tCn - .45 });
    
    const gone = pr(t, tCn - .45, tCn - .1);
    show(repo, t, tDay - .1, { k: 'up', d: .5, o: 1 - gone });
    typeAt(rn, RAW_TEXT("S02.text031"), t, tDay + .15, 28);
    const hp = pr(t, tOpen + .2, tOpen + .45); hot.style.transform = `scale(${(hp > 0 ? .6 + .4 * EZ.spring(hp) : 0).toFixed(3)})`; hot.style.boxShadow = `0 0 ${(14 + beatPulse(t) * 24).toFixed(0)}px rgba(255,120,60,.55)`;
    sealAt(os, t, tOpen + .05, tCn - .45);
    
    const cin = pr(t, tCn - .3, tCn + .1), gone2 = pr(t, tHelp - .35, tHelp - .1);
    place(caps, { o: clamp(cin * 3) * (1 - gone2), y: 600 + (1 - EZ.out(cin)) * 40 });
    gapEl.style.opacity = t < tGap ? (Math.floor(t * 3) % 2 ? .6 : 1) : 1;
    const px = X + 170 + 22 + 3 * 172 + 75, py = 600 + 42 + 4, pp = pr(t, tGap - .05, tGap + .3);
    place(patch, { x: px, y: lerp(py - 260, py, EZ.out5(pp)), o: pp > 0 ? (1 - gone2) : 0, s: 1 + (1 - EZ.out5(pp)) * .4, r: (1 - pp) * -10 });
    show(gapT, t, tCn - .25, { k: 'mask', d: .45, out: tHelp - .35, y: 430 });
    
    cmts.forEach((c, i) => {
      const t0 = tHelp - .15 + i * .19, k = pr(t, t0, t0 + .32), [x, y, r] = CPOS[i];
      place(c, { x: x + (1 - EZ.out5(k)) * 700, y: y + (1 - EZ.out5(k)) * (i % 2 ? -80 : 80), r: r + (1 - k) * 12, o: clamp(k * 4), s: (.66 + .1 * EZ.spring(k)) * (1 + beatPulse(t, true) * .01) });
      c.style.zIndex = 10 + i;
    });
    flipAt(kNum, t, tK - .1, 1.0, { o: pr(t, tK - .15, tK) });
    show(kLab, t, tHelp - .2, { k: 'mask', d: .4 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tOpen + .05, .3, 12), [gx, gy] = shake(t, tGap + .25, .25, 10); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx: sx + gx, sy: sy + gy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      if (t >= tGap + .2 && t < tGap + 1) sparks(c, t, tGap + .25, X + 170 + 22 + 3 * 172 + 75, 646, { n: 50, life: .7, dir: -Math.PI / 2, spread: 3.4, speed: 800, g: 1200, col: '255,214,120', seed: 2 });
      if (t > tSkill - .2 && t < tCn) glow(c, 1340, 470, 520, '60,100,200', .25 * pr(t, tSkill - .2, tSkill + .5) * (1 - pr(t, tCn - .45, tCn - .1)));
    });
  };
  SOURCE_S("S02.sound000",tDay - .1, 'card', .5); SOURCE_S("S02.sound001",tDay + .15, 'typing', .4, .3, { d: .6 }); SOURCE_S("S02.sound002",tOpen + .05, 'stamp', .9); SOURCE_S("S02.sound003",tOpen + .25, 'pop', .5, .4);
  SOURCE_S("S02.sound004",tSkill - .2, 'whoosh', .5, .5); SOURCE_S("S02.sound005",tCn - .3, 'swoosh', .45); SOURCE_S("S02.sound006",tGap - .05, 'whoosh', .4); SOURCE_S("S02.sound007",tGap + .25, 'thud', .8); SOURCE_S("S02.sound008",tGap + .27, 'shine', .5);
  CM.forEach((_, i) => SOURCE_S("S02.sound009",tHelp - .15 + i * .19, i % 2 ? 'card' : 'swipe', .35, .3 + (i % 3) * .2)); SOURCE_S("S02.sound010",tK - .1, 'tick_run', .35, -.5, { d: .9 });
})();


(() => {
if(!USER_INPUT.selected.includes("S03"))return;
window.CURRENT_UNIT="S03";

  const T0 = O(16.75), T1 = O(24.78);
  const sc = SC(T0, T1, BG, '03 — 打磨');
  const D = sc.el;
  const tPol = NATIVE_CUE("cue-023"), tTop = NATIVE_CUE("cue-024"), tStd = NATIVE_CUE("cue-025"), tNew = NATIVE_CUE("cue-026"), tThx = NATIVE_CUE("cue-027"), tFew = NATIVE_CUE("cue-028"), tFan = NATIVE_CUE("cue-029");
  TKF.push([T0, 'R', .55, true], [tThx - .2, { x: 1610, y: 300, w: 340, h: 460, r: 4 }, .55, true]);
  
  const PD = 'M0 520 L360 520 Q420 520 450 470 L600 210 Q630 160 690 160 L1010 160';
  const pipe = svgPath(D, PD, 1100, 600, '#cfd6df', 14, { hi: true, glow: '#8fa5c2', blur: 8, x: 110, y: 230 });
  const d1 = dimLine(D, 110, 810, 470, 810, TEXT("S03.text001"), DIM);
  const d2 = dimLine(D, 470, 760, 470, 480, TEXT("S03.text002"), GOLD, { lc: GOLD });
  const d3 = dimLine(D, 800, 330, 1120, 330, TEXT("S03.text003"), DIM);
  const d4 = dimLine(D, 1130, 200, 1130, 380, TEXT("S03.text004"), DIM);
  const pol = mk(D, `<div style="${HV(120, SILVER, 6)};${METAL}">${TEXT("S03.text005")}</div>`, 140, 200, { ax: 0, ay: .5 });
  const topW = glitchText(D, TEXT("S03.text006"), 880, 620, `${HV(150, GOLD, 8)};${GOLDF}`);
  const stdW = mk(D, `<div style="${MONO(22, GOLD, 8)}">${TEXT("S03.text007")}</div>`, 880, 740, { ax: .5, ay: .5 });
  
  const fanBox = mk(D, `<div style="width:1000px;height:420px;border-radius:22px;background:rgba(5,6,8,.92);border:1px solid rgba(233,236,239,.12)"></div>`, 760, 500, { ax: .5, ay: .5 });
  const fanN = flipNum(D, RAW_TEXT("S03.text008"), 760, 440, 210, METAL);
  const fanL = mk(D, `<div style="width:780px"><div style="height:8px;border-radius:4px;background:#1d2128;overflow:hidden"><div class="ff" style="height:100%;width:0;background:linear-gradient(90deg,${BLUE},${BLUE2})"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:14px;${MONO(18, DIM, 4)}"><span style="color:${BLUE2}">${TEXT("S03.text009")}</span><span>${TEXT("S03.text010")}</span></div></div>`, 760, 620, { ax: .5, ay: .5 });
  const ff = fanL.querySelector('.ff');
  const thx = mk(D, `<div style="${HV(64, SILVER, 4)}">${TEXT("S03.text011")}<span style="${BLUEF}">${TEXT("S03.text012")}</span></div>`, 760, 200, { ax: .5, ay: .5 });
  sc.update = t => {
    const outA = pr(t, tThx - .35, tThx - .05);
    const p = EZ.inout(pr(t, tPol - .4, tNew + .3));
    const tip = pathAt(pipe, p, 1 - outA);
    sc._tip = tip; sc._p = p;
    dimAt(d1, t, tPol + .1, { out: tThx - .35 }); dimAt(d2, t, tTop, { out: tThx - .35 }); dimAt(d3, t, tStd, { out: tThx - .35 }); dimAt(d4, t, tNew - .1, { out: tThx - .35 });
    show(pol, t, tPol - .3, { k: 'mask', d: .45, out: tThx - .35 });
    glitchAt(topW, t, tTop - .02, { out: tThx - .35, pulse: beatPulse(t, true) * .15 });
    show(stdW, t, tStd, { k: 'up', d: .4, out: tThx - .35 });
    
    const fin = pr(t, tThx - .1, tThx + .3);
    place(fanBox, { o: clamp(fin * 3) * .95, s: .92 + .08 * EZ.out(fin) });
    flipAt(fanN, t, tFew, 1.3, { o: pr(t, tFew - .1, tFew + .05) });
    show(fanL, t, tFew + .1, { k: 'up', d: .4 });
    ff.style.width = (EZ.out(pr(t, tFew + .1, tFan + .1)) * 100).toFixed(1) + '%';
    show(thx, t, tThx - .1, { k: 'mask', d: .45 });
    if (t > tFan + .1) place(fanN, { s: 1 + Math.sin(Math.PI * pr(t, tFan + .1, tFan + .4)) * .06 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tTop, .3, 14), [fx, fy] = shake(t, tFan + .1, .3, 12); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx: sx + fx, sy: sy + fy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      if (sc._p > 0 && sc._p < 1 && t < tThx - .1) { glow(c, sc._tip[0], sc._tip[1], 70, '255,214,140'); sparks(c, t, tPol - .4, 0, 0, { rate: 110, n: 600, life: .6, col: '255,206,120', seed: 5, px: b => { const q = pipe._path.getPointAtLength(pipe._len * EZ.inout(pr(b, tPol - .4, tNew + .3))); return pipe._x + q.x; }, py: b => { const q = pipe._path.getPointAtLength(pipe._len * EZ.inout(pr(b, tPol - .4, tNew + .3))); return pipe._y + q.y; } }); }
      const hk = pr(t, tThx - .2, tThx + .6);
      if (hk > 0) { halftone(c, t, 760, 500, hk, .55 * (1 + beatPulse(t, true) * .4)); stars(c, t, 90, hk * .7, 7); }
    });
  };
  SOURCE_S("S03.sound000",tPol - .4, 'write', .4, -.4, { d: 2.2 }); SOURCE_S("S03.sound001",tPol - .3, 'swoosh', .45); SOURCE_S("S03.sound002",tTop, 'glitch', .6); SOURCE_S("S03.sound003",tTop + .02, 'hit', .8); SOURCE_S("S03.sound004",tStd, 'tick', .4); SOURCE_S("S03.sound005",tNew - .1, 'tick', .4);
  SOURCE_S("S03.sound006",tThx - .2, 'whoosh', .5); SOURCE_S("S03.sound007",tFew, 'counter', .45, 0, { d: 1.3 }); SOURCE_S("S03.sound008",tFan + .1, 'hit', .8); SOURCE_S("S03.sound009",tFan + .12, 'achieve', .5);
})();


(() => {
if(!USER_INPUT.selected.includes("S04"))return;
window.CURRENT_UNIT="S04";

  const T0 = O(24.78), T1 = NATIVE_CUE("cue-030");
  const sc = SC(T0, T1, BG, '04 — 重磅');
  const D = sc.el;
  const tBut = NATIVE_CUE("cue-031"), tBig = NATIVE_CUE("cue-032"), tFew = NATIVE_CUE("cue-033"), tSV = NATIVE_CUE("cue-034"), tCall = NATIVE_CUE("cue-035"), tGH = NATIVE_CUE("cue-036"), tSaw = NATIVE_CUE("cue-037"), tInv = NATIVE_CUE("cue-038"), tCo = NATIVE_CUE("cue-039"), tNew = NATIVE_CUE("cue-040"), tFmt = NATIVE_CUE("cue-041");
  TKF.push([T0, 'R', .5, true], [tBig - .25, 'TR', .45, true], [tInv - .3, { x: 1640, y: 760, w: 260, h: 260, r: 130 }, .55, true], [T1 - .45, { x: 960, y: 500, w: 60, h: 60, r: 30 }, .4, true], [T1 - .05, { x: 960, y: 500, w: 40, h: 40, r: 20 }, 0, false]);
  
  const big = glitchText(D, TEXT("S04.text001"), 860, 470, `${HV(230, SILVER, 10)};${METAL}`);
  const bTag = mk(D, `<div style="${MONO(24, RED, 10)}">${TEXT("S04.text002")}</div>`, 860, 260, { ax: .5, ay: .5 });
  
  const svLab = mk(D, `<div style="display:flex;flex-direction:column;gap:8px"><span style="${MONO(18, GOLD, 5)}">${TEXT("S04.text003")}</span><span style="${HV(64, SILVER, 4)}">${TEXT("S04.text004")}<span style="${GOLDF}">${TEXT("S04.text005")}</span>${TEXT("S04.text006")}</span><span style="${MONO(16, DIM, 3)}">${TEXT("S04.text007")}</span></div>`, 150, 300, { ax: 0, ay: .5 });
  
  const note = mk(D, `<div class="glass" style="width:620px;border-radius:20px;padding:22px 26px">
      <div style="display:flex;align-items:center;gap:12px;${MONO(15, DIM, 2)}"><span style="color:${SILVER}">${ICON('mail', 22, 2)}</span>${TEXT("S04.text008")}<span style="margin-left:auto">${TEXT("S04.text009")}</span></div>
      <div style="${ZH(30, SILVER, 600)};margin-top:12px">${TEXT("S04.text010")} <span style="font-family:'Geist Mono';color:${BLUE2}">${TEXT("S04.text011")}</span> 👀”</div>
      <div style="${ZH(22, DIM, 500)};margin-top:8px">${TEXT("S04.text012")}</div></div>`, 1180, 220, { ax: .5, ay: .5 });
  
  const co = mk(D, `<div style="${HV(76, SILVER, 4)}">${TEXT("S04.text013")} <span style="${BLUEF}">${TEXT("S04.text014")}</span></div>`, 960, 200, { ax: .5, ay: .5 });
  const frame = mk(D, `<svg width="300" height="380" viewBox="-4 -4 108 136" style="overflow:visible"><path class="fp" d="M6 2h62l30 30v90a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" fill="rgba(47,123,255,.05)" stroke="${BLUE2}" stroke-width="1.2" stroke-dasharray="4 4"/><path d="M68 2v26a4 4 0 0 0 4 4h26" fill="none" stroke="${BLUE2}" stroke-width="1.2" stroke-dasharray="4 4"/>
      <text x="50" y="76" text-anchor="middle" fill="${BLUE2}" style="font:600 18px 'Geist Mono'">?</text></svg>`, 960, 540, { ax: .5, ay: .5 });
  const fmtL = mk(D, `<div style="${MONO(20, DIM, 8)}">${TEXT("S04.text015")}</div>`, 960, 790, { ax: .5, ay: .5 });
  sc.update = t => {
    const bp = pr(t, tBig - .02, tBig + .2);
    glitchAt(big, t, tBig - .02, { out: tFew - .3, s: 1 + (1 - EZ.out5(bp)) * .5 });
    show(bTag, t, tBut - .1, { k: 'blur', d: .45, out: tFew - .3 });
    show(svLab, t, tSV - .2, { k: 'mask', d: .45, out: tInv - .35 });
    const np = pr(t, tGH - .1, tGH + .4);
    place(note, { o: clamp(np * 3) * (1 - pr(t, tInv - .35, tInv - .1)), x: 1180 + (1 - EZ.out(np)) * 120, s: .95 + .05 * EZ.spring(np) });
    show(co, t, tCo - .1, { k: 'mask', d: .45, out: T1 - .3 });
    const fp = pr(t, tNew - .3, tNew + .2);
    place(frame, { o: clamp(fp * 3) * (1 - pr(t, T1 - .25, T1 - .02)), s: (.85 + .15 * EZ.out(fp)) * (1 + Math.max(0, t - tFmt) * .04), r: Math.sin(t * 1.5) * 1.5 });
    show(fmtL, t, tFmt - .05, { k: 'up', d: .4, out: T1 - .25 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, tBig, .4, 22); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006 + (t > tFmt ? .04 * pr(t, tFmt, T1) : 0), sx, sy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      
      const gi = pr(t, tFew - .4, tFew + .3), go = 1 - pr(t, tInv - .4, tInv);
      if (gi > 0 && go > 0) {
        globeDraw(c, t, { cx: 1120, cy: 630 + (1 - EZ.out(gi)) * 300, R: 270, rot: -2.2 + (t - tFew) * .22, tilt: -.38, o: gi * go,
          arcs: [[-122.1, 37.4, 116.4, 39.9, EZ.inout(pr(t, tCall - .2, tGH)), GOLD]],
          pins: [[-122.1, 37.4, 'SV', GOLD, pr(t, tSV - .1, tSV + .1)], [116.4, 39.9, 'CN', BLUE2, pr(t, tGH - .1, tGH + .1)]] });
      }
      
      const m = EZ.inout(pr(t, tInv - .1, tCo + .3));
      if (t > tInv - .1 && t < tNew) {
        glow(c, lerp(300, 960, m), lerp(540, 540, m), 40, '255,214,120'); glow(c, lerp(1620, 960, m), lerp(540, 540, m), 40, '125,178,255');
        c.strokeStyle = 'rgba(233,236,239,.25)'; c.setLineDash([6, 8]); c.beginPath(); c.moveTo(300, 540); c.lineTo(1620, 540); c.stroke(); c.setLineDash([]);
      }
      if (t >= tCo + .3 && t < tCo + 1.2) glow(c, 960, 540, 220, '170,200,255', 1 - pr(t, tCo + .3, tCo + 1.2));
      
      const q = pr(t, tFmt, T1);
      if (q > 0) { c.strokeStyle = `rgba(125,178,255,${(.5 * q).toFixed(3)})`; c.lineWidth = 2; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(960, 540, 260 + k * 46, t * (1 + k * .5), t * (1 + k * .5) + 1.4 + k * .3); c.stroke(); } }
    });
  };
  SOURCE_S("S04.sound000",tBut - .1, 'swoosh', .4); SOURCE_S("S04.sound001",tBig, 'glitch', .7); SOURCE_S("S04.sound002",tBig + .02, 'hit', 1); SOURCE_S("S04.sound003",tFew - .3, 'whoosh', .45); SOURCE_S("S04.sound004",tSV, 'ding', .45); SOURCE_S("S04.sound005",tCall - .2, 'rise', .35);
  SOURCE_S("S04.sound006",tGH, 'notif', .6); SOURCE_S("S04.sound007",tInv - .1, 'swoosh', .4); SOURCE_S("S04.sound008",tCo + .3, 'shine', .5); SOURCE_S("S04.sound009",tNew - .3, 'pop', .4);
})();
