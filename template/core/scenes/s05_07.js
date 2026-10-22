


(() => {
if(!USER_INPUT.selected.includes("S05"))return;
window.CURRENT_UNIT="S05";

  const T0 = NATIVE_CUE("cue-042"), T1 = O(53.70);
  const sc = SC(T0, T1, BG, '05 — .MOTION');
  const D = sc.el;
  const tDot = NATIVE_CUE("cue-043"), tSimple = NATIVE_CUE("cue-044"), tEdit = NATIVE_CUE("cue-045"), tFmt = NATIVE_CUE("cue-046"), tMp4 = NATIVE_CUE("cue-047"), tDiff = NATIVE_CUE("cue-048"),
    tCre = NATIVE_CUE("cue-049"), tExp = NATIVE_CUE("cue-050"), tDl = NATIVE_CUE("cue-051"), tDb = NATIVE_CUE("cue-052"), tAny = NATIVE_CUE("cue-053"), tRe = NATIVE_CUE("cue-054"), tOpen = NATIVE_CUE("cue-055"), tLim = NATIVE_CUE("cue-056");
  TKF.push([T0, { x: 960, y: 500, w: 40, h: 40, r: 20 }, 0, false], [tSimple - .3, 'BR', .45, true], [tSimple + .3, 'R', .5, true], [tMp4 - .35, 'TR', .45, true], [tCre - .3, { x: 1640, y: 520, w: 440, h: 600, r: 4 }, .5, true], [tDl - .3, { x: 1700, y: 800, w: 220, h: 220, r: 110 }, .5, true], [tOpen - .3, 'R', .5, true]);
  
  const word = mk(D, `<div style="display:flex;align-items:flex-end;gap:6px"><span class="dt" style="display:inline-block;width:70px;height:70px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#A9A9FF,#6D5CF0);margin-bottom:26px;box-shadow:0 0 40px rgba(123,123,255,.6)"></span><span class="mw" style="${AN(300, SILVER, 6)};${METAL}">${TEXT("S05.text001")}</span></div>`, 960, 470, { ax: .5, ay: .5 });
  const dt = word.querySelector('.dt'), mw = word.querySelector('.mw');
  const tags = mk(D, `<div style="display:flex;gap:14px">${[RAW_TEXT("S05.text002"), RAW_TEXT("S05.text003"), RAW_TEXT("S05.text004")].map(s => `<span class="chip">${TEXT_GLOBAL(s)}</span>`).join('')}</div>`, 960, 700, { ax: .5, ay: .5 });
  const hdr = mk(D, `<div style="${MONO(22, BLUE2, 10)}">${TEXT("S05.text005")}</div>`, 960, 250, { ax: .5, ay: .5 });
  
  const LAYERS = [[RAW_TEXT("S05.file001"), RAW_TEXT("S05.text006"), 'code', BLUE2], [RAW_TEXT("S05.file002"), RAW_TEXT("S05.text007"), 'image', SILVER], [RAW_TEXT("S05.file003"), RAW_TEXT("S05.text008"), 'gear', GOLD], [RAW_TEXT("S05.text009"), RAW_TEXT("S05.text010"), 'mic', LAV]];
  const file = motionFile(D, 520, 520, 230, { name: RAW_TEXT("S05.file004") });
  const layers = LAYERS.map(([n, s, ic, col], i) => mk(D, `<div style="width:520px;height:96px;border-radius:14px;background:rgba(18,21,26,.94);border:1.5px solid ${col};display:flex;align-items:center;gap:20px;padding:0 24px;box-shadow:0 16px 40px rgba(0,0,0,.5)">
      <span style="color:${col}">${ICON(ic, 40, 1.8)}</span><div><div style="font:600 26px 'Geist Mono';color:${SILVER}">${TEXT_GLOBAL(n)}</div><div style="${ZH(19, DIM, 500)};margin-top:4px">${TEXT_GLOBAL(s)}</div></div><span style="margin-left:auto;${MONO(14, col, 3)}">${TEXT("S05.text011")}${i + 1}</span></div>`, 0, 0, { ax: .5, ay: .5 }));
  const editT = mk(D, `<div style="display:flex;flex-direction:column;gap:8px"><span style="${MONO(20, BLUE2, 6)}">${TEXT("S05.text012")}</span><span style="${HV(84, SILVER, 4)}"><span style="${BLUEF}">${TEXT("S05.text013")}</span>${TEXT("S05.text014")}</span></div>`, 150, 190, { ax: 0, ay: .5 });
  
  const mp4 = mk(D, `<div style="position:relative;width:440px;height:300px;border-radius:18px;background:#16191e;border:1.5px solid rgba(233,236,239,.2);overflow:hidden">
      <img src="${USER_INPUT.media.thumbnail.file}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.3) brightness(.55)">
      <div style="position:absolute;left:22px;top:18px;${AN(56, SILVER, 2)}">${TEXT("S05.text015")}</div>
      <div style="position:absolute;left:22px;bottom:18px;${MONO(16, DIM, 3)}">${TEXT("S05.text016")}</div>
      <div style="position:absolute;right:14px;bottom:8px">${lineIcon('lock', 96, SILVER, '255,90,70')}</div></div>`, 0, 0, { ax: .5, ay: .5 });
  const vs = mk(D, `<div style="${AN(80, DIM, 4)}">${TEXT("S05.text017")}</div>`, 0, 0, { ax: .5, ay: .5 });
  const diffT = mk(D, `<div style="${HV(76, SILVER, 4)}">${TEXT("S05.text018")}<span style="${GOLDF}">${TEXT("S05.text019")}</span></div>`, 150, 190, { ax: 0, ay: .5 });
  
  
  const vid = vcard(D, 680, 383, { label: RAW_TEXT("S05.text020"), badge: RAW_TEXT("S05.text021") });
  const exBtn = mk(D, `<div style="display:flex;align-items:center;gap:14px;padding:16px 30px;border-radius:14px;background:linear-gradient(180deg,#B9A4FF,${LAV});box-shadow:0 14px 40px rgba(167,138,255,.35)"><span style="display:inline-block;width:30px">${MOTION_MARK(30, '#120d24', '#fff')}</span><span style="${GE(26, '#120d24', 700)}">${TEXT("S05.text022")}</span></div>`, 560, 760, { ax: .5, ay: .5 });
  const cursor = mk(D, `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2L9 21z" fill="#fff" stroke="#0A0B0D" stroke-width="1.4" stroke-linejoin="round"/></svg>`, 0, 0, { ax: .15, ay: .1 });
  const fileLab = mk(D, `<div style="${MONO(18, SILVER, 3)};text-transform:none">${TEXT("S05.text023")} <span style="color:${DIM}">${TEXT("S05.text024")}</span></div>`, 1240, 720, { ax: .5, ay: .5 });
  
  const TABS = [RAW_TEXT("S05.text025"), RAW_TEXT("S05.text026"), RAW_TEXT("S05.text027"), RAW_TEXT("S05.toolLabel"), '…'];
  const chat = mk(D, `<div class="glass" style="position:relative;width:1180px;height:720px;border-radius:24px;overflow:hidden">
      <div style="height:64px;display:flex;align-items:center;gap:8px;padding:0 22px;border-bottom:1px solid rgba(233,236,239,.08)">
        ${TABS.map((n, i) => `<div class="tb" style="position:relative;padding:10px 20px;border-radius:10px;${ZH(22, DIM, 600)}">${TEXT_GLOBAL(n)}</div>`).join('')}
        <div style="margin-left:auto;display:flex;align-items:center;gap:10px;${MONO(15, '#3DDC97', 3)}"><span style="width:10px;height:10px;border-radius:50%;background:#3DDC97;display:inline-block"></span>${TEXT("S05.text028")}</div></div>
      <div style="position:relative;padding:28px 34px">
        <div class="um" style="display:flex;flex-direction:column;align-items:flex-end;gap:12px">
          <div class="at" style="display:flex;gap:10px">
            ${[['.m', RAW_TEXT("S05.file004"), LAV], ['▶', RAW_TEXT("S05.text033"), BLUE2], ['≡', RAW_TEXT("S05.text034"), SILVER], ['▣', RAW_TEXT("S05.text035"), GOLD]].map(([ic, n, c]) => `<div class="ch" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:12px;background:#1f232b;border:1px solid rgba(233,236,239,.12)"><span style="width:30px;height:30px;border-radius:7px;background:${c};display:flex;align-items:center;justify-content:center;font:800 14px 'Geist Mono';color:#0A0B0D">${TEXT_GLOBAL(ic)}</span><span style="font:500 18px 'Geist Mono','PingFang SC';color:${SILVER}">${TEXT_GLOBAL(n)}</span></div>`).join('')}</div>
          <div class="ut" style="max-width:760px;padding:16px 22px;border-radius:18px 18px 4px 18px;background:${BLUE};${ZH(26, '#fff', 600)}"></div></div>
        <div class="am" style="margin-top:22px;display:flex;gap:16px">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#3a6fd8,#A78AFF);flex:none"></div>
          <div style="flex:1"><div class="an" style="${MONO(15, DIM, 3)}">${TEXT("S05.text029")}</div>
            <div class="st" style="margin-top:10px;display:grid;grid-template-columns:repeat(2,330px);gap:8px 30px">${[RAW_TEXT("S05.text036"), RAW_TEXT("S05.text037"), RAW_TEXT("S05.text038"), RAW_TEXT("S05.text039")].map(n => `<div class="sp" style="display:flex;align-items:center;gap:12px;${ZH(22, SILVER, 500)}"><span class="ck" style="width:26px;height:26px;border-radius:50%;border:2px solid rgba(233,236,239,.3);display:flex;align-items:center;justify-content:center;font:800 15px Geist;color:#0A0B0D"></span>${TEXT_GLOBAL(n)}</div>`).join('')}</div>
            <div class="rs" style="margin-top:18px;display:flex;align-items:center;gap:24px">
              <div style="width:448px;height:252px;border-radius:12px;overflow:hidden;background:#000;outline:1px solid rgba(233,236,239,.18)"><img class="rv" style="width:100%;height:100%;object-fit:cover;display:block"></div>
              <div style="display:flex;flex-direction:column;gap:10px"><span style="${ZH(28, '#3DDC97', 700)}">${TEXT("S05.text030")}</span><span style="${MONO(16, DIM, 3)}">${TEXT("S05.text031")}</span><span style="${MONO(16, DIM, 3)}">${TEXT("S05.text032")}</span></div></div></div></div></div></div>`, 860, 500, { ax: .5, ay: .5 });
  const tbs = [...chat.querySelectorAll('.tb')], chs = [...chat.querySelectorAll('.ch')], ut = chat.querySelector('.ut'), an = chat.querySelector('.an');
  const sps = [...chat.querySelectorAll('.sp')], cks = [...chat.querySelectorAll('.ck')], rs = chat.querySelector('.rs'), rv = chat.querySelector('.rv'), am = chat.querySelector('.am');
  const reT = mk(D, `<div style="${HV(60, SILVER, 4)}">${TEXT("S05.text040")} <span style="${BLUEF}">${TEXT("S05.text041")}</span></div>`, 1840, 112, { ax: 1, ay: .5 });
  
  const chain = mk(D, `<div>${lineIcon('chainBreak', 300, GOLD2, '245,185,46')}</div>`, 600, 540, { ax: .5, ay: .5 });
  const openS = seal(D, TEXT("S05.text042"), 600, 330, GOLD, 92, -6, RAW_TEXT("S05.text043"));
  const limT = mk(D, `<div style="${MONO(22, DIM, 6)};text-align:center">${TEXT("S05.text044")}<br><span style="${ZH(34, SILVER, 600)};letter-spacing:2px">${TEXT("S05.text045")}</span></div>`, 600, 790, { ax: .5, ay: .5 });

  sc.update = t => {
    
    const r = pr(t, T0, T0 + .35), rOut = pr(t, BR.B[0] - .02, BR.B[0]);
    const dotIn = pr(t, tDot - .05, tDot + .2);
    place(word, { o: clamp(r * 4) * (1 - rOut), s: (1 + (1 - EZ.out5(r)) * .5) * (1 - rOut * .3), y: 470 - rOut * 80 });
    if (t < tDot) { mw.style.textTransform = 'uppercase'; scrambleAt(mw, RAW_TEXT("S05.text046"), t, T0, .45); }
    else { mw.style.textTransform = 'none'; setTxt(mw, RAW_TEXT("S05.text001")); }
    dt.style.transform = `translateY(${((1 - EZ.out5(dotIn)) * -400).toFixed(1)}px) scale(${(dotIn > 0 ? 1 : 0)})`; dt.style.opacity = dotIn > 0 ? 1 : 0;
    show(tags, t, tDot + .25, { k: 'up', d: .45, out: BR.B[0] - .05, od: .05 });
    show(hdr, t, T0 + .4, { k: 'blur', d: .5, out: BR.B[0] - .05, od: .05 });
    
    const fin = pr(t, tSimple - .1, tSimple + .3), fout = pr(t, tMp4 - .35, tMp4 - .05);
    const ex = EZ.spring(pr(t, tEdit - .05, tEdit + .7));
    place(file, { o: clamp(fin * 3) * (1 - fout), x: lerp(520, 300, ex), y: 540, s: .9 + .1 * EZ.out(fin) });
    layers.forEach((l, i) => {
      const k = EZ.spring(pr(t, tEdit + i * .1, tEdit + .6 + i * .1));
      place(l, { x: lerp(300, 820, k) + i * 30, y: lerp(540, 360 + i * 118, k), o: k > .01 ? (1 - fout) : 0, s: .6 + .4 * k, r: (1 - k) * -10 });
    });
    show(editT, t, tEdit - .1, { k: 'mask', d: .45, out: tMp4 - .35 });
    
    const vIn = pr(t, tMp4 - .2, tMp4 + .2), vOut = pr(t, tCre - .35, tCre - .05), dk = pr(t, tDiff - .05, tDiff + .3);
    place(mp4, { x: 400, y: 560, o: clamp(vIn * 3) * (1 - vOut) * (1 - dk * .5), s: 1 - dk * .08 });
    mp4.firstChild.style.filter = `grayscale(${dk.toFixed(2)})`;
    place(vs, { x: 740, y: 560, o: pr(t, tMp4 + .1, tMp4 + .3) * (1 - vOut) });
    show(diffT, t, tDiff - .05, { k: 'mask', d: .45, out: tCre - .35 });
    
    if (t > tMp4 - .35 && t < tCre) layers.forEach((l, i) => place(l, { x: 1080 + i * 18, y: 400 + i * 104, o: pr(t, tMp4 - .2, tMp4 + .1) * (1 - vOut), s: .78 * (1 + dk * .06) }));
    if (t > tMp4 - .35 && t < tCre) place(file, { o: 0 });
    
    const xin = pr(t, tCre - .25, tCre + .2), xout = pr(t, tDl - .3, tDl);
    place(vid, { x: 560, y: 470, o: clamp(xin * 3) * (1 - xout), s: .94 + .06 * EZ.out(xin) });
    { const PV = ['pr591_30', 'pr585_62', 'pr589_30'], k = Math.min(2, Math.floor(Math.max(0, t - (tCre - .25)) / 1.6)); vseq(vid, PV[k], 48, t, tCre - .25 + k * 1.6, false); }
    const bp = pr(t, tExp - .02, tExp + .14);
    place(exBtn, { o: pr(t, tCre + .2, tCre + .45) * (1 - xout), s: 1 - Math.sin(Math.PI * bp) * .07 });
    const cm = EZ.inout(pr(t, tCre + .4, tExp - .05));
    place(cursor, { x: lerp(980, 600, cm), y: lerp(940, 775, cm), o: pr(t, tCre + .35, tCre + .5) * (1 - pr(t, tExp + .25, tExp + .45)), s: 1 - Math.sin(Math.PI * bp) * .2 });
    const fp = EZ.spring(pr(t, tExp + .08, tExp + .7)), toChat = EZ.inout(pr(t, tDl - .15, tDl + .35));
    if (t > tExp && t < tDl + .4) place(file, { x: lerp(lerp(560, 1240, fp), 380, toChat), y: lerp(lerp(760, 470, fp), 330, toChat), o: (1 - pr(t, tDl + .25, tDl + .4)), s: lerp(.9, .32, toChat), r: lerp(lerp(-20, 0, fp), 10, toChat) });
    place(fileLab, { o: pr(t, tExp + .4, tExp + .6) * (1 - xout) });
    
    const cin = pr(t, tDl - .2, tDl + .25), cout = pr(t, tOpen - .35, tOpen - .05);
    place(chat, { o: clamp(cin * 3) * (1 - cout), s: (.94 + .06 * EZ.out(cin)) * (1 - cout * .04), blur: (1 - cin) * 8 + cout * 6 });
    const wbT = NATIVE_CUE("cue-057"), act = t < wbT - .05 ? 0 : t < tAny - .05 ? 1 : Math.floor((t - tAny) / .18) % 4;
    tbs.forEach((b, i) => { const on = i === act; b.style.background = on ? 'rgba(125,178,255,.16)' : 'transparent'; b.style.color = on ? '#fff' : DIM; b.style.boxShadow = on ? `inset 0 -3px 0 ${BLUE2}` : 'none'; });
    setTxt(an, RAW_TEXT("S05.text047") + [RAW_TEXT("S05.text048"), RAW_TEXT("S05.text049"), RAW_TEXT("S05.text050"), RAW_TEXT("S05.toolLabel")][act]);
    chs.forEach((c, i) => { const k = pr(t, tDl + .25 + i * .09, tDl + .5 + i * .09); c.style.opacity = k.toFixed(2); c.style.transform = `translateY(${((1 - EZ.spring(k)) * 24).toFixed(1)}px) scale(${(.85 + .15 * EZ.spring(k)).toFixed(3)})`; });
    typeAt(ut, RAW_TEXT("S05.text051"), t, tDb - .15, 18);
    ut.style.opacity = t > tDb - .2 ? 1 : 0;
    am.style.opacity = pr(t, tAny - .25, tAny).toFixed(2);
    sps.forEach((sp, i) => {
      const t0 = tAny + i * .22, k = pr(t, t0, t0 + .18);
      sp.style.opacity = (.35 + .65 * pr(t, t0 - .2, t0)).toFixed(2);
      cks[i].style.background = k >= 1 ? '#3DDC97' : 'transparent'; cks[i].style.borderColor = k >= 1 ? '#3DDC97' : 'rgba(233,236,239,.3)';
      cks[i].textContent = k >= 1 ? '✓' : ''; cks[i].style.transform = `rotate(${(k < 1 && k > 0 ? t * 720 : 0).toFixed(0)}deg)`;
      if (k > 0 && k < 1) cks[i].style.borderTopColor = BLUE2;
    });
    const rp = pr(t, tRe - .1, tRe + .3);
    rs.style.opacity = rp.toFixed(2); rs.style.transform = `translateY(${((1 - EZ.out(rp)) * 20).toFixed(1)}px)`;
    if (rp > 0) setFrame(rv, seqAt('d605', 90, 30, t, tRe - .1));
    show(reT, t, tAny - .1, { k: 'mask', d: .45, out: tOpen - .35 });
    
    const chIn = pr(t, tOpen - .2, tOpen + .1);
    place(chain, { o: clamp(chIn * 3) * (1 - pr(t, T1 - .3, T1 - .05)), s: (.7 + .3 * EZ.spring(chIn)) * (1 + Math.sin(Math.PI * pr(t, tLim, tLim + .3)) * .1), r: -8 + Math.sin(t * 2) * 2 });
    sealAt(openS, t, tOpen + .05, T1 - .3);
    show(limT, t, tLim - .1, { k: 'up', d: .45, out: T1 - .3 });
  };
  sc.cam = t => { const [sx, sy] = shake(t, T0, .5, 26), [dx, dy] = shake(t, tDot, .3, 14), [ox, oy] = shake(t, tOpen + .05, .3, 14); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006 + .04 * (1 - EZ.out(pr(t, T0, T0 + 1.2))), sx: sx + dx + ox, sy: sy + dy + oy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      if (t < T0 + 1.6) { const k = 1 - pr(t, T0, T0 + 1.4); glow(c, 960, 470, 700 * (1.2 - k * .6), '140,160,255', k * .8); sparks(c, t, T0, 960, 470, { n: 160, life: 1.4, dir: 0, spread: 6.3, speed: 1900, g: 200, col: '200,215,255', seed: 35 }); }
      if (t > tDot - .05 && t < tDot + .7) sparks(c, t, tDot + .15, 600, 500, { n: 40, life: .6, dir: 0, spread: 6.3, speed: 700, g: 400, col: '170,160,255', seed: 36 });
      if (t >= tLim && t < tLim + .8) sparks(c, t, tLim + .05, 600, 540, { n: 50, life: .7, dir: 0, spread: 6.3, speed: 900, g: 900, col: '255,214,120', seed: 37 });
    });
  };
  tFlash(T0, 1, .3);
  SOURCE_S("S05.sound000",T0, 'hit', 1); SOURCE_S("S05.sound001",T0 + .05, 'glitch', .5); SOURCE_S("S05.sound002",tDot, 'pop', .8); SOURCE_S("S05.sound003",tDot + .02, 'shine', .6); SOURCE_S("S05.sound004",tDot + .25, 'tick', .35);
  SOURCE_S("S05.sound005",tSimple - .1, 'whoosh', .45); SOURCE_S("S05.sound006",tEdit, 'swoosh', .5); [0, 1, 2, 3].forEach(i => SOURCE_S("S05.sound007",tEdit + .2 + i * .1, 'card', .4, .2 + i * .1));
  SOURCE_S("S05.sound008",tMp4 - .2, 'thud', .6, -.4); SOURCE_S("S05.sound009",tDiff, 'hit', .7); SOURCE_S("S05.sound010",tCre - .25, 'swoosh', .45); SOURCE_S("S05.sound011",tExp, 'click', .9); SOURCE_S("S05.sound012",tExp + .1, 'pop', .6, .4); SOURCE_S("S05.sound013",tDl - .15, 'whoosh', .5);
  [0, 1, 2, 3].forEach(i => SOURCE_S("S05.sound014",tDl + .25 + i * .09, 'tick', .35, .3)); SOURCE_S("S05.sound015",tDb - .15, 'typing', .35, .3, { d: 1.1 }); SOURCE_S("S05.sound016",NATIVE_CUE("cue-058") - .05, 'click', .5);
  [0, 1, 2, 3].forEach(i => SOURCE_S("S05.sound017",tAny + i * .22 + .18, 'check', .4, 0, { n: i })); SOURCE_S("S05.sound018",tRe - .1, 'win_pop', .6); SOURCE_S("S05.sound019",tRe, 'sparkle', .45);
  SOURCE_S("S05.sound020",tOpen + .05, 'stamp', 1); SOURCE_S("S05.sound021",tLim + .05, 'crack', .6);
})();


(() => {
if(!USER_INPUT.selected.includes("S06"))return;
window.CURRENT_UNIT="S06";

  const T0 = O(53.70), T1 = BR.C[0];
  const sc = SC(T0, T1, BG, '06 — 质感');
  const D = sc.el;
  const tSet = NATIVE_CUE("cue-059"), tCopy = NATIVE_CUE("cue-060"), tVo = NATIVE_CUE("cue-061"), tAny = NATIVE_CUE("cue-062"), tQ = NATIVE_CUE("cue-063"), tTop = NATIVE_CUE("cue-064"), tSo = NATIVE_CUE("cue-065"), tMine = NATIVE_CUE("cue-066");
  TKF.push([T0, 'R', .45, true], [tSo - .1, { x: 960, y: 470, w: 560, h: 760, r: 4 }, .7, true]);
  
  const ROWS = [[RAW_TEXT("S06.text001"), RAW_TEXT("S06.firstRowValue"), tSet], [RAW_TEXT("S06.text002"), RAW_TEXT("S06.text003"), tCopy], [RAW_TEXT("S06.text004"), RAW_TEXT("S06.text005"), tVo], [RAW_TEXT("S06.text006"), RAW_TEXT("S06.text007"), tAny]];
  const panel = mk(D, `<div style="width:520px">
      <div style="${MONO(20, GOLD, 6)};padding-bottom:10px;border-bottom:2px solid ${GOLD};display:inline-block">${TEXT("S06.text008")}</div>
      ${ROWS.map(([a, b]) => `<div class="rw" style="display:flex;justify-content:space-between;margin-top:22px;font:500 30px 'Geist Mono','PingFang SC';color:${SILVER}"><span>${TEXT_GLOBAL(a)}</span><span style="color:${BLUE2}">${TEXT_GLOBAL(b)}</span></div>`).join('')}
      <div style="${MONO(18, DIM, 5)};margin-top:46px">${TEXT("S06.text009")}</div>
      <div class="qv" style="${AN(150, GOLD, 2)};${GOLDF};margin-top:6px">${TEXT("S06.text010")}</div></div>`, 150, 470, { ax: 0, ay: .5 });
  const rws = [...panel.querySelectorAll('.rw')], qv = panel.querySelector('.qv');
  
  const CX = 900, CY = 480;
  const boxSvg = mk(D, `<svg width="560" height="460" viewBox="-280 -230 560 460" style="overflow:visible">
      <g fill="none" stroke="rgba(125,178,255,.55)" stroke-width="2"><path d="M-160 -60 L40 -140 L200 -70 L0 10 Z"/><path d="M-160 -60 L-160 120 L0 200 L0 10"/><path d="M200 -70 L200 110 L0 200"/>
      <path d="M-160 120 L40 40 L200 110" stroke-dasharray="6 7" opacity=".5"/><path d="M40 40 L40 -140" stroke-dasharray="6 7" opacity=".5"/></g>
      <text x="-160" y="-90" fill="${DIM}" style="font:500 15px 'Geist Mono';letter-spacing:3px">${TEXT("S06.text011")}</text></svg>`, CX, CY, { ax: .5, ay: .5 });
  const ICS = [['file', RAW_TEXT("S06.text012")], ['book', RAW_TEXT("S06.text013")], ['mic', RAW_TEXT("S06.text014")], ['video', RAW_TEXT("S06.text015")]];
  const chips = ICS.map(([ic, s], i) => mk(D, `<div style="width:150px;height:110px;border-radius:14px;background:#171a20;border:1.5px solid rgba(233,236,239,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:${[GOLD, BLUE2, LAV, SILVER][i]}">${ICON(ic, 40, 1.8)}<span style="${ZH(20, SILVER, 600)}">${TEXT_GLOBAL(s)}</span></div>`, 0, 0, { ax: .5, ay: .5 }));
  const topT = mk(D, `<div style="${HV(130, GOLD, 8)};${GOLDF}">${TEXT("S06.text016")}</div>`, 860, 790, { ax: .5, ay: .5 });
  const qTag = mk(D, `<div style="${MONO(16, DIM, 4)}">${TEXT("S06.text017")}</div>`, 520, 760, { ax: 0, ay: .5 });
  const quiet = mk(D, `<div style="${MONO(22, DIM, 10)}">${TEXT("S06.text018")}</div>`, 960, 112, { ax: .5, ay: .5 });
  const tUp = NATIVE_CUE("cue-067"), tFmt2 = NATIVE_CUE("cue-068");
  const upW = mk(D, `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:8px"><span style="${HV(84, SILVER, 4)}">${TEXT("S06.text019")}</span><span style="${AN(120, SILVER, 2)};text-transform:none;${METAL}">${TEXT("S06.text020")}</span><span class="pc" style="${MONO(22, GOLD, 4)}">${TEXT("S06.text021")}</span></div>`, 140, 470, { ax: 0, ay: .5 });
  const upPc = upW.querySelector('.pc');
  sc.update = t => {
    const out = pr(t, tSo - .3, tSo);
    place(panel, { o: pr(t, T0, T0 + .3) * (1 - out) });
    rws.forEach((r, i) => { const k = pr(t, ROWS[i][2] - .1, ROWS[i][2] + .2); r.style.opacity = k.toFixed(2); r.style.transform = `translateX(${((1 - EZ.out(k)) * -30).toFixed(1)}px)`; });
    const qval = t < tQ ? Number(RAW_TEXT("S06.text010")) : lerp(Number(RAW_TEXT("S06.text010")), Number(RAW_TEXT("S06.number001")), EZ.out5(pr(t, tQ, tTop + .2)));
    setTxt(qv, qval.toFixed(1));
    place(qTag, { o: pr(t, tQ, tQ + .2) * (1 - out) });
    place(boxSvg, { o: pr(t, tSet - .2, tSet + .2) * (1 - out), s: 1 + Math.sin(Math.PI * pr(t, tAny + .4, tAny + .8)) * .05 + beatPulse(t, true) * .015 });
    chips.forEach((c, i) => {
      const t0 = ROWS[i][2], k = pr(t, t0 - .05, t0 + .3), into = EZ.in(pr(t, tAny + .3 + i * .05, tAny + .65 + i * .05));
      const sx = [720, 880, 1040, 1200][i] - 60, sy = [250, 210, 210, 250][i];
      place(c, { x: lerp(sx, CX + 20, into), y: lerp(sy + (1 - EZ.out(k)) * -60, CY + 30, into), o: clamp(k * 3) * (1 - into), s: 1 - into * .6, r: (1 - k) * 12 });
    });
    const tp = pr(t, tTop - .03, tTop + .22);
    place(topT, { s: 1 + (1 - EZ.out5(tp)) * 1.4, o: clamp(tp * 5) * (1 - out), blur: (1 - tp) * 12 });
    show(quiet, t, tMine - .1, { k: 'blur', d: .6, out: T1 - .1 });
    show(upW, t, tUp - .1, { k: 'mask', d: .45, out: T1 - .08, od: .08 });
    { const n = Math.round(EZ.in(pr(t, tUp, T1)) * parseInt(RAW_TEXT("S06.text021"))); setTxt(upPc, (n >= parseInt(RAW_TEXT("S06.text021")) ? RAW_TEXT("S06.text021") : String(n).padStart(3, '0')) + RAW_TEXT("S06.text022")); }
  };
  sc.cam = t => { const [sx, sy] = shake(t, tTop, .35, 16); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006 + (t > tMine ? .03 * pr(t, tMine, T1) : 0), sx, sy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      
      const b = pr(t, tQ - .1, tQ + .5), fade = 1 - pr(t, tSo - .3, tSo);
      if (b > 0 && fade > 0) {
        const x0 = lerp(CX - 380, CX + 380, 0), x1 = lerp(CX - 380, CX + 380, EZ.out(b));
        c.strokeStyle = `rgba(255,214,120,${(.9 * fade).toFixed(3)})`; c.lineWidth = 6; c.shadowColor = GOLD; c.shadowBlur = 26; c.beginPath(); c.moveTo(x0, CY + 160); c.lineTo(x1, CY - 120); c.stroke(); c.shadowBlur = 0;
        if (b < 1) glow(c, x1, lerp(CY + 160, CY - 120, EZ.out(b)), 60);
      }
      if (t > tMine) { const q = pr(t, tMine, T1), pp = EZ.in(pr(t, tUp, T1)); c.strokeStyle = `rgba(233,236,239,${(.2 * q).toFixed(3)})`; c.lineWidth = 2; c.beginPath(); c.arc(960, 470, 450, 0, 6.2832); c.stroke(); c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(245,185,46,${(.9 * q).toFixed(3)})`; c.lineWidth = 6; c.shadowColor = GOLD; c.shadowBlur = 18; c.beginPath(); c.arc(960, 470, 450, -Math.PI / 2, -Math.PI / 2 + pp * 6.2832); c.stroke(); c.restore(); const ea = -Math.PI / 2 + pp * 6.2832; if (pp > 0 && pp < 1) glow(c, 960 + Math.cos(ea) * 450, 470 + Math.sin(ea) * 450, 50); }
    });
  };
  ROWS.forEach(([, , t0], i) => SOURCE_S("S06.sound000",t0 - .05, 'card', .45, .2 + i * .15)); SOURCE_S("S06.sound001",tAny + .5, 'suck', .5, 0, { d: .4 }); SOURCE_S("S06.sound002",tQ - .1, 'rise', .4); SOURCE_S("S06.sound003",tQ, 'counter', .45, -.4, { d: 1.6 });
  SOURCE_S("S06.sound004",tTop, 'hit', 1); SOURCE_S("S06.sound005",tSo - .1, 'whoosh', .5);
})();


(() => {
if(!USER_INPUT.selected.includes("S07"))return;
window.CURRENT_UNIT="S07";

  const T0 = BR.C[1], T1 = O(74.10);
  const sc = SC(T0, T1, BG, '07 — 升级');
  const D = sc.el;
  const tRich = NATIVE_CUE("cue-069"), tFit = NATIVE_CUE("cue-070"), tRot = NATIVE_CUE("cue-071"), tSmooth = NATIVE_CUE("cue-072"), tNew = NATIVE_CUE("cue-073"), tOther = NATIVE_CUE("cue-074"), tKn = NATIVE_CUE("cue-075"), tInd = NATIVE_CUE("cue-076"), tCus = NATIVE_CUE("cue-077"), tSoon = NATIVE_CUE("cue-078");
  const K1 = tRich - .05, K2 = tFit - .05, K3 = tRot - .1, K4 = tNew - .25;
  TKF.push([T0 - .01, 'TR', 0, false], [T0, 'TR', 0, true], [T0 + .01, 'TR', 0, false], [K4, 'TR', .45, true], [tKn - .3, 'TR', .4, false], [tInd - .25, { x: 1740, y: 770, w: 220, h: 220, r: 110 }, .45, true]);
  
  const ALL = [605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 615, 616, 617, 618, 619, 620, 621, 622];
  const PORT = new Set([606, 608, 610, 612, 614]);
  const COLS = 8, TW = 196, TH = 110, G = 10;
  const wall = mk(D, `<div style="position:relative;width:${COLS * (TW + G) - G}px;height:${5 * (TH + G) - G}px">${ALL.map((id, i) => `<div class="wc" style="position:absolute;left:${(i % COLS) * (TW + G)}px;top:${Math.floor(i / COLS) * (TH + G)}px;width:${TW}px;height:${TH}px;border-radius:6px;overflow:hidden;background:#111;border:1px solid rgba(233,236,239,.12)">
      <img src="${mediaPoster(id)}" style="width:100%;height:100%;object-fit:${PORT.has(id) ? 'contain' : 'cover'};display:block;background:#0a0b0d">
      <div class="ok" style="position:absolute;right:6px;bottom:6px;padding:2px 8px;border-radius:5px;background:${GOLD};font:700 11px 'Geist Mono';color:#0A0B0D;opacity:0">${TEXT("S07.text001")}</div>
      <div style="position:absolute;left:6px;top:5px;font:600 11px 'Geist Mono';color:rgba(255,255,255,.75);text-shadow:0 1px 3px #000">#${TEXT_GLOBAL(id)}</div></div>`).join('')}</div>`, 830, 520, { ax: .5, ay: .5 });
  const wcs = [...wall.querySelectorAll('.wc')], oks = [...wall.querySelectorAll('.ok')];
  const upT = mk(D, `<div style="display:flex;align-items:baseline;gap:20px"><span style="${HV(64, SILVER, 4)}">${TEXT("S07.text002")}</span><span style="${AN(64, SILVER, 2)};text-transform:none;${METAL}">${TEXT("S07.text003")}</span></div>`, 140, 150, { ax: 0, ay: .5 });
  
  const k1 = kwCard(sc.top, 1, 3, TEXT("S07.text004"), '#2F7BFF', '#0A0B0D', 'sparkle', RAW_TEXT("S07.text005"));
  const k2 = kwCard(sc.top, 2, 3, TEXT("S07.text006"), '#0A0B0D', '#F5B92E', 'target', RAW_TEXT("S07.text007"));
  const k3 = kwCard(sc.top, 3, 3, TEXT("S07.text008"), '#E9ECEF', '#0A0B0D', 'layers', RAW_TEXT("S07.text009"));
  k2._w.style.cssText += `;${GOLDF}`;
  k3._w.style.top = '26%'; k3._w.style.fontSize = '170px'; k3._w.nextElementSibling.style.display = 'none'; k3._ic.style.display = 'none';
  
  const PAIRS = [['ls605', 'pt606', RAW_TEXT("S07.text010")], ['ls611', 'pt612', RAW_TEXT("S07.text011")], ['ls609', 'pt610', RAW_TEXT("S07.text012")]];
  const rf = mk(k3.firstChild, `<div style="position:absolute;left:0;top:0;width:1920px;height:1080px"></div>`, 0, 0);
  const RF = rf.firstChild; place(rf, { o: 1 });
  const morph = document.createElement('div'); morph.style.cssText = 'position:absolute;border-radius:14px;overflow:hidden;background:#000;box-shadow:0 30px 80px rgba(0,0,0,.35);outline:4px solid #0A0B0D';
  morph.innerHTML = '<img class="a" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><img class="b" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">';
  RF.appendChild(morph); const mA = morph.querySelector('.a'), mB = morph.querySelector('.b');
  const side = PAIRS.map((pp, i) => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;border-radius:10px;overflow:hidden;background:#000;outline:3px solid #0A0B0D'; d.innerHTML = '<img style="width:100%;height:100%;object-fit:cover;display:block">'; RF.appendChild(d); return { el: d, img: d.firstChild }; });
  const rl = document.createElement('div'); rl.style.cssText = `position:absolute;${MONO(18, '#0A0B0D', 4)}`; RF.appendChild(rl);
  const rotL = document.createElement('div'); rotL.style.cssText = `position:absolute;${AN(44, '#0A0B0D', 2)}`; RF.appendChild(rotL);
  
  const CATS = [[RAW_TEXT("S07.text013"), RAW_TEXT("S07.text014"), 'd605', 90, 605], [RAW_TEXT("S07.text015"), RAW_TEXT("S07.text016"), 'd587', 48, 587], [RAW_TEXT("S07.text017"), RAW_TEXT("S07.text018"), 'd596', 72, 596], [RAW_TEXT("S07.text019"), RAW_TEXT("S07.text020"), 'd616', 48, 616]];
  const catPos = [[520, 300], [1180, 300], [520, 690], [1180, 690]];
  const cats = CATS.map(([n, en], i) => {
    const e = mk(D, `<div style="position:relative;width:620px;height:349px;border-radius:14px;overflow:hidden;border:1.5px solid rgba(233,236,239,.18);background:#000;box-shadow:0 26px 70px rgba(0,0,0,.6)">
        <img style="width:100%;height:100%;object-fit:cover;display:block">
        <div style="position:absolute;left:0;right:0;bottom:0;height:110px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.85))"></div>
        <div style="position:absolute;left:22px;bottom:18px"><div style="${MONO(14, i === 2 ? GOLD : DIM, 4)}">${TEXT("S07.text021")}${i + 1} · ${TEXT_GLOBAL(en)}</div><div style="${HV(46, SILVER, 2)}">${TEXT_GLOBAL(n)}</div></div>
        <div style="position:absolute;right:16px;top:14px;padding:3px 10px;border-radius:6px;background:rgba(5,6,8,.7);${MONO(13, SILVER, 1)}">${TEXT_GLOBAL([10, 8, 12, 8][i])} ${TEXT("S07.text022")}</div></div>`, 0, 0, { ax: .5, ay: .5 });
    e._img = e.querySelector('img'); return e;
  });
  const newT = mk(D, `<div style="${MONO(20, BLUE2, 6)}">${TEXT("S07.text023")}</div>`, 850, 108, { ax: .5, ay: .5 });
  
  const KN = [593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604];
  const KW = 400, KH = 225, KG = 14;
  const grid = KN.map((id, i) => vcard(D, KW, KH, { r: 8, badge: '#' + id }));
  const knT = mk(D, `<div style="display:flex;align-items:baseline;gap:22px"><span style="${HV(70, SILVER, 4)}">${TEXT("S07.text024")}</span><span style="${MONO(20, GOLD, 5)}">${TEXT("S07.text025")}</span></div>`, 130, 112, { ax: 0, ay: .5 });
  
  const INDS = [[RAW_TEXT("S07.text026"), .8], [RAW_TEXT("S07.text027"), .65], [RAW_TEXT("S07.text028"), .45], [RAW_TEXT("S07.text029"), .35], [RAW_TEXT("S07.text030"), .55], [RAW_TEXT("S07.text031"), .3]];
  const inds = INDS.map(([n, v], i) => mk(D, `<div style="display:flex;align-items:center;gap:18px;width:420px"><span class="chip" style="width:120px;justify-content:center;font-size:22px;text-transform:none;letter-spacing:2px">${TEXT_GLOBAL(n)}</span>
      <div style="flex:1;height:10px;border-radius:5px;background:#1d2128;overflow:hidden"><div class="iv" data-v="${v}" style="height:100%;width:0;background:linear-gradient(90deg,${BLUE},${GOLD})"></div></div><span style="${MONO(13, DIM, 2)};width:110px">${TEXT("S07.text032")}</span></div>`, 1250, 340 + i * 62, { ax: 0, ay: .5 }));
  const indT = mk(D, `<div style="display:flex;flex-direction:column;gap:6px"><span style="${HV(56, SILVER, 4)}">${TEXT("S07.text033")}</span><span style="${HV(56, GOLD, 4)};${GOLDF}">${TEXT("S07.text034")}</span><span style="${MONO(16, DIM, 4)}">${TEXT("S07.text035")}</span></div>`, 1250, 170, { ax: 0, ay: .5 });

  sc.update = t => {
    
    const wOn = false;
    place(wall, { o: wOn ? 1 : 0, s: .92 + (t - T0) * .012 });
    if (wOn) wcs.forEach((w, i) => {
      const cx = (i % COLS) - (COLS - 1) / 2, cy = Math.floor(i / COLS) - 2, d = Math.hypot(cx, cy);
      const k = pr(t, T0 + d * .05, T0 + .35 + d * .05);
      w.style.opacity = k.toFixed(2); w.style.transform = `scale(${(.6 + .4 * EZ.spring(k)).toFixed(3)})`;
      const scan = T0 + .6 + ((i % COLS) / COLS) * .7;
      oks[i].style.opacity = pr(t, scan, scan + .1).toFixed(2);
      w.style.borderColor = t > scan ? 'rgba(245,185,46,.6)' : 'rgba(233,236,239,.12)';
    });

    
    kwAt(k1, t, K1, K2); kwAt(k2, t, K2, K3); kwAt(k3, t, K3, K4);
    if (t >= K3 && t < K4) {
      
      const rp = EZ.inout(pr(t, tRot + .3, tSmooth - .1)), w = lerp(720, 330, rp), h = lerp(405,587,rp),cx=USER_INPUT.layout==='portrait'?540:960,cy=USER_INPUT.layout==='portrait'?860:610;
      morph.style.left = (cx - w / 2).toFixed(1) + 'px'; morph.style.top = (cy - h / 2).toFixed(1) + 'px'; morph.style.width = w.toFixed(1) + 'px'; morph.style.height = h.toFixed(1) + 'px';
      morph.style.transform = `rotate(${(Math.sin(Math.PI * rp) * -8).toFixed(2)}deg)`;
      setFrame(mA, seqAt(PAIRS[0][0], 90, 30, t, K3)); setFrame(mB, seqAt(PAIRS[0][1], 90, 30, t, K3));
      mB.style.opacity = clamp((rp - .35) / .3).toFixed(2);
      rotL.textContent = rp > .5 ? '9:16' : '16:9'; rotL.style.left = (cx - 40).toFixed(1) + 'px'; rotL.style.top = (cy + h / 2 + 18).toFixed(1) + 'px';
      
      [[PAIRS[1][0],440,248,330,USER_INPUT.layout==='portrait'?1350:610,90],[PAIRS[2][1],250,444,USER_INPUT.layout==='portrait'?830:1600,USER_INPUT.layout==='portrait'?1390:610,90]].forEach(([dir, ww, hh, x, y, n], i) => {
        const k = pr(t, tRot + .1 + i * .12, tRot + .45 + i * .12), d = side[i];
        d.el.style.left = (x - ww / 2).toFixed(1) + 'px'; d.el.style.top = (y - hh / 2 + (1 - EZ.spring(k)) * 60).toFixed(1) + 'px'; d.el.style.width = ww + 'px'; d.el.style.height = hh + 'px'; d.el.style.opacity = clamp(k * 3).toFixed(2);
        setFrame(d.img, seqAt(dir, n, 30, t, K3));
      });
      side[2].el.style.display = 'none';
      rl.textContent = RAW_TEXT("S07.text036"); rl.style.left='72px';rl.style.top=USER_INPUT.layout==='portrait'?'1770px':'1000px';if(USER_INPUT.layout==='portrait')rl.style.fontSize='26px';
    }
    sc.hudO = t >= K1 && t < K4 ? 0 : 1;
    
    const cOut = pr(t, tKn - .3, tKn - .05);
    cats.forEach((c, i) => {
      const t0 = K4 + .05 + i * .14, k = pr(t, t0, t0 + .45), [x, y] = catPos[i];
      const from = [[-400, -300], [400, -300], [-400, 300], [400, 300]][i];
      const zoom = i === 2 ? EZ.inout(pr(t, tKn - .35, tKn)) : 0;
      place(c, { x: x + from[0] * (1 - EZ.out(k)) + (960 - x) * zoom, y: y + from[1] * (1 - EZ.out(k)) + (540 - y) * zoom, o: clamp(k * 3) * (i === 2 ? 1 - pr(t, tKn, tKn + .15) : 1 - cOut), s: 1 + zoom * 1.4 });
      if (k > 0 && t < tKn + .2) setFrame(c._img, seqAt(CATS[i][2], CATS[i][3], 30, t, t0));
    });
    show(newT, t, K4 + .1, { k: 'blur', d: .45, out: tKn - .3 });
    
    const gOut = pr(t, tInd - .3, tInd + .2);
    grid.forEach((g, i) => {
      const r = Math.floor(i / 4), cIdx = i % 4, k = pr(t, tKn + (r + cIdx) * .05, tKn + .4 + (r + cIdx) * .05);
      const x0 = 960 + (cIdx - 1.5) * (KW + KG), y0 = 520 + (r - 1) * (KH + KG);
      const side = EZ.inout(gOut);
      const x = lerp(x0, 150 + 110 + cIdx * 230, side), y = lerp(y0, 330 + r * 140, side);
      place(g, { x, y, o: clamp(k * 3), s: (.85 + .15 * EZ.out(k)) * lerp(1, .5, side) });
      if (k > 0) vseq(g, 'd' + KN[i], 72, t, tKn + i * .07);
    });
    show(knT, t, tKn - .05, { k: 'mask', d: .45, out: tInd - .3 });
    
    show(indT, t, tInd - .1, { k: 'mask', d: .45 });
    inds.forEach((e, i) => {
      show(e, t, tCus - .3 + i * .1, { k: 'right', d: .4, dist: 80 });
      const iv = e.querySelector('.iv'); iv.style.width = (EZ.out(pr(t, tSoon - .2 + i * .08, tSoon + .9 + i * .08)) * +iv.dataset.v * 100).toFixed(1) + '%';
    });
  };
  sc.cam = t => { const [sx, sy] = shake(t, T0, .4, 22); return { x: 960, y: 540, z: 1 + beatPulse(t, true) * .006, sx, sy }; };
  const U = sc.update; sc.update = t => {
    U(t);
    fxDraw(c => {
      
      const sp = pr(t, T0 + .55, T0 + 1.35);
      if (sp > 0 && sp < 1) { const x = lerp(860 - 830, 860 + 830, sp); const g = c.createLinearGradient(x - 120, 0, x + 6, 0); g.addColorStop(0, 'rgba(245,185,46,0)'); g.addColorStop(1, 'rgba(255,220,140,.55)'); c.fillStyle = g; c.fillRect(x - 120, 180, 126, 640); c.fillStyle = 'rgba(255,240,200,.9)'; c.fillRect(x, 180, 3, 640); }
    });
  };
  tFlash(T0, .85, .24); tGlitch(K1, .2); tGlitch(K2, .2); tGlitch(K3, .2); tBlocks(K4, BG, .4, 2);
  SOURCE_S("S07.sound000",T0, 'hit', 1); SOURCE_S("S07.sound001",T0 + .1, 'whoosh', .5); SOURCE_S("S07.sound002",T0 + .6, 'tick_run', .4, 0, { d: .8 }); SOURCE_S("S07.sound003",T0 + 1.3, 'shine', .5);
  [K1, K2, K3].forEach((k, i) => { SOURCE_S("S07.sound004",k, 'hit', .9, [-.3, .3, 0][i]); SOURCE_S("S07.sound005",k, 'glitch', .4); }); SOURCE_S("S07.sound006",tRot + .35, 'slide', .5, 0, { d: .5 });
  SOURCE_S("S07.sound007",K4, 'whoosh', .55); [0, 1, 2, 3].forEach(i => SOURCE_S("S07.sound008",K4 + .05 + i * .14, 'card', .45, [-.5, .5, -.5, .5][i])); SOURCE_S("S07.sound009",tKn - .3, 'swoosh', .5); SOURCE_S("S07.sound010",tKn, 'pop', .4);
  SOURCE_S("S07.sound011",tInd - .25, 'whoosh', .5); INDS.forEach((_, i) => SOURCE_S("S07.sound012",tCus - .3 + i * .1, 'tick', .35, .5)); SOURCE_S("S07.sound013",tSoon, 'fill', .35, .5, { d: 1 });
})();
