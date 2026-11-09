# 03 · Arrange mode: drag your objects into place

**What you get:** a way to lay out your desk by dragging, not by describing coordinates. Open your page with `?arrange` on the end, drag everything where you like, press **Get layout**, and your assistant gets exact positions to build into the page.

**Try it:** open `examples/arrange-mode/index.html`. Drag the grey boxes, then press the button.

## Why it exists

"Move the phone a bit to the left and down" takes ten rounds. Dragging takes ten seconds. The output is a small piece of data:

```json
{"notebook":{"x":8,"y":12},"phone":{"x":34,"y":8},"crate":{"x":60,"y":30}}
```

Each number is a **percentage of the canvas**, so the layout holds on a wide monitor and a small laptop. Paste it to your assistant: "use these positions."

## How it works

- Every object has an `x` and `y` written as percentages (`left: 34%`).
- In arrange mode, dragging moves the object by pixels.
- **Get layout** turns each object's pixel position back into a percentage of the canvas, and puts the result in a box, selected for copying.
- Drags are temporary. Reload and everything snaps back until you paste the layout into the page's real positions.

## Prompt to give your assistant

```text
Add an arrange mode to my desk page, based on examples/arrange-mode. It should
only turn on when the address ends with ?arrange.

- I can drag any object. The page should look the same otherwise.
- A "Get layout" button shows each object's x and y as a percentage of the
  desk, in a text box I can copy, with the text already selected.
- Only say "Copied" if the copy actually worked. Otherwise tell me to press
  Cmd+C.
- Dragging must be disabled on phones (it fights with scrolling).
- Keep the desk's shape fixed so percentages mean the same thing on every screen.

Then, when I paste a layout back to you, apply those positions to the page.
```

## Things that went wrong for me

- **It said "Copied" when nothing was copied.** Browsers sometimes block automatic copying. The example only claims success if the browser confirms it, and always leaves the text selected as a backup.
- **Positions looked different on another screen.** The canvas needs a fixed shape (`aspect-ratio`). Without it, percentages of a changing height drift.
- **On phones the layout is different on purpose.** Below a certain width my site turns the scatter into two columns. Arrange mode is for the wide layout only.
