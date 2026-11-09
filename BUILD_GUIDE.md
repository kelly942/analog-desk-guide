# Build guide: accounts, tools, and how to talk to your assistant

## What you need

| Tool | What it does | Notes |
|---|---|---|
| An AI coding assistant (I use Claude Code) | Writes and edits the website files from your instructions | Check the current plans and limits on the provider's site; they change |
| GitHub | Stores your site's files and their history | A free account is enough. Make the repo **private** until you've checked your photos' licences |
| Vercel | Puts your site online and redeploys every time you merge to your main branch | A free account is enough to start |
| A domain (optional) | Your own address, like yourname.com | Skip it until the site is done |

You don't need to write code. You need to be clear about what you want and what you don't.

## The working loop

1. **Describe** what you want in plain language.
2. **Ask for options first.** For anything about how it looks, make your assistant show choices and wait.
3. **Look** at what it made, on desktop and phone.
4. **Correct** it with specifics ("the crate is too big", "records should come out of the sleeve a bit").
5. **Keep a version you like** before trying another direction.
6. **Publish** only when you've approved it.

## A prompt to start every project

```text
I'm building a personal website made of real photographed objects, where each
object opens a page. Use the guides at https://github.com/kelly942/analog-desk-guide/tree/main.

Work this way:
- Show me options and wait for my pick before building anything about how it
  looks: fonts, colours, backgrounds, layout.
- Never invent photos. If a photo is missing, leave a neutral "Photo needed"
  placeholder and tell me.
- Never invent facts about me: clients, results, dates, numbers. Leave a
  visible [bracketed] placeholder for anything you don't know.
- Do one step at a time. Show me what changed, say what you haven't verified,
  and stop.
- Ask before publishing anything or doing anything that costs money.

First, ask me what the site is for, who it's for, and what objects I have.
```

## Putting it online

Once you like it locally:

```text
I approve this version. Walk me through putting it online: create a GitHub
repo (private), connect it to Vercel, and publish it as a separate project so
nothing else of mine is overwritten. Tell me before anything costs money. When
it's live, check every page on desktop and phone, and give me the address.
```

## Things that went wrong for me (so they don't for you)

- **A redirect that matched my photo folder** made every photo disappear on the live site. After any redirect change, load a page with photos on the real address.
- **I merged too early.** Ask your assistant to wait for your "approved" before merging.
- **Looks fine on a laptop, broken on a phone.** Always check a phone width before publishing.
