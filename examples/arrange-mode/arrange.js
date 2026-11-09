// Arrange mode: drag objects where you want them, press "Get layout", and the positions come out as JSON
// (percent of the canvas, so they hold at any screen size). Paste that JSON to your assistant: "use these positions".
// Any element with class "obj" and a data-key is draggable. Positions are left/top percentages of #canvas.
(function () {
  var canvas = document.getElementById('canvas'), objs = [].slice.call(canvas.querySelectorAll('.obj')), drag = null, z = 10;
  objs.forEach(function (o) {
    o.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      drag = { o: o, sx: e.clientX, sy: e.clientY, ox: o.offsetLeft, oy: o.offsetTop };
      o.setPointerCapture(e.pointerId); o.style.zIndex = ++z; o.classList.add('drag');
    });
    o.addEventListener('pointermove', function (e) {
      if (!drag || drag.o !== o) return;
      o.style.left = (drag.ox + e.clientX - drag.sx) + 'px'; o.style.top = (drag.oy + e.clientY - drag.sy) + 'px';
    });
    function end() { if (drag && drag.o === o) { o.classList.remove('drag'); drag = null; } }
    o.addEventListener('pointerup', end); o.addEventListener('pointercancel', end);
  });

  document.getElementById('get').addEventListener('click', function () {
    var W = canvas.clientWidth, H = canvas.clientHeight, out = {};
    objs.forEach(function (o) { out[o.dataset.key] = { x: +(o.offsetLeft / W * 100).toFixed(1), y: +(o.offsetTop / H * 100).toFixed(1) }; });
    var box = document.getElementById('out'), msg = document.getElementById('msg');
    box.value = JSON.stringify(out); box.hidden = false; box.focus(); box.select();
    // Only say "copied" if the browser really did it. Otherwise the text is selected for you to copy by hand.
    var ok = false; try { ok = document.execCommand('copy'); } catch (err) {}
    msg.textContent = ok ? 'Copied. (It is also in the box.)' : 'Not copied automatically: the text is selected, so press Cmd+C (Ctrl+C on Windows).';
  });
})();
