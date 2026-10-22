/* Optional media-led basic expressions. Original scenes and clocks remain intact. */
(() => {
  let layer, heading, fields, frame, picture, label, lastSource = '';
  const saved = new Map();
  const ease = x => 1 - (1 - Math.max(0, Math.min(1, x))) ** 3;
  const node = (tag, parent, style) => { const el = document.createElement(tag); el.style.cssText = style; parent.append(el); return el; };
  function init() {
    const portrait = USER_INPUT.layout === 'portrait', w = portrait ? 1080 : 1920, h = portrait ? 1920 : 1080;
    layer = node('div', $('ov'), `position:absolute;inset:0;width:${w}px;height:${h}px;pointer-events:none;display:none;background:radial-gradient(ellipse at 30% 38%,#203049 0%,#090d15 68%);color:#e9ecef`);
    const text = node('div', layer, `position:absolute;left:${portrait ? 70 : 82}px;top:${portrait ? 176 : 170}px;width:${portrait ? 940 : 700}px;height:${portrait ? 530 : 640}px`);
    const headFont = USER_INPUT.language === 'en' ? 'Anton' : 'PuHuiTi', bodyFont = USER_INPUT.language === 'en' ? 'Geist' : 'PuHuiTi';
    heading = node('div', text, `font:${USER_INPUT.language === 'en' ? 400 : 900} ${portrait ? 78 : 88}px/1.08 ${headFont},sans-serif;letter-spacing:1px;white-space:pre-wrap;overflow-wrap:anywhere;background:linear-gradient(#fff,#aab8cd 65%,#e9eff5);background-clip:text;-webkit-text-fill-color:transparent;transform-origin:left center`);
    fields = node('div', text, `margin-top:32px;display:grid;gap:18px;perspective:1200px;font:600 ${portrait ? 39 : 40}px/1.3 ${bodyFont},sans-serif`);
    frame = node('div', layer, `position:absolute;left:${portrait ? 70 : 870}px;top:${portrait ? 790 : 170}px;width:${portrait ? 940 : 960}px;height:${portrait ? 700 : 640}px;overflow:hidden;border:1px solid #6c86a460;border-radius:28px;background:#05090e;box-shadow:0 20px 70px #0009,0 0 30px #6fa4dc12`);
    picture = node('img', frame, 'display:block;width:100%;height:100%;object-fit:contain');
    label = node('div', layer, `position:absolute;left:${portrait ? 82 : 880}px;top:${portrait ? 1510 : 832}px;width:${portrait ? 916 : 940}px;font:500 28px/1.3 PuHuiTi,Geist,sans-serif;color:#a9bcd1;white-space:pre-wrap`);
    // Native HUD/signatures/captions stay above this optional expression layer.
    $('ov').prepend(layer);
  }
  function targets(span, target) {
    const names = Array.isArray(target) ? target : [target];
    const beats = (span.narrationBeats || []).filter(b => names.includes(b.target));
    return beats.length ? Math.max(span.outputStart, Math.min(...beats.map(b => b.at))) : span.outputStart;
  }
  function setFields(span) {
    const b = span.basic, id = span.id;
    heading.textContent = id === 'B1' ? b.keyword : id === 'B4' ? b.summary : b.heading;
    const list = id === 'B1' ? [['explanation', b.explanation]] : id === 'B2' ? b.points.map((v, i) => ['points.' + i, v]) : id === 'B3' ? [['left', b.left], ['right', b.right], ['conclusion', b.conclusion]] : [['action', b.action]];
    fields.replaceChildren(); fields.style.gridTemplateColumns = id === 'B3' ? '1fr 1fr' : '1fr';
    for (const [target, value] of list) {
      const row = node('div', fields, 'padding:16px 22px;border-radius:16px;border:1px solid #7b9bbb32;border-left:3px solid #7db2ff;background:linear-gradient(115deg,#52667e29,#1c293a66);white-space:pre-wrap;overflow-wrap:anywhere;transform-origin:left center');
      row.dataset.target = target; row.textContent = value;
      if (id === 'B3' && target === 'conclusion') row.style.gridColumn = '1 / -1';
      if (id === 'B4') { row.style.borderLeftColor = '#f5b92e'; row.style.color = '#f5d79a'; }
    }
  }
  window.kineticStoryVisualAt = async (span, time) => {
    const enabled = span.visuals?.length > 0;
    for (const [el, visibility] of saved) el.style.visibility = visibility;
    saved.clear();
    if (!enabled) { if (layer) layer.style.display = 'none'; window.STORY_VISUAL_STATE = null; return; }
    if (!layer) init();
    for (const scene of SCENES) if (span.activeUnits.includes(scene.id)) {
      saved.set(scene.el, scene.el.style.visibility); scene.el.style.visibility = 'hidden';
    }
    layer.style.display = 'block';
    if (layer.dataset.shot !== span.key) { setFields(span); layer.dataset.shot = span.key; }
    const entry = span.visuals.find(v => time >= v.at && time < v.until);
    const visibleTargets = [];
    for (const row of fields.children) {
      const at = targets(span, row.dataset.target), k = ease((time - at) / .65);
      row.style.opacity = String(k); row.style.transform = `translateX(${(1-k)*42}px) rotateY(${(1-k)*-26}deg)`;
      const active = (span.narrationBeats || []).some(b => b.target === row.dataset.target && b.at <= time && time < b.until);
      row.style.borderColor = active ? '#9abde0aa' : '#7b9bbb32';
      if (k > .01) visibleTargets.push(row.dataset.target);
    }
    const headlineProgress = ease((time - targets(span, ['headline', span.id === 'B1' ? 'keyword' : span.id === 'B4' ? 'summary' : 'heading'])) / .55);
    heading.style.opacity = String(headlineProgress); heading.style.transform = `translateY(${(1-headlineProgress)*-26}px) scale(${.92+.08*headlineProgress})`;
    if (fields.getBoundingClientRect().bottom > (USER_INPUT.layout === 'portrait' ? 745 : 855)) throw Error('STORY_TEXT_OVERFLOW: shorten visible labels or divide the visual scene; keep the complete narration.');
    if (!entry) { frame.style.opacity = '0'; label.textContent = ''; window.STORY_VISUAL_STATE = { shot: span.shotIndex, visibleTargets, media: null }; return; }
    const media = USER_INPUT.media[entry.role];
    if (!media) throw Error('Missing prepared visual: ' + entry.role);
    const frameIndex = Math.max(0, Math.min(media.frames - 1, Math.floor((time - entry.at) * media.fps + 1e-6)));
    const source = media.mode === 'image' ? MEDIA_PATH(media.file) : MEDIA_PATH(media.directory) + '/' + String(frameIndex).padStart(5, '0') + '.jpg';
    if (source !== lastSource) { picture.src = source; await picture.decode(); lastSource = source; }
    if (!picture.naturalWidth) throw Error('Visual did not decode: ' + source);
    picture.style.objectFit = entry.fit;
    const progress = ease((time - entry.at) / .45);
    frame.style.opacity = String(progress); frame.style.transformOrigin = 'center center';
    frame.style.transform = `perspective(1400px) translateY(${(1-progress)*32}px) rotateY(${(1-progress)*-12}deg) scale(${.94+.06*progress})`;
    label.textContent = entry.label || ''; label.style.opacity = String(progress);
    window.STORY_VISUAL_STATE = { shot: span.shotIndex, captionIndex: entry.captionIndex, role: entry.role, source, frameIndex: media.mode === 'image' ? null : frameIndex, visibleTargets, media: { width: picture.naturalWidth, height: picture.naturalHeight }, opacity: progress };
  };
})();
