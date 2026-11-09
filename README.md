# Analog desk guide

Turn real photographed objects into a website people can poke at: a crate of records that holds your projects, a globe or disco ball that spins when you hover, a magazine rack of your Substack covers that updates itself, and a way to drag everything into place and keep the layout.

This is the guide behind [kellyupp.com](https://kellyupp.com), where every object opens a page (resume, projects, services, about, writing, contact). You don't need to know how to code. You describe what you want to an AI coding assistant, look at what it makes, and tell it what to change.

> **Photos are not included.** The code and prompts here are MIT licensed (see `LICENSE`). The photos and writing on kellyupp.com belong to their owners and are not in this repo. You'll source your own, and `ASSETS.md` says what to get and how to check the licence.

## What's in here

| Guide | What you build | Try the working example |
|---|---|---|
| [01 Record crate](guides/01-record-crate.md) | A crate of records you flip through, one record per project | `examples/record-crate/index.html` |
| [02 Hover-to-spin object](guides/02-hover-video-object.md) | A globe, disco ball or anything else that plays a short video on hover, with the white background removed | `examples/hover-video/index.html` |
| [03 Arrange mode](guides/03-arrange-mode.md) | Drag your objects where you want them, then copy the layout and hand it back to your assistant | `examples/arrange-mode/index.html` |
| [04 Magazine rack](guides/04-magazine-rack.md) | Your Substack covers on a real shelf, kept up to date by a daily sync (needs Node for the sync) | `examples/magazine-rack/index.html` |

Start with [BUILD_GUIDE.md](BUILD_GUIDE.md) for the accounts and tools, and [ASSETS.md](ASSETS.md) for the photos.

## The working examples

Each example is plain HTML, CSS and JavaScript. No install, no build step (the Substack sync in the magazine rack needs Node). Open the folder's `index.html` in a browser, or run `python3 -m http.server` in this folder and visit `http://localhost:8000/examples/record-crate/`.

The examples use neutral grey boxes labelled "PHOTO NEEDED" where your photos go. They show how the pieces behave, not what yours should look like.

## The one rule that makes this work

Show options and pick before it builds. Fonts, colours, layout, backgrounds: tell your assistant to show you choices first and wait. Every time I skipped that, it built something I didn't want. The prompt for it is in `BUILD_GUIDE.md`.

## Licence

Code and prompts: MIT, see `LICENSE`. Photos and writing: not included, not covered.
