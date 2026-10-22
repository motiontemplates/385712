
const BG = '#050607', INK = '#0B0C0E', SILVER = '#E9ECEF', BLUE = '#2F7BFF', BLUE2 = '#7DB2FF', GOLD = '#F5B92E', GOLD2 = '#FFD86B',
  DIM = 'rgba(233,236,239,.34)', DIM2 = 'rgba(233,236,239,.16)', RED = '#FF4D3D', PURPLE = '#7659E8', LAV = '#A78AFF';

const TM = window.TM, TINS = TM.INS;
function O(t) { let c = 0; for (const [cf, n] of TINS) if (t * 60 >= cf - 1e-6) c += n; return t + c / 60; }
function TALKT(t) { let c = 0; for (const [cf, n] of TINS) { const s = cf / 60 + c / 60; if (t < s) break; if (t < s + n / 60) return cf / 60 - 1 / 60; c += n; } return t - c / 60; }
const BR = {}; for (const k of 'ABCDF') BR[k] = [TM[k][0], TM[k][0] + TM[k][1]];
const inBR = t => Object.values(BR).some(([a, b]) => t >= a - 1e-4 && t < b);
const TALK_END = TM.TALK_END;
const END_T = window.MUSIC.end;


const AN = (size, col = SILVER, ls = 0) => `font:400 ${size}px/0.9 'Anton',sans-serif;letter-spacing:${ls}px;color:${col};text-transform:uppercase`;
const HV = (size, col = SILVER, ls = -2) => `font:${USER_INPUT.language==='en'?400:900} ${size}px/1.04 '${USER_INPUT.language==='en'?'Anton':'PuHuiTi'}','PingFang SC',sans-serif;letter-spacing:${ls}px;color:${col}`;
const ZH = (size, col = SILVER, w = 600, ls = 0) => `font:${w} ${size}px/1.2 -apple-system,'PingFang SC',sans-serif;letter-spacing:${ls}px;color:${col}`;
const MONO = (size, col = DIM, ls = 3) => `font:500 ${size}px 'Geist Mono','PingFang SC',monospace;color:${col};letter-spacing:${ls}px;text-transform:uppercase`;
const GE = (size, col = SILVER, w = 600) => `font:${w} ${size}px/1.1 'Geist',-apple-system,'PingFang SC',sans-serif;color:${col}`;

const METAL = `background:linear-gradient(180deg,#FFFFFF 0%,#E2E6EA 45%,#9AA2AA 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 6px 0 rgba(0,0,0,.55)) drop-shadow(0 18px 30px rgba(0,0,0,.6))`;
const GOLDF = `background:linear-gradient(180deg,#FFE58A 0%,#F5B92E 55%,#C98A10 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 6px 0 rgba(40,20,0,.6)) drop-shadow(0 18px 34px rgba(245,185,46,.28))`;
const BLUEF = `background:linear-gradient(180deg,#BFD9FF 0%,#4F95FF 50%,#1F5FE0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 6px 0 rgba(0,10,40,.6)) drop-shadow(0 16px 36px rgba(47,123,255,.35))`;


const BEATS = window.MUSIC.beats, HITS = window.MUSIC.hits;
const HIT = n => HITS.find(h => h[1] === n)[0];
function beatPulse(t, onlyDown = false) {
  let v = 0;
  for (let i = BEATS.length - 1; i >= 0; i--) {
    const b = BEATS[i]; if (b[0] > t) continue; const dt = t - b[0]; if (dt > .6) break;
    if (onlyDown && !b[1]) continue;
    v = Math.max(v, Math.exp(-dt * 10) * (b[1] ? 1 : .5));
  }
  return v;
}
function beatIdx(t) { let lo = 0, hi = BEATS.length; while (lo < hi) { const m = (lo + hi) >> 1; if (BEATS[m][0] <= t) lo = m + 1; else hi = m; } return lo; }

function snap(t, onlyDown = false) { let best = t, d = 9; for (const b of BEATS) { if (onlyDown && !b[1]) continue; const e = Math.abs(b[0] - t); if (e < d) { d = e; best = b[0]; } } return best; }
function nextBeat(t, onlyDown = false) { for (const b of BEATS) if (b[0] >= t - 1e-3 && (!onlyDown || b[1])) return b[0]; return t; }


function TX(parent, html, x, y, style, opt = {}) { return mk(parent, `<div style="${style}">${html}</div>`, x, y, Object.assign({ ax: 0, ay: .5 }, opt)); }
function typeAt(el, txt, t, t0, cps = 30) { const n = Math.floor(clamp((t - t0) * cps, 0, txt.length)); const s = txt.slice(0, n); if (el._ts !== s) { el._ts = s; el.textContent = s; } return n; }
function setTxt(el, s) { if (el._tx !== s) { el._tx = s; el.textContent = s; } }
const ICON = (name, size = 40, sw = 1.8, col = 'currentColor') => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${(MK.ICONS[name] || '<circle cx="12" cy="12" r="3"/>')}</svg>`;
const easeOutBack = (x, s = 1.7) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
const smooth = x => x * x * (3 - 2 * x);

const env = (t, a, b, di = .3, dout = .3) => Math.min(EZ.out(pr(t, a, a + di)), 1 - EZ.in(pr(t, b - dout, b)));


function SC(s, e, bg, label, opt = {}) {
  const sc = new Scene(s, e, bg || BG, opt); sc.id=window.CURRENT_UNIT; sc.label = USER_INPUT.titles[sc.id] || "";
  sc.top = document.createElement('div'); sc.top.className = 'layer'; sc.top.style.display = 'none'; $('top').appendChild(sc.top);
  sc.el.dataset.unit=sc.id;sc.el.dataset.nativeLayer='content';sc.top.dataset.unit=sc.id;sc.top.dataset.nativeLayer='overlay';
  if (!opt.noGrid) stageBG(sc, opt.gridOpt || {});
  return sc;
}

function stageBG(sc, opt = {}) {
  const g = document.createElement('div');
  const gap = opt.gap || 64, a = opt.a == null ? .045 : opt.a;
  g.style.cssText = `position:absolute;inset:-200px;background-image:linear-gradient(rgba(233,236,239,${a}) 1px,transparent 1px),linear-gradient(90deg,rgba(233,236,239,${a}) 1px,transparent 1px);background-size:${gap}px ${gap}px;background-position:-1px -1px`;
  sc.el.appendChild(g); sc.gridEl = g;
  return g;
}

function gridAt(sc, x = 0, y = 0) { if (sc.gridEl) sc.gridEl.style.transform = `translate(${(x % 64).toFixed(1)}px,${(y % 64).toFixed(1)}px)`; }


const FXB = $('fxb').getContext('2d'), FXC = $('fxc').getContext('2d'), FXT = $('fxt').getContext('2d');
const FXQ = [];                       
function fxDraw(fn, top = false) { FXQ.push([fn, top, window.ACTIVE_NATIVE_UNIT]); }


function sparks(ctx, t, t0, x, y, opt = {}) {
  const n = opt.n || 40, life = opt.life || .7, dir = opt.dir == null ? -Math.PI / 2 : opt.dir, spread = opt.spread || 1.6,
    sp = opt.speed || 900, g = opt.g == null ? 1400 : opt.g, col = opt.col || '255,206,120', seed = opt.seed || 1, rate = opt.rate || 0;
  const emit = rate ? Math.max(0, Math.floor((t - t0) * rate)) : n;
  for (let i = 0; i < (rate ? Math.min(emit, n) : n); i++) {
    const born = rate ? t0 + i / rate : t0, age = t - born - hash(i * 7.1 + seed) * (rate ? 0 : .06);
    const L = life * (.5 + hash(i * 3.3 + seed) * .7);
    if (age <= 0 || age > L) continue;
    const a = dir + (hash(i * 1.7 + seed) - .5) * spread, v = sp * (.35 + hash(i * 9.1 + seed) * .9);
    const px = (opt.px ? opt.px(born) : x) + Math.cos(a) * v * age, py = (opt.py ? opt.py(born) : y) + Math.sin(a) * v * age + .5 * g * age * age;
    const vx = Math.cos(a) * v, vy = Math.sin(a) * v + g * age, sp2 = Math.hypot(vx, vy) * .018;
    const k = 1 - age / L;
    ctx.strokeStyle = `rgba(${col},${(k * .95).toFixed(3)})`; ctx.lineWidth = 1.2 + k * 1.6;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - vx / Math.hypot(vx, vy) * sp2, py - vy / Math.hypot(vx, vy) * sp2); ctx.stroke();
  }
}

function glow(ctx, x, y, r, col = '255,226,160', a = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(.18, `rgba(${col},${a * .9})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.restore();
}

function stars(ctx, t, n, o = 1, seed = 3, col = '90,150,255') {
  if(USER_INPUT.layout==='portrait'){ctx.save();ctx.setTransform(1,0,0,1,0,0);}
  for (let i = 0; i < n; i++) {
    const x = hash(i * 1.31 + seed) * CONFIG.width, y = hash(i * 2.77 + seed) * CONFIG.height, tw = .5 + .5 * Math.sin(t * (1.5 + hash(i) * 3) + i);
    const r = 1 + hash(i * 5.3) * 2.2;
    ctx.fillStyle = `rgba(${col},${(o * tw * (.35 + hash(i * 4.1) * .65)).toFixed(3)})`; ctx.fillRect(x, y, r, r);
  }
  if(USER_INPUT.layout==='portrait')ctx.restore();
}

function halftone(ctx, t, cx, cy, p, k = 1, col = '210,222,236', gap = 22) {
  const portrait=USER_INPUT.layout==='portrait';if(portrait){const m=ctx.getTransform(),x=cx*m.a+cy*m.c+m.e,y=cx*m.b+cy*m.d+m.f;cx=x;cy=y;ctx.save();ctx.setTransform(1,0,0,1,0,0);}
  const R0 = lerp(0, 760, EZ.out(p)), R1 = R0 + 900;
  for (let y = gap / 2; y < CONFIG.height; y += gap) for (let x = gap / 2; x < CONFIG.width; x += gap) {
    const d = Math.hypot(x - cx, (y - cy) * 1.25); if (d < R0 * .55 || d > R1) continue;
    const u = clamp((d - R0 * .55) / (R0 * .5 + 1)), v = 1 - clamp((d - R0) / 900);
    const r = gap * .42 * Math.min(u, v) * k; if (r < .4) continue;
    ctx.fillStyle = `rgba(${col},${(.85 * Math.min(u, v) * k).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
  }
  if(portrait)ctx.restore();
}


function chars(parent, txt, x, y, style, opt = {}) {
  const e = mk(parent, `<div style="${style};white-space:nowrap">${[...txt].map(c => `<span style="display:inline-block;${opt.cst || ''}">${c === ' ' ? '&nbsp;' : TEXT_GLOBAL(c)}</span>`).join('')}</div>`, x, y, Object.assign({ ax: 0, ay: .5 }, opt));
  e._c = [...e.firstChild.children]; return e;
}
function charsAt(e, t, times, opt = {}) {
  let any = false; const k = opt.k || 'slam';
  e._c.forEach((c, i) => {
    const t0 = Array.isArray(times) ? times[Math.min(i, times.length - 1)] : times + i * (opt.stag || .04), x = pr(t, t0, t0 + (opt.d || .22));
    let o = clamp(x * 5);
    const ot = opt.out != null ? pr(t, opt.out + i * (opt.os || .02), opt.out + i * (opt.os || .02) + .22) : 0;
    o *= 1 - ot; if (o > 0) any = true;
    let tf = '';
    if (k === 'slam') tf = `scale(${(1 + (1 - EZ.out5(x)) * 1.6).toFixed(3)})`;
    if (k === 'up') tf = `translateY(${((1 - EZ.expo(x)) * 80).toFixed(1)}px)`;
    if (k === 'drop') tf = `translateY(${((1 - EZ.out5(x)) * -140).toFixed(1)}px)`;
    if (k === 'mask') { c.style.clipPath = `inset(${((1 - EZ.expo(x)) * 100).toFixed(1)}% 0 -10% 0)`; tf = `translateY(${((1 - EZ.expo(x)) * 50).toFixed(1)}px)`; o = x > 0 ? 1 - ot : 0; }
    if (ot > 0) tf += ` translateY(${(-EZ.in(ot) * 50).toFixed(1)}px)`;
    c.style.transform = tf; c.style.opacity = o.toFixed(3);
    c.style.filter = x < 1 && k !== 'mask' ? `blur(${((1 - x) * 8).toFixed(1)}px)` : '';
  });
  place(e, { o: any ? 1 : 0, x: opt.x, y: opt.y, s: opt.s, r: opt.r });
}

const GLY = '#%&*+=<>/\\|_█▓▒░▚▞◆◇○●□■';   
function scrambleAt(el, txt, t, t0, dur = .5) {
  const n = txt.length, x = pr(t, t0, t0 + dur), j = Math.floor(t * 30);
  let s = '';
  for (let i = 0; i < n; i++) { const ti = i / n; s += x >= 1 || x > ti + .25 ? txt[i] : (x > ti ? GLY[Math.floor(hash(i * 13 + j) * GLY.length)] : (txt[i] === ' ' ? ' ' : '')); }
  setTxt(el, s);
}


function glitchText(parent, html, x, y, style, opt = {}) {
  const e = mk(parent, `<div style="position:relative;white-space:nowrap">
     <div class="g1" style="${style};position:absolute;left:0;top:0;mix-blend-mode:screen;-webkit-text-fill-color:#FF3B3B;filter:none;background:none">${html}</div>
     <div class="g2" style="${style};position:absolute;left:0;top:0;mix-blend-mode:screen;-webkit-text-fill-color:#2FD0FF;filter:none;background:none">${html}</div>
     <div class="g0" style="${style};position:relative">${html}</div></div>`, x, y, Object.assign({ ax: .5, ay: .5 }, opt));
  e._g1 = e.querySelector('.g1'); e._g2 = e.querySelector('.g2'); e._g0 = e.querySelector('.g0'); return e;
}
function glitchAt(e, t, t0, opt = {}) {
  const x = pr(t, t0, t0 + (opt.d || .4)); let k = 1 - EZ.out(x);
  if (opt.out != null) k = Math.max(k, EZ.in(pr(t, opt.out, opt.out + .25)));
  if (opt.pulse) k = Math.max(k, opt.pulse);
  let o = x > 0 ? 1 : 0; if (opt.out != null) o *= 1 - pr(t, opt.out + .15, opt.out + .28);
  const j = Math.floor(t * 30);
  const dx = k * (hash(j) - .5) * (opt.amp || 60), dy = k * (hash(j + 7) - .5) * 10;
  e._g1.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`; e._g2.style.transform = `translate(${(-dx).toFixed(1)}px,${(-dy).toFixed(1)}px)`;
  e._g1.style.opacity = e._g2.style.opacity = (k * .9).toFixed(2);
  e._g0.style.clipPath = k > .05 ? `inset(${(hash(j + 3) * 45 * k).toFixed(0)}% 0 ${(hash(j + 5) * 45 * k).toFixed(0)}% 0)` : 'none';
  e._g0.style.transform = k > .05 ? `translateX(${((hash(j + 11) - .5) * 30 * k).toFixed(1)}px)` : '';
  place(e, { o, x: opt.x, y: opt.y, s: (opt.s || 1) * (1 + k * .04), r: opt.r });
}


function dimLine(parent, x1, y1, x2, y2, label, col = DIM, opt = {}) {
  const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const flip = ang > 90 || ang < -90;
  const e = mk(parent, `<div style="position:relative;width:${L}px;height:2px">
     <div class="a" style="position:absolute;left:0;top:0;height:1.5px;width:50%;background:${col};transform-origin:100% 50%"></div>
     <div class="b" style="position:absolute;right:0;top:0;height:1.5px;width:50%;background:${col};transform-origin:0 50%"></div>
     <div class="c1" style="position:absolute;left:0;top:-11px;width:1.5px;height:24px;background:${col}"></div>
     <div class="c2" style="position:absolute;right:0;top:-11px;width:1.5px;height:24px;background:${col}"></div>
     <div class="lb" style="position:absolute;left:50%;top:0;transform:translate(-50%,-50%) rotate(${flip ? 180 : 0}deg);padding:0 14px;background:${opt.bg || BG};${MONO(opt.fs || 22, opt.lc || SILVER, 1)};white-space:nowrap">${label}</div></div>`,
    x1, y1, { ax: 0, ay: .5 });
  e._a = e.querySelector('.a'); e._b = e.querySelector('.b'); e._c1 = e.querySelector('.c1'); e._c2 = e.querySelector('.c2'); e._lb = e.querySelector('.lb'); e._ang = ang;
  e.style.transformOrigin = '0 50%';
  return e;
}
function dimAt(e, t, t0, opt = {}) {
  const x = EZ.expo(pr(t, t0, t0 + (opt.d || .45)));
  let o = x > 0 ? 1 : 0; if (opt.out != null) o *= 1 - pr(t, opt.out, opt.out + .2);
  e._a.style.transform = e._b.style.transform = `scaleX(${x.toFixed(3)})`;
  e._c1.style.opacity = e._c2.style.opacity = pr(t, t0 + .25, t0 + .35).toFixed(2);
  e._lb.style.opacity = pr(t, t0 + .05, t0 + .2).toFixed(2);
  e.style.transform = `translate(${e._x.toFixed(1)}px,${e._y.toFixed(1)}px) translateY(-50%) rotate(${e._ang.toFixed(2)}deg)`;
  e.style.opacity = o.toFixed(3); e.style.visibility = o > .002 ? 'visible' : 'hidden';
}


function flipNum(parent, digits, x, y, size, style = METAL) {
  const cells = [...digits].map(ch => /\d/.test(ch)
    ? `<span class="fd" style="display:inline-block;position:relative;width:.56em;height:1em;overflow:hidden;vertical-align:top"><span class="ro" style="position:absolute;left:0;top:0;display:block;line-height:1">${'0123456789'.split('').map(d => `<span style="display:block;height:1em;text-align:center;${style}">${d}</span>`).join('')}</span></span>`
    : `<span style="display:inline-block;height:1em;vertical-align:top;line-height:1;${style}">${ch}</span>`).join('');
  const e = mk(parent, `<div style="${AN(size)};line-height:1;white-space:nowrap">${cells}</div>`, x, y, { ax: .5, ay: .5 });
  e._ro = [...e.querySelectorAll('.ro')]; e._digits = [...digits].filter(c => /\d/.test(c)).map(Number); return e;
}

function flipAt(e, t, t0, dur = 1.2, opt = {}) {
  const n = e._ro.length;
  e._ro.forEach((r, i) => {
    const d0 = t0 + (n - 1 - i) * .06, x = pr(t, d0, d0 + dur * (.55 + .45 * (i + 1) / n));
    const spins = (n - i) * 1.0, tgt = e._digits[i];
    const v = (EZ.out5(x) * (spins * 10 + tgt)) % 10;
    r.style.transform = `translateY(${(-v).toFixed(3)}em)`;
    r.style.filter = x > 0 && x < .85 ? `blur(${((1 - x) * 3).toFixed(1)}px)` : '';
  });
  place(e, { o: opt.o == null ? (t >= t0 ? 1 : 0) : opt.o, x: opt.x, y: opt.y, s: opt.s });
}


function svgPath(parent, d, w, h, col = SILVER, sw = 6, opt = {}) {
  const id = 'g' + Math.floor(hash(d.length + w) * 1e6);
  const e = mk(parent, `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible">
    <defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${opt.blur || 6}"/></filter></defs>
    <path class="gl" d="${d}" fill="none" stroke="${opt.glow || col}" stroke-width="${sw * 2.4}" stroke-linecap="round" stroke-linejoin="round" filter="url(#${id})" opacity=".55"/>
    <path class="p" d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
    ${opt.hi ? `<path class="hi" d="${d}" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="${Math.max(1, sw * .28)}" stroke-linecap="round" stroke-linejoin="round" transform="translate(0,-${sw * .22})"/>` : ''}
  </svg>`, opt.x || 0, opt.y || 0, { ax: 0, ay: 0 });
  e._p = [...e.querySelectorAll('path')]; e._len = e._p[0].getTotalLength(); e._path = e._p[1];
  return e;
}

function pathAt(e, p, o = 1) {
  const L = e._len || (e._len = e._path.getTotalLength());
  e._p.forEach(q => { q.style.strokeDasharray = `${L} ${L}`; q.style.strokeDashoffset = (L * (1 - p)).toFixed(1); });
  place(e, { o });
  const pt = e._path.getPointAtLength(L * clamp(p));
  return [e._x + pt.x, e._y + pt.y];
}


const TK = (() => {
  const L = $('tkL');
  const e = mk(L, `<div style="position:relative">
     <div class="tk" style="position:relative;overflow:hidden;background:#0d0f12"><img style="position:absolute;display:block;max-width:none"><div class="tint" style="position:absolute;inset:0;pointer-events:none"></div></div>
     <div class="fr" style="position:absolute;inset:0;pointer-events:none;border:1.5px solid rgba(233,236,239,.22)"></div>
     <div class="cr" style="position:absolute;inset:-12px;pointer-events:none">
       ${[['left', 'top'], ['right', 'top'], ['left', 'bottom'], ['right', 'bottom']].map(([a, b]) => `<i style="position:absolute;${a}:0;${b}:0;width:20px;height:20px;border-${a}:2px solid ${SILVER};border-${b}:2px solid ${SILVER}"></i>`).join('')}</div>
     <div class="lab" style="position:absolute;left:0;top:-38px;${MONO(15, SILVER, 2)};white-space:nowrap"><span class="dot" style="color:${RED}">●</span> ${TEXT_GLOBAL(USER_INPUT.presenterLabel)} &nbsp;<span class="dim" style="color:${DIM}"></span></div>
     <div class="ring" style="position:absolute;inset:-9px;border-radius:50%;border:2px solid ${SILVER};opacity:0"></div></div>`, 0, 0, { ax: .5, ay: .5 });
  e._box = e.querySelector('.tk'); e._img = e.querySelector('img'); e._cr = e.querySelector('.cr'); e._lab = e.querySelector('.lab'); e._dim = e.querySelector('.dim');
  e._fr = e.querySelector('.fr'); e._ring = e.querySelector('.ring'); e._dot = e.querySelector('.dot'); e._tint = e.querySelector('.tint');
  return e;
})();
const POS = {
  R: { x: 1488, y: 492, w: 560, h: 760, r: 4 },         
  RS: { x: 1580, y: 470, w: 420, h: 600, r: 4 },        
  L: { x: 432, y: 492, w: 560, h: 760, r: 4 },
  LS: { x: 340, y: 470, w: 420, h: 600, r: 4 },
  C: { x: 960, y: 470, w: 600, h: 780, r: 4 },
  TR: { x: 1700, y: 236, w: 260, h: 260, r: 130 }, TL: { x: 220, y: 236, w: 260, h: 260, r: 130 },
  BR: { x: 1700, y: 760, w: 260, h: 260, r: 130 }, BL: { x: 220, y: 760, w: 260, h: 260, r: 130 },
  TC: { x: 960, y: 210, w: 230, h: 230, r: 115 },
  RT: { x: 1555, y: 540, w: 640, h: 880, r: 4 },        
  OFF: { x: 2400, y: 540, w: 560, h: 760, r: 4 },
};
let TKF = [];          
const posOf = p => typeof p === 'string' ? POS[p] : p;
function tkState(t) {
  let i = 0; while (i < TKF.length - 1 && TKF[i + 1][0] <= t) i++;
  const k = TKF[i], p = i ? TKF[i - 1] : k, A = posOf(p[1]), B = posOf(k[1]);
  const x = k[2] > 0 ? EZ.inout(pr(t, k[0], k[0] + k[2])) : 1;
  const s = {}; for (const key of ['x', 'y', 'w', 'h', 'r']) s[key] = lerp(A[key], B[key], x);
  const ra = (p[4] && p[4].tilt) || 0, rb = (k[4] && k[4].tilt) || 0; s.tilt = lerp(ra, rb, x);
  
  s.kick = Math.sin(Math.PI * x) * (k[2] > .3 ? .03 : 0);
  s.o = k[3] ? (p[3] ? 1 : EZ.out(pr(t, k[0], k[0] + .18))) : (p[3] ? 1 - pr(t, k[0], k[0] + .15) : 0);
  s.pop = k[3] && !p[3] ? .88 + .12 * EZ.spring(pr(t, k[0], k[0] + .5)) : 1;
  return s;
}
function tkRender(t, extra = {}) {
  if (inBR(t)) extra = Object.assign({}, extra, { o: 0 });
  const s = tkState(t), e = TK, Wd = s.w, Hd = s.h, r = s.r;
  e._box.style.width = Wd.toFixed(1) + 'px'; e._box.style.height = Hd.toFixed(1) + 'px'; e._box.style.borderRadius = r.toFixed(1) + 'px';
  e._fr.style.borderRadius = r.toFixed(1) + 'px';
  const round = clamp((r / (Math.min(Wd, Hd) / 2) - .3) / .7);
  e._cr.style.opacity = (1 - round).toFixed(2); e._lab.style.opacity = clamp(1 - round * 2).toFixed(2);
  e._fr.style.opacity = (1 - round).toFixed(2); e._ring.style.opacity = (round * .9).toFixed(2);
  e._dot.style.opacity = (Math.floor(t * 1.6) % 2 ? .25 : 1);
  setTxt(e._dim, `${Math.round(Wd)}×${Math.round(Hd)}`);
  const pulse = beatPulse(t, true) * .006;
  const cs = window.CAM || {};
  place(e, { x: s.x + (extra.dx || 0) + (cs.sx || 0) * .6, y: s.y + (extra.dy || 0) + (cs.sy || 0) * .6, o: s.o * (extra.o == null ? 1 : extra.o), s: s.pop * (1 + s.kick + pulse) * (extra.s || 1), r: s.tilt });
  e._tint.style.background = extra.tint || '';
  if (s.o <= 0 || extra.o === 0) return;
  const tt = window.USER_OUTPUT_TIME;
  setFrame(e._img, talkSrc(tt));
  window.userPresenterFrame(e._img,tt,Wd,Hd,round);
}


const HUD = (() => {
  const c = $('chrome');
  const corner = (l, t, bx, by) => mk(c, `<div style="width:26px;height:26px;border-${bx}:2px solid ${SILVER};border-${by}:2px solid ${SILVER}"></div>`, l, t, { ax: 0, ay: 0 });
  const k = [corner(30, 30, 'left', 'top'), corner(1864, 30, 'right', 'top'), corner(30, 1024, 'left', 'bottom'), corner(1864, 1024, 'right', 'bottom')];
  const tl = TX(c, TEXT_GLOBAL(USER_INPUT.title), 72, 56, MONO(17, DIM, 5));
  const tr = TX(c, '', 1848, 56, MONO(17, DIM, 4), { ax: 1 });
  const bl = TX(c, '', 72, 1030, MONO(17, DIM, 5));
  const br = TX(c, `<span class="ticks"></span>`, 1800, 1030, MONO(16, DIM, 0), { ax: 1 });
  br.querySelector('.ticks').innerHTML = Array.from({ length: 32 }, () => `<i style="display:inline-block;width:3px;height:14px;margin-left:5px;background:${DIM2};vertical-align:middle"></i>`).join('');
  const xh = mk(c, `<svg width="26" height="26" viewBox="-13 -13 26 26" fill="none" stroke="${DIM}" stroke-width="1.5"><circle r="7"/><path d="M-12 0H12M0-12V12"/></svg>`, 1848, 1030, { ax: 1, ay: .5 });
  return { k, tl, tr, bl, br, xh, ticks: [...br.querySelectorAll('i')] };
})();
const tcode = t => { const f = Math.floor(t * 60 + 1e-6), s = Math.floor(f / 60); return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, f % 60].map(n => String(n).padStart(2, '0')).join(':'); };
function hudRender(t) {
  const sc = SCENES.find(s => t >= s.s - 1e-4 && t < s.e);
  const on = sc && sc.label != null ? (sc.hudO == null ? 1 : sc.hudO) : 0;
  const ink = sc && sc.inkHud ? 'rgba(10,12,14,.55)' : DIM, inkS = sc && sc.inkHud ? 'rgba(10,12,14,.8)' : SILVER;
  [HUD.tl, HUD.tr, HUD.bl, HUD.br].forEach(e => { e.firstChild.style.color = ink; place(e, { o: on }); });
  HUD.k.forEach(e => { e.firstChild.style.borderColor = inkS; place(e, { o: on }); });
  place(HUD.xh, { o: on * .9, r: t * 40 });
  setTxt(HUD.tr.firstChild, tcode(t));
  setTxt(HUD.bl.firstChild, sc && sc.label ? sc.label : '');
  const n = HUD.ticks.length, prog = clamp(window.USER_OUTPUT_TIME / USER_INPUT.duration), bi = beatIdx(t);
  HUD.ticks.forEach((b, i) => { const lit = i < Math.round(prog * n); b.style.background = lit ? (i === Math.round(prog * n) - 1 && bi % 2 ? GOLD : inkS) : (sc && sc.inkHud ? 'rgba(10,12,14,.18)' : DIM2); });
}


const TRANS = [];

function tBlocks(t0, col, d = .5, dir = 0) { TRANS.push({ k: 'blocks', t: t0, d, col, dir }); }
function tFlash(t0, a = .9, d = .25) { TRANS.push({ k: 'flash', t: t0 + d * .5, d: d * 1.2, a, t0, dd: d }); }

function tCircle(t0, col, cx = 960, cy = 540, pre = .34, post = .42, ring = '#7DB2FF') { TRANS.push({ k: 'circle', t: t0, pre, post, col, cx, cy, ring, d: 0 }); }
function tGlitch(t0, d = .3) { TRANS.push({ k: 'glitch', t: t0, d }); }
function transRender(t) {
  const c=$('trc').getContext('2d'),PW=CONFIG.width,PH=CONFIG.height;c.clearRect(0,0,PW,PH);
  let fl = 0, gl = 0;
  for (const h of TRANS) {
    if (h.k === 'circle') continue;
    const x = (t - (h.t - h.d / 2)) / h.d; if (x <= 0 || x >= 1) continue;
    if (h.k === 'flash') { const u = t - h.t0; if (u >= -1 / 120) fl = Math.max(fl, Math.exp(-Math.max(0, u) * (2.6 / h.dd)) * h.a); }
    if (h.k === 'glitch') gl = Math.max(gl, Math.sin(x * Math.PI));
    if (h.k === 'blocks') {
      const G = 48; c.fillStyle = h.col;
      for (let gy = 0; gy < PH / G + 1; gy++) for (let gx = 0; gx < PW / G + 1; gx++) {
        const cx = gx * G + G / 2, cy = gy * G + G / 2;
        let ramp = h.dir === 0 ? cx / PW : h.dir === 1 ? 1 - cx / PW : Math.hypot(cx - PW/2, cy - PH/2) / 1100;
        ramp = ramp * .72 + hash(gx * 31 + gy * 17) * .28;
        const s = x < .5 ? clamp((x / .5) * 1.8 - ramp * .8) : 1 - clamp(((x - .5) / .5) * 1.8 - (1 - ramp) * .8);
        if (s < .02) continue; const q = G * s;
        c.fillRect(cx - q / 2, cy - q / 2, q, q);
      }
    }
    if (h.k === 'circle') {}
  }
  for (const h of TRANS) {
    if (h.k !== 'circle' || t < h.t - h.pre || t > h.t + h.post) continue;
    const hx=USER_INPUT.layout==='portrait'?h.cx*1080/1920:h.cx,hy=USER_INPUT.layout==='portrait'?h.cy*1920/1080:h.cy,rf=USER_INPUT.layout==='portrait'?Math.max(1,Math.hypot(Math.max(hx,PW-hx),Math.max(hy,PH-hy))/1200):1;
    const R1 = t < h.t ? EZ.in(pr(t, h.t - h.pre, h.t)) * 1250*rf : 1300*rf;
    const R2 = t < h.t ? 0 : EZ.out(pr(t, h.t, h.t + h.post)) * 1320*rf;
    c.beginPath(); c.arc(hx, hy, R1, 0, 6.2832); if (R2 > 0) c.arc(hx, hy, R2, 0, 6.2832, true);
    c.fillStyle = h.col; c.fill('evenodd');
    if (R1 > 4) { c.lineWidth = 26; c.strokeStyle = h.ring; c.beginPath(); c.arc(hx, hy, Math.max(0, R1 - 13), 0, 6.2832); c.stroke(); }
    if (R2 > 4) { c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(hx, hy, R2, 0, 6.2832); c.stroke(); }
  }
  $('flash').style.opacity = fl.toFixed(3);
  
  const w = $('world');
  if (gl > .02) {
    const j = Math.floor(t * 40);
    w.style.filter = `drop-shadow(${(gl * 10 * (hash(j) - .5)).toFixed(1)}px 0 0 rgba(255,40,60,.6)) drop-shadow(${(-gl * 10 * (hash(j + 3) - .5)).toFixed(1)}px 0 0 rgba(40,200,255,.6))`;
    $('glc').style.opacity = gl.toFixed(2); $('glc').style.backgroundPosition = `0 ${Math.floor(hash(j) * 1080)}px`;
  } else { if (w.style.filter) w.style.filter = ''; $('glc').style.opacity = 0; }
}


window.SUBS_HIDE=[];window.SUB_Y=null;window.OVERLAY=()=>{};
window.TK_EXTRA = null;
window.GLOBAL = t => {
  FXB.clearRect(0,0,CONFIG.width,CONFIG.height);FXC.clearRect(0,0,CONFIG.width,CONFIG.height);FXT.clearRect(0,0,CONFIG.width,CONFIG.height);
  for(const[fn,top,unit]of FXQ.splice(0)){const c=top==='top'?FXT:top?FXC:FXB;c.save();if(USER_INPUT.layout==='portrait')window.kineticPortraitFX(c,unit,fn,t);else fn(c,t);c.restore();}
  tkRender(t, window.TK_EXTRA ? window.TK_EXTRA(t) || {} : {});
  hudRender(t); transRender(t);
  $('grain').style.backgroundPosition = `${Math.floor(hash(Math.floor(t * 24)) * 256)}px ${Math.floor(hash(Math.floor(t * 24) + 5) * 256)}px`;
};




function gproj(lon, lat, rot, tilt) {
  const la = lat * Math.PI / 180, lo = lon * Math.PI / 180 + rot;
  let x = Math.cos(la) * Math.sin(lo), y = -Math.sin(la), z = Math.cos(la) * Math.cos(lo);
  const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
  return [x, y2, z2];
}
function globeDraw(c, t, o) {
  const { cx, cy, R } = o, rot = o.rot || 0, tilt = o.tilt == null ? -.35 : o.tilt, op = o.o == null ? 1 : o.o;
  if (op <= .002) return;
  
  const g = c.createRadialGradient(cx - R * .3, cy - R * .35, R * .1, cx, cy, R * 1.25);
  g.addColorStop(0, `rgba(30,60,140,${.35 * op})`); g.addColorStop(.75, `rgba(10,20,50,${.25 * op})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R * 1.25, 0, 6.2832); c.fill();
  c.strokeStyle = `rgba(125,178,255,${.35 * op})`; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, R, 0, 6.2832); c.stroke();
  
  c.lineWidth = 1;
  for (let lat = -60; lat <= 60; lat += 30) {
    c.beginPath(); let first = true;
    for (let lon = -180; lon <= 180; lon += 4) { const [x, y, z] = gproj(lon, lat, rot, tilt); if (z < 0) { first = true; continue; } const X = cx + x * R, Y = cy + y * R; first ? c.moveTo(X, Y) : c.lineTo(X, Y); first = false; }
    c.strokeStyle = `rgba(125,178,255,${.12 * op})`; c.stroke();
  }
  for (let lon = -180; lon < 180; lon += 30) {
    c.beginPath(); let first = true;
    for (let lat = -88; lat <= 88; lat += 4) { const [x, y, z] = gproj(lon, lat, rot, tilt); if (z < 0) { first = true; continue; } const X = cx + x * R, Y = cy + y * R; first ? c.moveTo(X, Y) : c.lineTo(X, Y); first = false; }
    c.strokeStyle = `rgba(125,178,255,${.10 * op})`; c.stroke();
  }
  
  const L = window.LAND;
  for (let i = 0; i < L.length; i++) {
    const [x, y, z] = gproj(L[i][0], L[i][1], rot, tilt); if (z < -.05) continue;
    const a = (.25 + z * .75) * op, r = 1.1 + z * 1.4;
    c.fillStyle = `rgba(205,220,240,${a.toFixed(3)})`; c.fillRect(cx + x * R - r / 2, cy + y * R - r / 2, r, r);
  }
  
  (o.arcs || []).forEach(([lo1, la1, lo2, la2, p, col]) => {
    if (p <= 0) return;
    const N = 60, pts = [];
    for (let i = 0; i <= N * clamp(p); i++) {
      const u = i / N, lon = lerp(lo1, lo2, u), lat = lerp(la1, la2, u), h = 1 + Math.sin(u * Math.PI) * .28;
      const [x, y, z] = gproj(lon, lat, rot, tilt); pts.push([cx + x * R * h, cy + y * R * h, z]);
    }
    c.strokeStyle = col || GOLD; c.lineWidth = 3; c.shadowColor = col || GOLD; c.shadowBlur = 14;
    c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.shadowBlur = 0;
    const h = pts[pts.length - 1]; if (h) glow(c, h[0], h[1], 26, '255,214,120', op);
  });
  
  (o.pins || []).forEach(([lon, lat, lab, col, k]) => {
    const [x, y, z] = gproj(lon, lat, rot, tilt); if (z < 0) return;
    const X = cx + x * R, Y = cy + y * R, a = (k == null ? 1 : k) * op;
    c.fillStyle = col || GOLD; c.globalAlpha = a; c.beginPath(); c.arc(X, Y, 7, 0, 6.2832); c.fill();
    c.strokeStyle = col || GOLD; c.lineWidth = 1.5; c.beginPath(); c.arc(X, Y, 7 + (t * 30 % 22), 0, 6.2832); c.globalAlpha = a * (1 - (t * 30 % 22) / 22); c.stroke(); c.globalAlpha = 1;
  });
}


function seal(parent, txt, x, y, col = GOLD, size = 64, rot = -6, sub = 'STAMP') {
  const e = mk(parent, `<div style="position:relative;padding:12px 28px 14px;border:5px solid ${col};${HV(size, col, 4)};line-height:1">
    ${txt}<div style="position:absolute;left:-5px;top:-28px;${MONO(15, col, 3)}">● ${sub}</div></div>`, x, y, { ax: .5, ay: .5 });
  e._rot = rot; return e;
}
function sealAt(e, t, t0, out) {
  const x = pr(t, t0, t0 + .18); let o = clamp(x * 6); if (out != null) o *= 1 - pr(t, out, out + .2);
  place(e, { s: 1 + (1 - EZ.out5(x)) * 1.8, r: e._rot + (1 - x) * 10, o });
}


const MOTION_MARK = (size = 120, col = '#fff', dot = '#7B7BFF') => `<svg width="${size}" height="${size * .62}" viewBox="0 0 160 100"><circle cx="16" cy="84" r="13" fill="${dot}"/><path d="M40 92V40a22 22 0 0 1 44 0v52M84 40a22 22 0 0 1 44 0v52" fill="none" stroke="${col}" stroke-width="22" stroke-linecap="round"/></svg>`;
function motionFile(parent, x, y, w = 220, opt = {}) {
  const h = w * 1.28;
  const e = mk(parent, `<div style="position:relative;width:${w}px;height:${h}px">
     <svg width="${w}" height="${h}" viewBox="0 0 100 128" style="position:absolute;inset:0;overflow:visible">
       <defs><linearGradient id="mfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22262e"/><stop offset="1" stop-color="#101216"/></linearGradient></defs>
       <path d="M6 2h62l30 30v90a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" fill="url(#mfg)" stroke="${opt.stroke || 'rgba(233,236,239,.5)'}" stroke-width="1.2"/>
       <path d="M68 2v26a4 4 0 0 0 4 4h26" fill="rgba(255,255,255,.08)" stroke="${opt.stroke || 'rgba(233,236,239,.5)'}" stroke-width="1.2"/></svg>
     <div style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%)">${MOTION_MARK(w * .52)}</div>
     <div style="position:absolute;left:0;right:0;bottom:${w * .1}px;text-align:center;${MONO(Math.round(w * .085), SILVER, 2)};text-transform:none">${opt.name || 'template.motion'}</div></div>`, x, y, { ax: .5, ay: .5 });
  return e;
}


function kwCard(parent, idx, total, word, bg, ink, icon, sub = '') {
  const e = mk(parent, `<div style="position:relative;width:1920px;height:1080px;background:${bg};overflow:hidden">
     <div style="position:absolute;inset:0;background-image:linear-gradient(${ink === '#0A0B0D' ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.05)'} 1px,transparent 1px),linear-gradient(90deg,${ink === '#0A0B0D' ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.05)'} 1px,transparent 1px);background-size:64px 64px"></div>
     <div class="ic" style="position:absolute;right:120px;top:50%;transform:translateY(-50%);color:${ink};opacity:.13">${ICON(icon, 620, 1.2)}</div>
     <div style="position:absolute;left:72px;top:56px;${MONO(18, ink, 5)};opacity:.7">${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}</div>
     <div style="position:absolute;right:72px;top:56px;${MONO(18, ink, 5)};opacity:.7">.MOTION UPGRADE</div>
     <div class="w" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-56%);${HV(230, ink, 8)};white-space:nowrap">${word}</div>
     <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,170px);${MONO(24, ink, 8)};opacity:.75;white-space:nowrap">${sub}</div>
     <div class="bar" style="position:absolute;left:72px;bottom:64px;height:3px;width:1776px;background:${ink};opacity:.18"></div>
     <div class="bf" style="position:absolute;left:72px;bottom:64px;height:3px;width:1776px;background:${ink};transform-origin:0 50%"></div>
     <div style="position:absolute;right:72px;bottom:84px;color:${ink};opacity:.8">${ICON(icon, 42, 1.6)}</div></div>`, 0, 0, { ax: 0, ay: 0 });
  e._w = e.querySelector('.w'); e._bf = e.querySelector('.bf'); e._ic = e.querySelector('.ic'); return e;
}
function kwAt(e, t, t0, t1, opt = {}) {
  const on = t >= t0 && t < t1; place(e, { o: on ? 1 : 0 }); if (!on) return;
  const x = pr(t, t0, t0 + .16), j = Math.floor(t * 30);
  const g = 1 - EZ.out(pr(t, t0, t0 + .22));
  e._w.style.transform = `translate(calc(-50% + ${((hash(j) - .5) * 60 * g).toFixed(1)}px),-56%) scale(${(1 + (1 - EZ.out5(x)) * .35).toFixed(3)})`;
  e._w.style.filter = g > .05 ? `drop-shadow(${(14 * g).toFixed(1)}px 0 0 rgba(255,40,60,.8)) drop-shadow(${(-14 * g).toFixed(1)}px 0 0 rgba(40,210,255,.8))` : '';
  e._bf.style.transform = `scaleX(${pr(t, t0, t1).toFixed(3)})`;
  e._ic.style.transform = `translateY(-50%) rotate(${((t - t0) * 8).toFixed(2)}deg) scale(${(1 + (t - t0) * .05).toFixed(3)})`;
}


function vcard(parent, w, h, opt = {}) {
  const e = mk(parent, `<div style="position:relative;width:${w}px;height:${h}px">
    <div class="vt" style="position:absolute;inset:0;border-radius:${opt.r == null ? 10 : opt.r}px;border:1px solid rgba(233,236,239,.18);box-shadow:0 26px 70px rgba(0,0,0,.6)"><img></div>
    ${opt.label ? `<div style="position:absolute;left:0;top:-30px;${MONO(14, DIM, 2)};white-space:nowrap">${opt.label}</div>` : ''}
    ${opt.badge ? `<div style="position:absolute;right:10px;top:10px;padding:4px 10px;border-radius:6px;background:rgba(5,6,8,.75);${MONO(13, SILVER, 1)}">${opt.badge}</div>` : ''}</div>`, 0, 0, { ax: .5, ay: .5 });
  e._img = e.querySelector('img'); return e;
}
function vseq(e, dir, n, t, t0, fps = 30, loop = true) { setFrame(e._img, seqAt(dir, n, fps, t, t0, loop)); }
function vthumb(e, id, k = 2) { setFrame(e._img, `sc/thumb/${id}_${k}.jpg`); }


function term(parent, w, h, title = '') {
  const e = mk(parent, `<div class="glass" style="width:${w}px;height:${h}px;border-radius:14px;overflow:hidden">
     <div style="height:38px;display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid rgba(233,236,239,.08)"><i style="width:11px;height:11px;border-radius:50%;background:#ff5f57"></i><i style="width:11px;height:11px;border-radius:50%;background:#febc2e"></i><i style="width:11px;height:11px;border-radius:50%;background:#28c840"></i><span style="margin-left:12px;${MONO(13, DIM, 1)};text-transform:none">${title}</span></div>
     <pre class="tx" style="margin:0;padding:22px 26px;font:500 22px/1.6 'Geist Mono','PingFang SC',monospace;color:#cfd6df;white-space:pre-wrap"></pre></div>`, 0, 0, { ax: .5, ay: .5 });
  e._tx = e.querySelector('.tx'); return e;
}

function termAt(e, t, lines) {
  let html = '';
  for (const [t0, txt, cps] of lines) {
    if (t < t0) break;
    const plain = txt.replace(/<[^>]+>/g, ''); const n = Math.floor(clamp((t - t0) * (cps || 40), 0, plain.length));
    if (n >= plain.length) html += txt + '\n';
    else { html += plain.slice(0, n); break; }
  }
  html += Math.floor(t * 2.2) % 2 ? '<span style="background:#cfd6df">&nbsp;</span>' : '&nbsp;';
  if (e._h !== html) { e._h = html; e._tx.innerHTML = html; }
}




function wall3d(parent, n, cols, tw, th, gap = 10) {
  const PW=USER_INPUT.layout==='portrait'?1080:1920,PH=USER_INPUT.layout==='portrait'?1920:1080;
  if(USER_INPUT.layout==='portrait')cols=Math.max(3,Math.round(cols*.45));
  const rows = Math.ceil(n / cols), W = cols * (tw + gap) - gap, H = rows * (th + gap) - gap;
  const e = mk(parent, `<div style="position:absolute;left:0;top:0;width:${PW}px;height:${PH}px;perspective:1400px;perspective-origin:50% 50%">
     <div class="g3" style="position:absolute;left:${PW/2 - W/2}px;top:${PH/2 - H/2}px;width:${W}px;height:${H}px;transform-style:preserve-3d"></div></div>`, 0, 0);
  const g = e.querySelector('.g3'), cells = [];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.style.cssText = `position:absolute;left:${(i % cols) * (tw + gap)}px;top:${Math.floor(i / cols) * (th + gap)}px;width:${tw}px;height:${th}px;border-radius:6px;overflow:hidden;background:#0b0c0e;outline:1px solid rgba(233,236,239,.12)`;
    c.innerHTML = '<img style="width:100%;height:100%;object-fit:cover;display:block">';
    g.appendChild(c); cells.push({ el: c, img: c.firstChild, i, cx: (i % cols) - (cols - 1) / 2, cy: Math.floor(i / cols) - (rows - 1) / 2 });
  }
  e._g = g; e._cells = cells; e._W = W; e._H = H; e._cols = cols; e._rows = rows; e._tw = tw; e._th = th; e._gap = gap;
  return e;
}

function wallFrames(e, t, t0, map, vis) {
  const fi = Math.floor(Math.max(0, t - t0) * 12);
  e._cells.forEach((c, k) => {
    if (vis && !vis(c)) return;
    const id = map ? map(k) : k % 62;
    setFrame(c.img, `sc/wall2/${String(id).padStart(3, '0')}/f_${String(1 + ((fi + k * 7) % 30)).padStart(2, '0')}.jpg`);
  });
}


function scanSweep(c, t, t0, d = .5, col = '125,178,255', vertical = false) {
  const p = pr(t, t0, t0 + d); if (p <= 0 || p >= 1) return;
  const portrait=USER_INPUT.layout==='portrait',PW=CONFIG.width,PH=CONFIG.height;
  if(portrait){c.save();c.setTransform(1,0,0,1,0,0);}
  const x=lerp(-100,(vertical?PH:PW)+100,EZ.inout(p));
  c.save(); c.globalCompositeOperation = 'lighter';
  const g = vertical ? c.createLinearGradient(0, x - 160, 0, x) : c.createLinearGradient(x - 220, 0, x, 0);
  g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},.45)`);
  c.fillStyle = g; vertical ? c.fillRect(0,x-160,PW,160) : c.fillRect(x-220,0,220,PH);
  c.fillStyle = 'rgba(255,255,255,.9)'; vertical ? c.fillRect(0,x,PW,2) : c.fillRect(x,0,2,PH);
  c.restore();if(portrait)c.restore();
}


function radialLines(c, t, cx, cy, k, n = 140, col = '200,215,255', seed = 1, inward = true) {
  if (k <= 0) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const a = hash(i * 1.3 + seed) * 6.2832, sp = .6 + hash(i * 2.9 + seed) * 1.4;
    const ph = ((t * sp * 1.6 + hash(i * 7.7 + seed)) % 1);
    const r0 = inward ? lerp(1300, 80, ph) : lerp(80, 1300, ph), L = 40 + hash(i * 5.1) * 180;
    const r1 = inward ? r0 + L : r0 - L;
    c.strokeStyle = `rgba(${col},${(k * (.15 + .5 * hash(i * 3.3)) * Math.sin(Math.PI * ph)).toFixed(3)})`; c.lineWidth = 1 + hash(i) * 1.5;
    c.beginPath(); c.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); c.lineTo(cx + Math.cos(a) * Math.max(0, r1), cy + Math.sin(a) * Math.max(0, r1)); c.stroke();
  }
  c.restore();
}


function sampleText(txt, font, w, h, step = 6) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d');
  x.fillStyle = '#fff'; x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, w / 2, h / 2);
  const d = x.getImageData(0, 0, w, h).data, pts = [];
  for (let yy = 0; yy < h; yy += step) for (let xx = 0; xx < w; xx += step) if (d[(yy * w + xx) * 4 + 3] > 128) pts.push([xx - w / 2, yy - h / 2]);
  return pts;
}
function particlesTo(c, t, pts, cx, cy, p, opt = {}) {
  const col = opt.col || '233,236,239', sz = opt.size || 2.4, seed = opt.seed || 1;
  c.save(); c.globalCompositeOperation = 'lighter';
  pts.forEach(([x, y], i) => {
    const d = clamp(p * 1.3 - hash(i * .37 + seed) * .3), e = EZ.inout(d);
    const a = hash(i * 1.9 + seed) * 6.2832, r = 600 + hash(i * 3.7 + seed) * 900;
    const sx = cx + Math.cos(a) * r, sy = cy + Math.sin(a) * r * .6;
    const X = lerp(sx, cx + x, e), Y = lerp(sy, cy + y, e);
    const k = opt.out != null ? 1 - pr(t, opt.out, opt.out + .4) : 1;
    c.fillStyle = `rgba(${col},${((.35 + .65 * e) * k * (opt.o == null ? 1 : opt.o)).toFixed(3)})`;
    c.fillRect(X - sz / 2, Y - sz / 2, sz, sz);
  });
  c.restore();
}


function shockRing(c, t, t0, cx, cy, maxR = 900, d = .6, col = '170,200,255', w = 3) {
  const p = pr(t, t0, t0 + d); if (p <= 0 || p >= 1) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  c.strokeStyle = `rgba(${col},${(1 - p).toFixed(3)})`; c.lineWidth = w * (1 + (1 - p) * 3);
  c.beginPath(); c.arc(cx, cy, EZ.out(p) * maxR, 0, 6.2832); c.stroke(); c.restore();
}


function zoomPunch(t, t0, k = .08, d = .35) { const p = pr(t, t0, t0 + d); return p > 0 && p < 1 ? 1 + k * (1 - EZ.out(p)) : 1; }


function lineIcon(name, size = 200, col = SILVER, glowCol = '125,178,255') {
  const P = {
    lock: '<rect x="30" y="80" width="140" height="100" rx="14"/><path d="M60 80V56a40 40 0 0 1 80 0v24"/><circle cx="100" cy="122" r="10"/><path d="M100 132v20"/>',
    chainBreak: '<path d="M70 92l-22 22a28 28 0 0 0 40 40l22-22"/><path d="M130 108l22-22a28 28 0 0 0-40-40L90 68"/><path d="M84 70l-10-18M116 130l10 18M70 84l-18-6M130 116l18 6"/>',
    trophy: '<path d="M64 36h72v40a36 36 0 0 1-72 0z"/><path d="M64 48H40a20 20 0 0 0 26 30M136 48h24a20 20 0 0 1-26 30"/><path d="M100 112v26M76 164h48M84 138h32v26H84z"/>',
    gift: '<rect x="36" y="78" width="128" height="94" rx="8"/><rect x="28" y="56" width="144" height="26" rx="6"/><path d="M100 56v116"/><path d="M100 56c-14-26-46-26-40-4 4 12 40 4 40 4zM100 56c14-26 46-26 40-4-4 12-40 4-40 4z"/>',
    heart: '<path d="M100 168S36 126 36 82a32 32 0 0 1 64-6 32 32 0 0 1 64 6c0 44-64 86-64 86z"/>',
    coffee: '<path d="M44 80h100v50a40 40 0 0 1-40 40H84a40 40 0 0 1-40-40z"/><path d="M144 94h12a18 18 0 0 1 0 36h-14"/><path d="M76 40c-8 10 8 16 0 26M100 34c-8 12 8 18 0 30M124 40c-8 10 8 16 0 26"/>',
    clapper: '<rect x="30" y="76" width="140" height="94" rx="8"/><path d="M30 76l132-38 8 28-132 38"/><path d="M58 68l18 26M94 58l18 26M130 48l18 26"/>',
  }[name] || '<circle cx="100" cy="100" r="40"/>';
  const id = 'lg' + name + Math.floor(size);
  return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" style="overflow:visible"><defs><filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter></defs>
    <g fill="none" stroke="rgb(${glowCol})" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#${id})" opacity=".55">${P}</g>
    <g fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${P}</g>
    <g stroke="${DIM}" stroke-width="1.5" fill="none"><path d="M6 20V6h14M180 6h14v14M194 180v14h-14M20 194H6v-14"/></g></svg>`;
}
