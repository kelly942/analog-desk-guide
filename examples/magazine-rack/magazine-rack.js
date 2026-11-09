// Magazine rack: lays Substack covers (from substack.json) on a shelf photo, a row at a time.
// Plain script (no modules), so index.html works when opened straight from disk.
// magazineRack(hostElement, data, { shelf: 'images/shelf.webp', perRow: 7 })

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// A stable hash, so each post always gets the same lean and height.
const hash = (str) => { let h = 0; for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
const fmtDate = (d) => { try { return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); } catch { return d; } };

function magazineRack(host, data, opts = {}) {
  const shelf = opts.shelf === undefined ? 'images/shelf.webp' : opts.shelf; // null = grey placeholder
  const per = opts.perRow || 7;
  const posts = data.posts || []; // a post without a cover image shows a grey placeholder
  const rows = [];
  for (let i = 0; i < posts.length; i += per) rows.push(posts.slice(i, i + per));

  const shelves = rows.map((row) => {
    const n = row.length;
    // Cover height as a share of the shelf width, small enough that a full row fits.
    const base = Math.min(30, (88 - 1.5 * (n - 1)) / (0.8 * n));
    let hmax = 0;
    const covers = row.map((p) => {
      const h = base * (0.93 + (hash(p.slug) % 14) / 100);   // a little height variety
      hmax = Math.max(hmax, h);
      const lean = (((hash(p.id) % 30) - 15) / 10).toFixed(1);  // -1.5 to +1.5 degrees
      const asp = p.width && p.height ? (p.width / p.height).toFixed(3) : '0.8';
      return `<button type="button" class="cvr" data-slug="${esc(p.slug)}" style="--h:${h.toFixed(2)};--r:${lean}deg" aria-label="${esc(p.title)}">
        ${p.image
          ? `<img src="${esc(p.image)}" alt="Cover of ${esc(p.title)}" style="aspect-ratio:${asp}" loading="lazy">`
          : `<span class="ph" style="aspect-ratio:${asp}">COVER NEEDED</span>`}</button>`;
    }).join('');
    return `<div class="ledgeWrap"><div class="ledge" style="--rise:${Math.max(0, hmax - 12).toFixed(1)}">
      ${shelf ? `<img class="ledgeimg" src="${shelf}" alt="" width="1400" height="275">` : `<div class="shelfph">SHELF PHOTO NEEDED</div>`}
      <div class="covers">${covers}</div>
      ${shelf ? `<img class="ledgeimg front" src="${shelf}" alt="" width="1400" height="275">` : ''}</div></div>`;
  }).join('');

  host.innerHTML = `<div class="nsbar"><span class="cnt">${posts.length} published</span>
      <a href="${esc(data.publication)}" target="_blank" rel="noopener">Subscribe on Substack ↗</a></div>
    ${shelves}<div class="preview" id="rack-preview" aria-live="polite"><h3>Pick a cover</h3><p>Each one opens the post on Substack.</p></div>`;

  const preview = host.querySelector('#rack-preview');
  host.querySelectorAll('.cvr').forEach((b) => {
    const p = posts.find((x) => x.slug === b.dataset.slug);
    b.addEventListener('click', () => {
      host.querySelectorAll('.cvr').forEach((c) => c.classList.toggle('on', c === b));
      preview.innerHTML = `<h3>${esc(p.title)}</h3><p>${fmtDate(p.date)}${p.free ? ' · free' : ''}</p><p>${esc(p.subtitle)}</p>
        <a href="${esc(p.url)}" target="_blank" rel="noopener">Read on Substack ↗</a>`;
    });
  });
}
