
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, x) => a + (b - a) * x;
const pr = (t, a, b) => clamp((t - a) / (b - a));
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const noise = t => { const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };
const EZ = {
  out: x => 1 - Math.pow(1 - x, 3),
  out5: x => 1 - Math.pow(1 - x, 5),
  expo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  inout: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  in: x => x * x * x,
  back: x => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  
  spring: x => x >= 1 ? 1 : 1 - Math.exp(-7 * x) * Math.cos(8.5 * x) * (1 - x * 0.2),
};
const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString('en-US');

function mk(parent, html, x = 0, y = 0, opt = {}) {
  const d = document.createElement('div');
  d.className = 'e ' + (opt.cls || '');
  if (opt.style) d.style.cssText += opt.style;
  d.innerHTML = html; parent.appendChild(d);
  d._x = x; d._y = y; d._ax = opt.ax == null ? 0 : opt.ax; d._ay = opt.ay == null ? 0 : opt.ay;
  d.dataset.nativeNode=String(parent._nativeSequence||0);parent._nativeSequence=(parent._nativeSequence||0)+1;
  place(d, { o: 0 }); return d;
}
function img(parent, src, x, y, h, opt = {}) {
  return mk(parent, `<img src="assets/${src}" class="${opt.ic || 'ch'}" style="height:${h}px;display:block">`, x, y, Object.assign({ ax: .5, ay: 1 }, opt));
}
function place(e, o = {}) {
  const x = o.x == null ? e._x : o.x, y = o.y == null ? e._y : o.y;
  const s = o.s == null ? 1 : o.s, sx = (o.sx == null ? 1 : o.sx) * s, sy = (o.sy == null ? 1 : o.sy) * s;
  e.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) translate(${-e._ax * 100}%,${-e._ay * 100}%) rotate(${(o.r || 0).toFixed(3)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
  e.style.transformOrigin = `${e._ax * 100}% ${e._ay * 100}%`;
  const op = o.o == null ? 1 : o.o;
  e._lastPlace={x,y,s,sx,sy,r:o.r||0,o:op};
  e.style.opacity = op.toFixed(3);
  e.style.visibility = op <= 0.002 ? 'hidden' : 'visible';
  e.style.filter = o.blur ? `blur(${o.blur.toFixed(2)}px)` : '';
}

function show(e, t, t0, opt = {}) {
  const d = opt.d || 0.55, x = pr(t, t0, t0 + d), k = opt.k || 'up';
  let o = clamp(x * 3), tx = 0, ty = 0, s = 1, r = opt.r || 0, blur = 0;
  const E = EZ.expo(x), dist = opt.dist || 50;
  if (k === 'up') { ty = (1 - E) * dist; blur = (1 - E) * 6; }
  if (k === 'down') { ty = -(1 - E) * dist; }
  if (k === 'left') { tx = -(1 - E) * (opt.dist || 160); }
  if (k === 'right') { tx = (1 - E) * (opt.dist || 160); }
  if (k === 'pop') { s = 0.6 + 0.4 * EZ.spring(x); o = clamp(x * 5); }
  if (k === 'zoom') { s = 1 + (1 - E) * 0.25; blur = (1 - E) * 14; }
  if (k === 'slam') { s = 1 + (1 - EZ.out5(x)) * 1.2; o = clamp(x * 5); blur = (1 - x) * 10; }
  if (k === 'blur') { blur = (1 - E) * 18; s = 1 + (1 - E) * .05; }
  if (k === 'mask') { o = 1; e.style.clipPath = `inset(${(1 - E) * 100}% 0 0 0)`; ty = (1 - E) * 30; }
  if (opt.out != null) {
    const y = pr(t, opt.out, opt.out + (opt.od || 0.35)), Y = EZ.in(y);
    o *= 1 - y; ty -= Y * (opt.oy || 0); tx += Y * (opt.ox || 0); s *= 1 - (opt.os || 0) * Y; blur += (opt.ob == null ? 8 : opt.ob) * Y;
  }
  place(e, { x: (opt.x == null ? e._x : opt.x) + tx, y: (opt.y == null ? e._y : opt.y) + ty, s: s * (opt.s || 1), r, o: o * (opt.o == null ? 1 : opt.o), blur, sx: opt.sx, sy: opt.sy });
  return x;
}

function words(parent, segs, x, y, cls = 'h1', opt = {}) {
  const e = mk(parent, `<div class="${cls}" style="${opt.style || ''}">${segs.map((s, i) => { const br = /<br>$/.test(s.h); const h = s.h.replace(/<br>$/, ''); return `<span class="w" style="display:inline-block;${s.st || ''}">${h}</span>${br ? '<br>' : ''}`; }).join('')}</div>`, x, y, { ax: opt.ax || 0, ay: opt.ay || 0 });
  e._w = [...e.querySelectorAll('.w')]; e._segs = segs; return e;
}
function wordsAt(e, t, opt = {}) {
  place(e, { o: opt.o == null ? 1 : opt.o, x: opt.x, y: opt.y, s: opt.s });
  e._w.forEach((w, i) => {
    const s = e._segs[i], t0 = s.t, x = pr(t, t0, t0 + (s.d || .45)), E = EZ.expo(x);
    let op = clamp(x * 3);
    let tf = `translateY(${((1 - E) * (s.k === 'slam' ? 0 : 38)).toFixed(1)}px)`;
    if (s.k === 'slam') tf += ` scale(${(1 + (1 - EZ.out5(x)) * .9).toFixed(3)})`;
    if (s.k === 'pop') tf = `scale(${(0.5 + 0.5 * EZ.spring(x)).toFixed(3)})`;
    if (opt.out != null) { const y = pr(t, opt.out + i * (opt.stag || 0.02), opt.out + i * (opt.stag || 0.02) + .3); op *= 1 - y; tf += ` translateY(${(-EZ.in(y) * 30).toFixed(1)}px)`; }
    w.style.opacity = op.toFixed(3); w.style.transform = tf;
    w.style.filter = x < 1 ? `blur(${((1 - E) * 10).toFixed(1)}px)` : '';
  });
}

const SCENES = [];
class Scene {
  constructor(s, e, bg, opt = {}) {
    this.s = s; this.e = e; this.opt = opt;
    this.el = document.createElement('div'); this.el.className = 'sc'; this.el.style.background = bg; $('world').appendChild(this.el);
    if (opt.grid) { const g = document.createElement('div'); g.className = opt.grid; this.el.appendChild(g); this.gridEl = g; }
    SCENES.push(this);
  }
  update(t) { }
  cam(t) { return null; }
}
function tags(sc, left, time, dark = false) {
  const c = dark ? 'color:#5c5c5c' : sc.el.style.background.includes('36, 98, 234') ? 'color:rgba(255,255,255,.65)' : '';
  const a = mk(sc.el, `<div class="tag" style="${c}">${left}</div>`, 64, 52);
  const b = mk(sc.el, `<div class="tag tc" style="${c}"><b class="brand" style="font-weight:inherit"></b>&nbsp;&nbsp;<span></span></div>`, 1856, 52, { ax: 1 });
  b.querySelector('.brand').textContent = CONFIG.brand || '';
  sc._tags = [a, b];
  return (t) => { place(a, { o: pr(t, sc.s + .05, sc.s + .3) }); place(b, { o: pr(t, sc.s + .05, sc.s + .3) }); b.querySelector('span').textContent = tc(t); };
}
const tc = t => { const fps = CONFIG.fps || 60, frame = Math.floor(t * fps + 1e-6), sec = Math.floor(frame / fps); return [Math.floor(sec / 3600), Math.floor(sec / 60) % 60, sec % 60, frame % fps].map(n => String(n).padStart(2, '0')).join(':'); };

const bob = (t, k = 0, a = 5) => Math.sin(t * 2.2 + k) * a;
const breathe = (t, k = 0) => 1 + Math.sin(t * 2.0 + k) * 0.006;

function hopIn(t, t0, dur = .45) { const x = pr(t, t0, t0 + dur); return { s: 0.85 + 0.15 * EZ.spring(x), o: clamp(x * 6), y: (1 - EZ.spring(x)) * 40 }; }
function shake(t, t0, dur = .4, amp = 10) { const x = pr(t, t0, t0 + dur); if (x <= 0 || x >= 1) return [0, 0]; const k = (1 - x) * amp; return [k * noise(t * 45), k * noise(t * 45 + 9)]; }
function counter(t, t0, t1, v0, v1, ease = EZ.out) { return lerp(v0, v1, ease(pr(t, t0, t1))); }


const SFX = []; window.SFX = SFX; window.SFX_OWNERS=[]; window.SFX_CALLS=[]; const SOURCE_SOUND_COUNTS={};
function SOURCE_S(id,...args){const n=SOURCE_SOUND_COUNTS[id]||0;SOURCE_SOUND_COUNTS[id]=n+1;window.CURRENT_SOUND_CALL=id+"/"+n;S(...args);}
function S(t, type, g = 1, p = 0, x = {}) { window.SFX_OWNERS.push(window.CURRENT_UNIT); window.SFX_CALLS.push(window.CURRENT_SOUND_CALL); SFX.push(Object.assign({ t: +t.toFixed(3), type, g, p }, x)); }


const _pending = new Set();
window.imgWait = () => Promise.all([..._pending].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))).then(() => _pending.clear());
function setFrame(imgEl, src) { src=window.resolveMedia(src); if (imgEl._src !== src) { imgEl._src = src; imgEl.src = src; _pending.add(imgEl); } }

const HAS_MAP = typeof TALKMAP !== 'undefined' && Array.isArray(TALKMAP) && TALKMAP.length > 0;
const TALK_N = HAS_MAP ? TALKMAP.length : (CONFIG.talkFrames || 0);
const talkSrc = t => window.userPresenter(t);

const seqSrc = (dir, i, n) => `sc/${dir}/f_${String(clamp(i, 1, n)).padStart(4, '0')}.jpg`;
function seqAt(dir, n, fps, t, t0, loop = true) { let i = Math.floor((t - t0) * fps + 1e-6); i = loop ? ((i % n) + n) % n : clamp(i, 0, n - 1); return seqSrc(dir, i + 1, n); }


function camCard(parent, w, h, label = '// on air · ' + (CONFIG.account || 'Presenter'), round = false) {
  const e = mk(parent, `<div class="cam${round ? ' round' : ''}" style="width:${w}px;height:${h}px"><img>${round ? '' : `<div class="lab"><span style="color:#6d9bff">●</span> ${label}</div>`}</div>`, 0, 0, { ax: .5, ay: .5 });
  e._img = e.querySelector('img'); return e;
}
function faceAt(t){return window.userFace(t);}
function camAt(e,t,o){setFrame(e._img,talkSrc(t));place(e,o);window.userPresenterFrame(e._img,t,e.firstChild.offsetWidth,e.firstChild.offsetHeight,e.firstChild.classList.contains('round'));}
function vtile(parent, w, h, r = 16, extra = '') {
  const e = mk(parent, `<div class="vt" style="width:${w}px;height:${h}px;border-radius:${r}px;${extra}"><img></div>`, 0, 0, { ax: .5, ay: .5 });
  e._img = e.querySelector('img'); return e;
}
function macWin(parent, w, h, title) {
  const e = mk(parent, `<div class="macwin" style="width:${w}px"><div class="tb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span style="margin-left:14px;display:flex;align-items:center;gap:10px">${title}</span></div><div class="body" style="height:${h}px"><img></div></div>`, 0, 0, { ax: .5, ay: .5 });
  e._img = e.querySelector('.body img'); return e;
}
function buildWall(parent, COLS = 27, TW = 128, TH = 72, GP = 6) {
  if (typeof WALL === 'undefined' || !Array.isArray(WALL) || !WALL.length) throw Error('Video wall needs prepared wall.js / sc/wall assets; omit this scene when no wall media is supplied');
  const N = WALL.length, ROWS = Math.ceil(N / COLS);
  const W = COLS * (TW + GP) - GP, H = ROWS * (TH + GP) - GP;
  const e = mk(parent, `<div style="position:relative;width:${W}px;height:${H}px"></div>`, 960, 540, { ax: .5, ay: .5 });
  const cells = [];
  for (let i = 0; i < N; i++) {
    const d = document.createElement('div');
    d.style.cssText = `position:absolute;left:${(i % COLS) * (TW + GP)}px;top:${Math.floor(i / COLS) * (TH + GP)}px;width:${TW}px;height:${TH}px;border-radius:5px;background-image:url(sc/wall/${String(i).padStart(3, '0')}.jpg);background-size:${TW * 4}px ${TH * 4}px;background-color:#111`;
    e.firstChild.appendChild(d); cells.push(d);
  }
  e._cells = cells; e._cols = COLS; e._rows = ROWS; e._tw = TW; e._th = TH; return e;
}
function wallTick(w, t, t0, rate = 8) {       
  const fi = Math.floor(t * rate);
  w._cells.forEach((c, i) => {
    const k = (fi + i * 5) % 16;
    c.style.backgroundPosition = `${-(k % 4) * w._tw}px ${-Math.floor(k / 4) * w._th}px`;
    const d = Math.hypot((i % w._cols) - w._cols / 2, Math.floor(i / w._cols) - w._rows / 2) / 16;
    c.style.opacity = clamp((t - t0 - d * .5) * 5);
  });
}
function race(parent, dark = true) {   
  const c = dark ? 'rgba(255,255,255,.14)' : 'rgba(10,10,10,.10)';
  const e = mk(parent, `<div style="width:1628px;height:2px;background:${c};position:relative">
     ${(CONFIG.race.labels).map((n, i) => `<div style="position:absolute;left:${i / (CONFIG.race.labels.length - 1) * 100}%;top:-5px;width:2px;height:12px;background:${c}"></div>`).join('')}
     <div class="rp" style="position:absolute;left:0;top:-7px;width:16px;height:16px;border-radius:50%;background:var(--blue);box-shadow:0 0 18px rgba(36,98,234,.9);transform:translateX(-50%)"></div></div>`, 146, 1058);
  e._p = e.querySelector('.rp'); return e;
}
const RACE_K = CONFIG.race.keys;
function raceAt(e, t, o = 1) {
  const NS = RACE_K.length - 2; let i = 0; while (i < NS && t >= RACE_K[i + 1]) i++;
  const p = i + clamp((t - RACE_K[i]) / (RACE_K[i + 1] - RACE_K[i]));
  e._p.style.left = Math.min(100, p / NS * 100) + '%'; place(e, { o });
}
