# 01 · Record crate: your projects, one record each

**What you get:** a crate of records. Drag or swipe sideways and the records flip past, one rises out of the crate, and a panel shows that project with a button that opens it. Arrow keys work, and so do Home and End.

**Try it:** open `examples/record-crate/index.html`. It uses grey placeholders where your photos go.

## The idea that makes it look real

A flat picture of records in a crate can't have records slide in and out. So the crate is **three layers stacked**:

1. **Back:** your crate photo with the records removed (or a photo of an empty crate).
2. **Sleeves:** your record covers, standing up and moving sideways.
3. **Front:** the same crate photo again, clipped so only the **front wall** shows. It sits on top of the sleeves, so the sleeves look like they're *inside* the crate.

That's it. The "magic" is one photo used twice, with the top of the second copy hidden.

## What you need

- A straight-on photo of a crate (a milk crate, a wooden box, a record bin). Take it with the box facing you.
- Cover art or a photo for each project. A project without art can use a blank sleeve with its name handwritten on it.
- Your list of projects: title, a short summary, and where it links.

See `ASSETS.md` for cut-outs and licences.

## Prompt to give your assistant

```text
Build a record crate for my Projects page, using the example in
examples/record-crate as the starting point.

My photos: crate-back (crate with the records removed) and crate-front (the same
photo, used for the front wall). My projects are: [title, one-line summary,
link, and a cover image for each].

Rules:
- Records stand inside the crate. They don't float in front of it.
- Drag or swipe sideways to flip, arrow keys to step, click a record to bring it
  forward. Enter opens the selected project.
- A panel next to the crate shows the selected project and a button that opens it.
- Must work on a phone: swiping sideways flips records, vertical swipes still
  scroll the page.
- Respect reduced motion: no sliding animation for people who turn it off.
- If a project has no cover, use a blank sleeve with the project name written on it.
- Don't invent covers. If I haven't given one, leave the placeholder.

Show me the crate and tell me what you haven't checked, then stop.
```

## Tuning it to your photo

Open `record-crate.css`. Two numbers depend on your photo:

| Setting | What it controls | How to find yours |
|---|---|---|
| `.rcfront { clip-path: inset(39.1% 0 0 0) }` | How much of the front layer's top is hidden. It should hide everything above the crate's front rim. | Raise or lower the % until the sleeves look like they sit behind the front wall. |
| `.rcslv { clip-path: inset(-45% 17.2% 0 17.2%) }` | The window the sleeves live in. The sides stop sleeves poking out past the crate's walls. | Match the 17.2% to the crate's side thickness. The negative top lets sleeves rise above the crate. |

If the records look like they float in front of the crate, the front layer is clipped too low. If the front wall covers too much of the sleeves, it's clipped too high.

## What goes wrong

- **Sleeves poke out past the crate's sides.** Increase the left and right % in the sleeve window.
- **Two sleeves overlap oddly.** The active one needs the highest layer; the code does this by distance. Check your records aren't too wide for the crate.
- **Dragging on a phone scrolls the page.** The crate needs `touch-action: pan-y` (it's in the CSS). Don't remove it.
- **Keyboard users can't tell which record is selected.** Keep the blue outline on the selected sleeve.
