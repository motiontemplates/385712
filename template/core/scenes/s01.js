
(() => {
if(!USER_INPUT.selected.includes("S01"))return;
window.CURRENT_UNIT="S01";

  const T0 = 0, T1 = O(8.20);
  const sc = SC(T0, T1, BG, '01 — 开场', { gridOpt: { a: .03 } });
  const D = sc.el;
  const sky = mk(D, `<div style="width:${USER_INPUT.layout==='portrait'?1080:1920}px;height:${USER_INPUT.layout==='portrait'?1920:1080}px;background:radial-gradient(ellipse 90% 80% at 50% 45%,#141a3a 0%,#080b1c 55%,#04050b 100%)"></div>`, 0, 0);
  D.insertBefore(sky, D.firstChild);
  
  const IDS = [605, 607, 609, 611, 613, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 615, 616, 617, 618, 619, 620, 621, 622];
  const NAME = { 605: RAW_TEXT("S01.text001"), 607: RAW_TEXT("S01.text002"), 609: RAW_TEXT("S01.text003"), 611: RAW_TEXT("S01.text004"), 613: RAW_TEXT("S01.text005"), 585: RAW_TEXT("S01.text006"), 586: RAW_TEXT("S01.text007"), 587: RAW_TEXT("S01.text008"), 588: RAW_TEXT("S01.text009"), 589: RAW_TEXT("S01.text010"), 590: RAW_TEXT("S01.text011"), 591: RAW_TEXT("S01.text012"), 592: RAW_TEXT("S01.text013"), 593: RAW_TEXT("S01.text014"), 594: RAW_TEXT("S01.text015"), 595: RAW_TEXT("S01.text016"), 596: RAW_TEXT("S01.text017"), 597: RAW_TEXT("S01.text018"), 598: RAW_TEXT("S01.text019"), 599: RAW_TEXT("S01.text020"), 600: RAW_TEXT("S01.text021"), 601: RAW_TEXT("S01.text022"), 602: RAW_TEXT("S01.text023"), 603: RAW_TEXT("S01.text024"), 604: RAW_TEXT("S01.text025"), 615: RAW_TEXT("S01.text026"), 616: RAW_TEXT("S01.text027"), 617: RAW_TEXT("S01.text028"), 618: RAW_TEXT("S01.text029"), 619: RAW_TEXT("S01.text030"), 620: RAW_TEXT("S01.text031"), 621: RAW_TEXT("S01.text032"), 622: RAW_TEXT("S01.text033") };
  const space = mk(D, `<div style="position:absolute;left:0;top:0;width:${USER_INPUT.layout==='portrait'?1080:1920}px;height:${USER_INPUT.layout==='portrait'?1920:1080}px;perspective:1100px;perspective-origin:50% 46%"><div class="w3" style="position:absolute;left:${USER_INPUT.layout==='portrait'?540:960}px;top:${USER_INPUT.layout==='portrait'?950:500}px;transform-style:preserve-3d"></div></div>`, 0, 0);
  const W3 = space.querySelector('.w3');
  const cards = [];
  const N = 72; let vi = 0;
  const OWN_N = 24;   
  for (let i = 0; i < N; i++) {
    const id = IDS[i % IDS.length], k = 1 + (i * 7) % 4, kind = hash(i * 4.7) < .28 ? 'tag' : 'card';
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;left:0;top:0;transform-style:preserve-3d;will-change:transform';
    if (kind === 'card') {
      const w = 270 + hash(i * 2.1) * 190;
      el.innerHTML = `<div style="width:${w}px;border-radius:10px;overflow:hidden;background:#11141c;border:1px solid rgba(255,255,255,.14);box-shadow:0 20px 50px rgba(0,0,0,.55)">
        <div style="height:32px;display:flex;align-items:center;gap:7px;padding:0 12px;background:#1a1e29"><i style="width:9px;height:9px;border-radius:50%;background:#ff5f57"></i><i style="width:9px;height:9px;border-radius:50%;background:#febc2e"></i><i style="width:9px;height:9px;border-radius:50%;background:#28c840"></i><span style="margin-left:10px;font:600 17px 'Geist Mono';color:#d7def0;letter-spacing:.5px">${TEXT_GLOBAL(NAME[id])}${TEXT("S01.text034")}</span></div>
        <img style="display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#0b0c0e"></div>`;
      el._w = w; el._img = el.querySelector('img');
      el._clip = vi < 30 ? vi % OWN_N : OWN_N + (vi * 7) % 38; vi++;   
    } else {
      const lab = [`${NAME[id]}.motion`, `#${id}`, `template_${String(i).padStart(2, '0')}.json`, `scenes.js`, `render ✓ 60fps`, `${NAME[id]}_v${1 + i % 4}.mp4`][i % 6];
      el.innerHTML = `<div style="display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:11px;background:rgba(20,24,40,.92);border:1px solid rgba(140,160,255,.35);font:600 25px 'Geist Mono';color:#e2e8ff;letter-spacing:.5px;white-space:nowrap"><span style="width:11px;height:11px;border-radius:3px;background:${['#7DB2FF', '#F5B92E', '#A78AFF', '#3DDC97'][i % 4]}"></span>${TEXT_GLOBAL(lab)}</div>`;
      el._w = 180;
    }
    W3.appendChild(el);
    
    const a = hash(i * 1.37) * 6.2832, rad = 420 + hash(i * 5.9) * 900;
    cards.push({ el, img: el._img, clip: el._clip, x: Math.cos(a)*rad*(USER_INPUT.layout==='portrait'?.60:1.25), y: Math.sin(a)*rad*(USER_INPUT.layout==='portrait'?1.2:.62), z: -2600 + hash(i * 8.3) * 3200, rx: (hash(i * 3.1) - .5) * 50, ry: (hash(i * 6.2) - .5) * 70, rz: (hash(i * 9.4) - .5) * 30, sp: .7 + hash(i * 2.9) * .6, ph: hash(i) * 10 });
  }
  
  const shade = mk(D, `<div style="width:${USER_INPUT.layout==='portrait'?1080:1920}px;height:${USER_INPUT.layout==='portrait'?1920:1080}px;background:linear-gradient(90deg,rgba(4,6,16,.82) 0%,rgba(4,6,16,.62) 30%,rgba(4,6,16,0) 55%)"></div>`, 0, 0);
  const tBro = chars(D, RAW_TEXT("S01.text035"), 150, 300, HV(136, SILVER, 6));
  const pills = [RAW_TEXT("S01.text036"), RAW_TEXT("S01.text037"), RAW_TEXT("S01.text038")].map((s, i) => mk(D, `<div class="chip" style="font-size:26px;padding:11px 24px;border-color:rgba(125,178,255,.55);color:#e2ecff;background:rgba(20,40,90,.45);text-transform:none;letter-spacing:1px"><span style="color:${BLUE2}">▸</span>${TEXT_GLOBAL(s)}</div>`, 156 + [0, 150, 410][i], 470, { ax: 0, ay: .5 }));
  const sup = TX(D, TEXT("S01.text039"), 158, 404, MONO(18, BLUE2, 4));
  const tTop = mk(D, `<div style="position:relative"><div style="${HV(150, SILVER, 4)};${METAL}">${TEXT("S01.text040")}</div><div class="gl" style="position:absolute;left:0;top:0;${HV(150, SILVER, 4)};background:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.95) 48%,rgba(160,200,255,.9) 52%,rgba(255,255,255,0) 70%);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">${TEXT("S01.text040")}</div></div>`, 150, 600, { ax: 0, ay: .5 });
  const tTopGl = tTop.querySelector('.gl');
  const tUp1 = chars(D, RAW_TEXT("S01.text041"), 150, 520, HV(104, SILVER, 2));
  const tUp2 = mk(D, `<div style="${HV(170, SILVER, 2)};${BLUEF}">${TEXT("S01.text042")}</div>`, 150, 700, { ax: 0, ay: .5 });
  const upTag = TX(D, TEXT("S01.text043"), 156, 830, MONO(18, BLUE2, 4));
  const upBar = mk(D, `<div style="width:640px;height:6px;border-radius:3px;background:rgba(125,178,255,.18);overflow:hidden"><div class="f" style="height:100%;width:0;background:linear-gradient(90deg,${BLUE},#cfe1ff)"></div></div>`, 156, 870, { ax: 0, ay: .5 });
  const upF = upBar.querySelector('.f');
  
  const era1 = mk(D, `<div style="${MONO(24, GOLD, 10)}">${TEXT("S01.text044")}</div>`, 620, 318, { ax: .5, ay: .5 });
  const era2 = mk(D, `<div style="${HV(146, SILVER, 6)};${METAL}">${TEXT("S01.text045")}</div>`, 620, 470, { ax: .5, ay: .5 });
  const era3 = mk(D, `<div style="${AN(64, GOLD, 4)};${GOLDF}">${TEXT("S01.text046")}</div>`, 620, 616, { ax: .5, ay: .5 });
  const eraLine = dimLine(D, 150, 712, 1090, 712, TEXT("S01.text047"), DIM);
  
  const name = mk(D, `<div style="display:flex;flex-direction:column;gap:14px">
      <div style="${MONO(18, BLUE2, 6)}">${TEXT("S01.text048")}</div>
      <div style="${HV(150, SILVER, 6)};${METAL}">${TEXT("S01.text049")}</div>
      <div class="nm" style="${MONO(20, SILVER, 4)}">${TEXT("S01.text050")}</div></div>`, 170, 470, { ax: 0, ay: .5 });
  const nameTxt = name.querySelector('.nm');

  const tBroT = NATIVE_CUE("cue-000"), tSupT = NATIVE_CUE("cue-001"), tDouT = NATIVE_CUE("cue-002"), tWbT = NATIVE_CUE("cue-003"), tCxT = NATIVE_CUE("cue-004"), tTopT = NATIVE_CUE("cue-005");
  const tAiT = NATIVE_CUE("cue-006"), tUpT = NATIVE_CUE("cue-007"), tEra = BR.A[1], tWall = BR.A[0], tHi = NATIVE_CUE("cue-008"), tDu = NATIVE_CUE("cue-009");
  TKF.push([0, { x: 1530, y: 548, w: 600, h: 820, r: 4 }, 0, true], [tEra - .01, { x: 1560, y: 520, w: 560, h: 780, r: 4 }, 0, false], [tEra, { x: 1560, y: 520, w: 560, h: 780, r: 4 }, 0, true], [tHi - .2, { x: 1300, y: 500, w: 600, h: 820, r: 4 }, .7, true], [T1 - .35, 'R', .5, true]);
  tCircle(tEra, '#2F7BFF', 960, 500, .30, .48, '#7DB2FF');
  window.SUBS_HIDE.push([0, O(6.88)]);

  place(space, { o: 1 });
  
  const vel = u => 520 * (1 + 3.5 * Math.exp(-u / .45)) + 5200 * smooth(pr(u, tUpT - .2, tWall)) * pr(u, tUpT - .2, tWall);
  const DIST = []; { let acc = 0; for (let f = 0; f <= Math.ceil((tWall + .2) * 240); f++) { DIST.push(acc); acc += vel(f / 240) / 240; } }
  const distAt = u => { const f = clamp(u * 240, 0, DIST.length - 1), i = Math.floor(f); return lerp(DIST[i], DIST[Math.min(i + 1, DIST.length - 1)], f - i); };
  sc.update = t => {
    
    const suck = EZ.in(pr(t, tWall - .42, tWall)), after = t > tWall - .02;
    W3.style.display = after ? 'none' : 'block';
    if (!after) cards.forEach((c, i) => {
      let z = c.z + distAt(t) * c.sp; z = ((z % 3400) + 3400) % 3400 - 2600;
      const fl = 1 - suck, x = c.x * fl, y = c.y * fl + Math.sin(t * .8 + c.ph) * 14, zz = lerp(z, -900, suck);
      const rx = c.rx + t * 6 * (c.sp - 1), ry = c.ry + t * 9 * (c.sp - .9);
      const near = zz > 400 ? clamp((zz - 400) / 400) : 0;
      const blur = Math.max(0, Math.abs(zz + 450) - 260) / 330 + near * 5;
      c.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${zz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${(c.rz * fl + suck * 200).toFixed(2)}deg) translate(-50%,-50%)`;
      c.el.style.opacity = (clamp((zz + 2600) / 600) * (1 - near) * (1 - clamp((suck - .85) * 7))).toFixed(3);
      c.el.style.filter = blur > .15 ? `blur(${Math.min(8, blur).toFixed(1)}px)` : '';
      if (c.img && +c.el.style.opacity > .02) setFrame(c.img, `sc/wall2/${String(c.clip).padStart(3, '0')}/f_${String(1 + ((Math.floor(t * 12) + i * 7) % 30)).padStart(2, '0')}.jpg`);
    });
    const vk = clamp((vel(t) - 520) / 2200);
    W3.style.transform = `rotateY(${(Math.sin(t * .35) * 6).toFixed(2)}deg) rotateX(${(Math.cos(t * .3) * 3).toFixed(2)}deg) rotateZ(${(vk * 2.5 * Math.sin(t * 1.3)).toFixed(2)}deg)`;
    space.firstChild.style.perspective = (1100 - vk * 220).toFixed(0) + 'px';
    
    charsAt(tBro, t, [-.12, -.04, .06], { k: 'slam', d: .2, out: tTopT - .25 });
    place(sup, { o: pr(t, tSupT - .1, tSupT + .1) * (1 - pr(t, tTopT - .25, tTopT - .05)) });
    [tDouT, tWbT, tCxT].forEach((t0, i) => show(pills[i], t, t0 - .05, { k: 'pop', d: .4, out: tTopT - .25, od: .2 }));
    
    const p = pr(t, tTopT - .02, tTopT + .2);
    place(tTop, { s: 1 + (1 - EZ.out5(p)) * 1.5, o: clamp(p * 5) * (1 - pr(t, tAiT - .2, tAiT)), blur: (1 - p) * 10 });
    
    charsAt(tUp1, t, tAiT - .05, { k: 'mask', stag: .05, out: tWall - .32, os: .015 });
    const q = pr(t, tUpT - .04, tUpT + .22);
    place(tUp2, { s: 1 + (1 - EZ.out5(q)) * 1.3 + suck * .25, o: clamp(q * 5) * (1 - suck), blur: (1 - q) * 12 + suck * 10 });
    upF.style.width = (EZ.out(pr(t, tUpT, tWall - .1)) * 100).toFixed(1) + '%'; place(upBar, { o: pr(t, tUpT + .1, tUpT + .3) * (1 - suck) });
    tTopGl.style.backgroundPosition = `${(100 - pr(t, tTopT + .1, tTopT + .75) * 100).toFixed(1)}% 0`;
    place(upTag, { o: pr(t, tUpT + .2, tUpT + .4) * (1 - suck) });
    if (t >= tUpT + .2 && t < tWall) scrambleAt(upTag.firstChild, RAW_TEXT("S01.text051"), t, tUpT + .2, .45);
    
    show(era1, t, tEra + .12, { k: 'up', d: .4, out: tHi - .3 });
    const r = pr(t, tEra + .02, tEra + .3);
    place(era2, { s: 1 + (1 - EZ.out5(r)) * .9, o: clamp(r * 4) * (1 - pr(t, tHi - .3, tHi - .1)), blur: (1 - r) * 14 });
    const r2 = pr(t, NATIVE_CUE("cue-010") - .02, NATIVE_CUE("cue-011") + .25);
    place(era3, { s: 1 + (1 - EZ.out5(r2)) * 1.2, o: clamp(r2 * 5) * (1 - pr(t, tHi - .3, tHi - .1)) });
    dimAt(eraLine, t, tEra + .5, { out: tHi - .3 });
    
    show(name, t, tHi - .05, { k: 'left', d: .5, dist: 120 });
    if (t >= tDu) scrambleAt(nameTxt, RAW_TEXT("S01.text052"), t, tDu, .5);
    
    place(sky, { o: after ? 0 : 1 }); place(shade, { o: after ? 0 : 1 });
  };
  sc.cam = t => {
    const [sx, sy] = shake(t, tTopT, .35, 18), [ux, uy] = shake(t, tUpT, .3, 14), [ex, ey] = shake(t, tEra, .45, 24);
    const z = 1 + beatPulse(t, true) * .008 + (t > tEra ? .03 * (1 - EZ.out(pr(t, tEra, tEra + 1.2))) : 0);
    return { x: 960, y: 540, z, sx: sx + ux + ex, sy: sy + uy + ey };
  };
  
  const CR = { x: 1530 - 300, y: 548 - 410, w: 600, h: 820 };
  const perim = q => { const L = 2 * (CR.w + CR.h); let d = q * L; if (d < CR.w) return [CR.x + d, CR.y]; d -= CR.w; if (d < CR.h) return [CR.x + CR.w, CR.y + d]; d -= CR.h; if (d < CR.w) return [CR.x + CR.w - d, CR.y + CR.h]; d -= CR.w; return [CR.x, CR.y + CR.h - d]; };
  sc.fx = (c, t) => {
    if (t < 1.4) {   
      const q = EZ.inout(pr(t, 0, 1.1)), k = 1 - pr(t, 1.1, 1.4);
      c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(160,200,255,${(.9 * k).toFixed(3)})`; c.lineWidth = 3; c.shadowColor = '#7DB2FF'; c.shadowBlur = 16;
      c.beginPath(); for (let u = 0; u <= q; u += .005) { const [x, y] = perim(u); u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
      if (q < 1) { const [x, y] = perim(q); glow(c, x, y, 60, '200,220,255'); sparks(c, t, 0, 0, 0, { rate: 120, n: 160, life: .5, col: '200,220,255', seed: 8, px: b => perim(EZ.inout(pr(b, 0, 1.1)))[0], py: b => perim(EZ.inout(pr(b, 0, 1.1)))[1] }); }
    }
    shockRing(c, t, 0, 300, 300, 700, .7, '170,200,255', 2); shockRing(c, t, tTopT, 420, 600, 900, .6, '200,215,255', 3); shockRing(c, t, tUpT, 480, 700, 1000, .6, '125,178,255', 3);
    if (t > tUpT - .2 && t < tWall) radialLines(c, t, 960, 520, EZ.in(pr(t, tUpT - .2, tWall)), 180, '170,200,255', 6, false);
    if (t < tWall) stars(c, t, 120, .6, 11, '140,170,255');
    if (t >= tEra && t < tEra + 1) { const k = 1 - pr(t, tEra, tEra + 1); glow(c, 960, 500, 380 * (1 - k * .5), '125,178,255', k * .8); }
    if (t >= tEra - .05 && t < tEra + 1.2) sparks(c, t, tEra, 960, 500, { n: 90, life: 1.0, dir: 0, spread: 6.3, speed: 1500, g: 500, col: '170,205,255', seed: 4 });
  };
  const U = sc.update; sc.update = t => { U(t); fxDraw(c => sc.fx(c, t), true); };
  
  SOURCE_S("S01.sound000",0, 'whoosh', .75, -.3); SOURCE_S("S01.sound001",.32, 'swoosh', .4, .4); SOURCE_S("S01.sound002",.95, 'swoosh', .25, -.2);
  SOURCE_S("S01.sound003",tUpT - .2, 'rise', .6, 0, { d: tWall - tUpT + .2 });
  SOURCE_S("S01.sound004",0, 'hit', .7); SOURCE_S("S01.sound005",tDouT - .05, 'pop', .45, -.4); SOURCE_S("S01.sound006",tWbT - .05, 'pop', .45, 0); SOURCE_S("S01.sound007",tCxT - .05, 'pop', .45, .4);
  SOURCE_S("S01.sound008",tTopT, 'hit', 1); SOURCE_S("S01.sound009",tAiT, 'whoosh', .4); SOURCE_S("S01.sound010",tUpT, 'hit', .9);
  SOURCE_S("S01.sound011",tEra - .6, 'suck', .6); SOURCE_S("S01.sound012",tEra, 'crash', .8); SOURCE_S("S01.sound013",tEra + .02, 'hit', 1);
  SOURCE_S("S01.sound014",tHi - .05, 'swoosh', .5); SOURCE_S("S01.sound015",tDu, 'type', .4);
})();
