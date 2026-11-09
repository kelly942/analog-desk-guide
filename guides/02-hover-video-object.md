# 02 · Hover-to-spin: a globe or disco ball that plays on hover

**What you get:** an object (a globe, a disco ball, a record) that sits still until someone hovers over it, then plays a short video. On a phone it plays when tapped. The video's white background disappears, so the object sits right on your page.

**Try it:** open `examples/hover-video/index.html`. It shows a grey "VIDEO NEEDED" box where your video goes, with instructions in the file for swapping yours in. Once you add one, it plays over a grey card so you can see there is no box around it.

## The trick: white disappears if you multiply it

Videos don't have transparent backgrounds. Instead:

1. Film the object on a **plain white background**.
2. Push every near-white pixel to **pure white**.
3. On the page, set `mix-blend-mode: multiply`. Multiplying by white leaves the page colour unchanged, so the white vanishes and only the object remains.

That's all. It works on any page whose background is white.

## Making the video

1. Film the object spinning, 2 to 6 seconds, on a white surface in even light. A phone is fine. Keep it still: tripod or a stack of books.
2. Run the helper script in `examples/hover-video/make-video.sh`:

```sh
./make-video.sh my-clip.mp4 my-object.mp4
# or crop to the object: ./make-video.sh my-clip.mp4 my-object.mp4 600:600:100:40
```

It needs [ffmpeg](https://ffmpeg.org/) (your assistant can install it for you). It does three things: pushes near-white to pure white, optionally crops, and makes an mp4 that plays everywhere. It also writes a poster image (`my-object.jpg`), which shows before the video plays.

**Why it asks for "full range" video:** video files normally treat white as slightly grey after compression, which leaves a faint box once multiplied. The script keeps white as white. I measured about 254 out of 255 in a browser, which isn't visible.

## Prompt to give your assistant

```text
Add a hover-to-spin [globe / disco ball] to my page, using the example in
examples/hover-video as the starting point. My video is [filename], on a plain
white background. Make a version with the white background cleaned up using
make-video.sh.

Rules:
- Plays on hover and keyboard focus, pauses when I leave.
- On a phone, plays on tap.
- Shows a still poster image before it plays.
- If someone has reduced motion turned on, never autoplay or play on hover.
- It must not have a visible box around it on my white page.
- It's a button, so make it reachable with the keyboard and give it a label.

Show me it on desktop and phone, say what you haven't verified, and stop.
```

## Things to know

- **It only blends on white.** If your page background isn't white, the object will tint. Use a different approach for coloured pages (a transparent WebM, or a cut-out image sequence).
- **Objects overlapping each other:** a multiplied video shows through anything behind it. If it overlaps another object it looks ghostly. Keep it on top of plain white, or keep it behind opaque objects. On my site I made the globe sit behind everything else in one view for this reason.
- **Videos are heavy.** Keep clips short and small (a few hundred KB). Use `preload="metadata"` so nothing downloads until needed.
- **Phones don't hover.** Always provide a tap path.
