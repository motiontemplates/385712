/* Optional sentence-bound visual development. Native clocks stay untouched. */
(function (root) {
  'use strict';
  function schedule(span, target, fallback) {
    const beats = span?.narrationBeats || [];
    const targets = Array.isArray(target) ? target : [target];
    const matched = beats.filter(b => targets.includes(b.target) && Number.isFinite(b.at) && Number.isFinite(b.until) && b.until > b.at);
    return matched.length ? Math.min(...matched.map(b => b.at)) : fallback;
  }
  function state(time, at, duration = .42) {
    if (!Number.isFinite(at)) return { opacity: 1, translateY: 0, scale: 1 };
    const p = Math.max(0, Math.min(1, (time - at) / duration)), e = 1 - (1 - p) ** 3;
    return { opacity: Math.min(1, p * 3), translateY: (1-e)*20, scale: .98+.02*e };
  }
  function apply(node, time, at, enabled) {
    if (!node) return;
    // Only inner content is changed, preserving native geometry, source motion,
    // portrait transforms, gradients and outer focus/exit effects.
    if (!enabled) {
      if (node.__narrationReveal) {
        Object.assign(node.style, node.__narrationReveal);
        delete node.__narrationReveal;
      }
      return;
    }
    if (!node.__narrationReveal) node.__narrationReveal = {
      opacity: node.style.opacity, translate: node.style.translate, scale: node.style.scale
    };
    const s = state(time, at);
    node.style.opacity = String(s.opacity);
    node.style.translate = `0 ${s.translateY}px`;
    node.style.scale = String(s.scale);
  }
  root.MotionNarrationReveal = { schedule, state, apply };
})(typeof globalThis !== 'undefined' ? globalThis : window);
