// Record crate. Drag or swipe sideways to flip through, arrow keys to step, Home/End to jump, click a record to bring it forward.
// recordCrate(host, records, { start, onSelect(i), onActivate(i), backHTML, frontHTML })
//   records: [{ title, kind, art, label }]  (art = image URL; without it a blank sleeve shows `label`)
function recordCrate(host, records, opts) {
  opts = opts || {};
  var N = records.length, calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  host.innerHTML =
    '<div class="rc" tabindex="0" role="group" aria-roledescription="record crate" aria-label="Record crate. Drag, swipe or use the arrow keys to browse. Press Enter to open the selected record.">' +
    (opts.backHTML || '<img class="rcback" src="crate-back.webp" alt="">') +
    '<div class="rcslv"></div>' +
    (opts.frontHTML || '<img class="rcfront" src="crate-front.webp" alt="A crate of records">') + '</div>';
  var rc = host.querySelector('.rc'), slv = rc.querySelector('.rcslv'), els = [];

  records.forEach(function (r, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'rcs';
    b.setAttribute('aria-label', r.title + (r.kind ? ', ' + r.kind : ''));
    b.innerHTML = r.art ? '<img src="' + r.art + '" alt="" draggable="false">' : '<span class="ph">' + (r.label || r.title) + '</span>';
    b.addEventListener('click', function (e) { if (e.detail === 0) select(i); }); // keyboard "click"; mouse clicks are handled on pointerup
    b.addEventListener('focus', function () { if (b.matches(':focus-visible')) select(i); });
    slv.appendChild(b); els.push(b);
  });

  var pos = Math.max(0, Math.min(N - 1, opts.start || 0)), active = Math.round(pos), drag = null;
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // pos can be fractional while dragging. A sleeve's distance from pos decides how high it stands, how far it sits sideways and how tilted it is.
  function layout(p, instant) {
    els.forEach(function (b, i) {
      var d = i - p, near = Math.max(0, 1 - Math.abs(d));
      var rest = 13, act = 27;               // how far a sleeve stands above the crate rim, in container widths
      b.style.transition = (instant || calm) ? 'none' : '';
      b.style.top = (50 - (rest + (act - rest) * near)) + 'cqw';
      b.style.transform = 'translateX(' + (d * 14.5).toFixed(2) + 'cqw) rotate(' + clamp(d * 4, -10, 10).toFixed(2) + 'deg) scale(' + (1 + 0.07 * near).toFixed(3) + ')';
      b.style.zIndex = String(30 - Math.round(Math.abs(d) * 4));
      b.classList.toggle('on', i === active);
    });
  }
  function select(i, quiet) { i = clamp(i, 0, N - 1); active = i; pos = i; layout(pos); if (!quiet && opts.onSelect) opts.onSelect(i); }

  rc.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    drag = { x: e.clientX, pos: pos, moved: false, id: e.pointerId, step: rc.getBoundingClientRect().width * 0.145 };
  });
  rc.addEventListener('pointermove', function (e) {
    if (!drag) return; var dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; try { rc.setPointerCapture(drag.id); } catch (err) {} rc.classList.add('drag'); }
    if (drag.moved) { pos = clamp(drag.pos - dx / drag.step, -0.35, N - 0.65); layout(pos, true); }
  });
  rc.addEventListener('pointerup', function (e) {
    if (!drag) return; var d = drag; drag = null; rc.classList.remove('drag');
    if (d.moved) select(Math.round(pos));                                   // snap to the nearest record
    else { var t = e.target.closest && e.target.closest('.rcs'); if (t) select(els.indexOf(t)); }
  });
  rc.addEventListener('pointercancel', function () { if (drag) { drag = null; rc.classList.remove('drag'); select(active); } });
  rc.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { select(active + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { select(active - 1); e.preventDefault(); }
    else if (e.key === 'Home') { select(0); e.preventDefault(); }
    else if (e.key === 'End') { select(N - 1); e.preventDefault(); }
    else if (e.key === 'Enter' && e.target === rc && opts.onActivate) { opts.onActivate(active); e.preventDefault(); }
  });
  layout(pos, true); select(active);
  return { select: select };
}
