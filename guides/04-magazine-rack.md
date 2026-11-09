# 04 · Magazine rack: your Substack covers on a real shelf

**What you get:** your Substack posts shown as covers leaning on a photographed shelf. Click a cover and a panel shows the post with a button that opens it on Substack. A small script fetches your posts and covers, so a new post appears on its own.

**Try it:** open `examples/magazine-rack/index.html`. Grey boxes stand in for your shelf photo and covers. Click a cover to see the panel.

## Read this first

This uses Substack endpoints that **aren't documented**: the archive listing and the share-image endpoint. They work today and can change without notice. The sync script is built to fail safely: if anything breaks, it keeps your last good copy and your site keeps working. Check on it now and then.

## How it works

1. **Fetch the posts.** The script reads your archive page by page until a page comes back empty. (The first request leaves out `offset`. A 400 error past the end, once it already has posts, means "no more".)
2. **Fetch each cover.** Every post has a share image. The script downloads it and saves it as a small WebP file.
3. **Save a snapshot.** It writes `substack.json` with each post's title, date, subtitle, link, cover and size.
4. **Draw the shelf.** `magazine-rack.js` reads that file and stands the covers on your shelf photo, seven to a row. Each cover gets a small lean and height that stay the same every time, worked out from the post's name.
5. **Keep it fresh.** A daily GitHub Action runs the script and commits only if something changed.

The shelf uses the same trick as the crate: your shelf photo is drawn twice. One copy sits behind the covers, and a second copy, clipped to just the front lip, sits on top, so the covers look like they rest on the shelf.

## What you need

- A straight-on photo of a shelf or ledge with a visible front lip.
- A Substack publication.
- Node 20 or newer, to run the sync. It's the only part of this repo that needs an install: `npm install` in `examples/magazine-rack/sync/`.

See `ASSETS.md` for photos and licences.

## Prompt to give your assistant

```text
Build a magazine rack for my Writing page from my Substack covers, using the
example in examples/magazine-rack as the starting point.

My publication: [your-publication.substack.com]. My shelf photo: [file].

Rules:
- Run the sync script to fetch posts and covers. Those Substack endpoints are
  undocumented, so say so in a comment, and if they fail keep the saved
  snapshot. Never break my build.
- Only replace a cover if it clearly changed. Substack re-renders the image
  every time, so compare a small fingerprint, not the file bytes.
- Only rewrite the snapshot if the posts changed.
- Covers stand on the shelf, not in front of it. Each cover is a link or button
  that opens the post, and works with a keyboard.
- Add a daily GitHub Action that commits only if something changed.
- Run the sync on every build too.
- Don't invent covers or draw a shelf. If a photo is missing, leave the grey
  placeholder and tell me.

Show me the rack and tell me what you haven't checked, then stop.
```

## Tuning it to your photo

In `magazine-rack.css`, two numbers depend on your shelf:

| Setting | What it controls | How to find yours |
|---|---|---|
| `.ledgeimg.front { clip-path: inset(79% 0 0 0) }` | How much of the front copy is hidden. It should hide everything above the shelf's front lip. | Raise or lower the % until covers look like they rest behind the lip. |
| `.covers { bottom: 2.4cqw }` | How high the covers sit above the bottom of the photo. | Raise it if covers sink into the lip, lower it if they float. |

## What goes wrong

- **The sync prints "skipped".** Substack changed something or you're offline. Your last snapshot is kept. Run it again later.
- **The daily action can't push.** In your repo's Settings, Actions, General, set workflow permissions to "Read and write".
- **Every day commits new covers.** Something is comparing bytes instead of the fingerprint. Keep the fingerprint check.
- **Covers overlap the shelf lip.** The front copy is clipped too low.
- **Paywalled posts.** They still have covers; the link opens Substack's paywall.
- **Tags aren't used yet.** The script saves them, but the example doesn't filter by them.
