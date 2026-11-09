// Pulls a Substack archive and each post's share image into substack.json and covers/.
// NOTE: these Substack endpoints are undocumented and can change without notice. On any failure this script
// keeps the saved snapshot and exits normally, so it never breaks your build.
//
// Usage: SUBSTACK_PUBLICATION=https://yourname.substack.com node sync-substack.mjs
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const BASE = (process.env.SUBSTACK_PUBLICATION || 'https://YOUR-PUBLICATION.substack.com').replace(/\/$/, '');
const SNAPSHOT = new URL('./substack.json', import.meta.url);
const OUT_DIR = new URL('./covers/', import.meta.url);
const STYLES = ['title', 'overlay', 'split']; // share-image treatments; the script never uses one three times in a row
const exists = (u) => access(u).then(() => true, () => false);

async function getJSON(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchArchive() {
  const seen = new Map();
  let offset = 0;
  for (let guard = 0; guard < 100; guard++) {
    // Omit `offset` on the first page.
    const url = `${BASE}/api/v1/archive?sort=new&limit=12${offset ? `&offset=${offset}` : ''}`;
    let data;
    try { data = await getJSON(url); }
    catch (e) {
      // Substack answers 400 for an offset past the end of a small archive. After a good first page, that means "no more".
      if (offset > 0 && seen.size > 0 && String(e.message).startsWith('400')) break;
      throw e;
    }
    const batch = Array.isArray(data) ? data : data.posts;
    if (!Array.isArray(batch) || batch.length === 0) break; // an empty page is the end; a short one is not
    let added = 0;
    for (const p of batch) if (!seen.has(p.id)) { seen.set(p.id, p); added++; }
    if (added === 0) break; // pagination repeated itself
    offset += batch.length;
  }
  return [...seen.values()].filter((p) => ['newsletter', 'thread', 'podcast'].includes(p.type));
}

const hash = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

// Substack re-renders share images on every request, so the bytes differ even when the cover doesn't.
// Compare a tiny grayscale fingerprint instead and only treat a clearly different picture as an edit.
async function fingerprint(buf) {
  const raw = await sharp(buf).resize(24, 30, { fit: 'fill' }).grayscale().raw().toBuffer();
  return raw.toString('base64');
}
function distance(a, b) {
  const x = Buffer.from(a, 'base64'), y = Buffer.from(b, 'base64');
  if (x.length !== y.length) return 255;
  let sum = 0;
  for (let i = 0; i < x.length; i++) sum += Math.abs(x[i] - y[i]);
  return sum / x.length;
}

async function cacheCover(post, style, ratio) {
  const file = new URL(`${post.slug}.webp`, OUT_DIR);
  const meta = new URL(`${post.slug}.json`, OUT_DIR);
  const res = await fetch(`${BASE}/api/v1/press_kit/asset/${post.id}/${style}/composed?aspectRatio=${ratio}`);
  if (!res.ok) throw new Error(`cover ${res.status} for ${post.slug}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const fp = await fingerprint(buf);
  if (await exists(file) && await exists(meta)) {
    const m = JSON.parse(await readFile(meta, 'utf8'));
    if (m.fp && m.style === style && m.ratio === ratio && distance(m.fp, fp) < 6) return m; // same picture: keep the saved file
  }
  const out = await sharp(buf).resize({ width: 720 }).webp({ quality: 82 }).toFile(fileURLToPath(file));
  const m = { fp, style, ratio, width: out.width, height: out.height };
  await writeFile(meta, JSON.stringify(m));
  console.log(`substack: updated cover for ${post.slug}`);
  return m;
}

async function main() {
  if (BASE.includes('YOUR-PUBLICATION')) throw new Error('set SUBSTACK_PUBLICATION first');
  await mkdir(OUT_DIR, { recursive: true });
  const archive = await fetchArchive();
  if (!archive.length) throw new Error('archive returned no posts');

  const posts = [];
  const used = [];
  for (const p of archive) {
    // Pick a style from a stable hash; if that would make three the same in a row, take the next one.
    let style = STYLES[hash(p.id) % STYLES.length];
    while (used.length >= 2 && used.at(-1) === style && used.at(-2) === style) style = STYLES[(STYLES.indexOf(style) + 1) % STYLES.length];
    used.push(style);
    const ratio = hash(p.slug) % 3 === 0 ? 'stories' : 'grid'; // 9:16 now and then, 4:5 otherwise, stable per post
    let cover;
    try { cover = await cacheCover(p, style, ratio); } catch (e) { console.warn('cover skipped:', e.message); }
    posts.push({
      id: p.id, slug: p.slug, title: p.title, date: p.post_date.slice(0, 10),
      subtitle: p.subtitle || p.description || '',
      tags: (p.postTags || []).map((t) => t.name || t).filter(Boolean),
      url: p.canonical_url, free: p.audience === 'everyone',
      image: cover ? `covers/${p.slug}.webp` : null, width: cover?.width ?? null, height: cover?.height ?? null, style: cover?.style ?? null,
    });
  }

  // Only rewrite the snapshot when posts changed, so a daily job doesn't commit a new timestamp for nothing.
  let previous = null;
  try { previous = JSON.parse(await readFile(SNAPSHOT, 'utf8')); } catch { /* first run */ }
  if (previous && JSON.stringify(previous.posts) === JSON.stringify(posts)) { console.log(`substack: ${posts.length} posts, no changes`); return; }
  await writeFile(SNAPSHOT, JSON.stringify({ publication: `${BASE}/`, syncedAt: new Date().toISOString(), posts }, null, 2) + '\n');
  console.log(`substack: ${posts.length} posts synced`);
}

main().catch((e) => { console.warn(`substack sync skipped (${e.message}); keeping the saved snapshot`); });
