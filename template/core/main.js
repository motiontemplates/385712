
(function () {
  const Q = new URLSearchParams(location.search);
  window.END = CONFIG.end;
  window.renderAt = function (t) {
    const active = SCENES.filter(sc => t >= sc.s - 1e-4 && t < sc.e);
    for (const sc of SCENES) { const on = active.includes(sc); sc.el.style.display = on ? 'block' : 'none'; if (sc.top) sc.top.style.display = on ? 'block' : 'none'; }
    let cam = null;
    for (const sc of active) { window.ACTIVE_NATIVE_UNIT=sc.id;sc.update(t); const c = sc.cam(t); if (c) cam = c; }
    const w = $('world');
    if (cam) w.style.transform = `translate(${(cam.sx || 0).toFixed(2)}px,${(cam.sy || 0).toFixed(2)}px) scale(${(cam.z || 1).toFixed(4)}) rotate(${(cam.r || 0).toFixed(3)}deg) translate(${(960 - (cam.x || 960)).toFixed(2)}px,${(540 - (cam.y || 540)).toFixed(2)}px)`;
    else w.style.transform = '';
    if(USER_INPUT.layout==='portrait'&&cam)w.style.transform=window.kineticPortraitCamera(cam);
    window.CAM = cam || {};
    window.GLOBAL(t);
    $('fade').style.opacity = clamp((t - (END - .5)) / .45).toFixed(3);
    window.OVERLAY(t);
  };
  window.READY = (async () => {
    await document.fonts.ready;
    await Promise.all(['900 40px PuHuiTi', '40px Anton', '500 20px "Geist Mono"', '600 20px Geist'].map(f => document.fonts.load(f, '字ABC0123')));
    await Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })));

    document.title = 'done';
  })();
})();
