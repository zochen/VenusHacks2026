# QuietSpace — Team Getting Started

Read this once, then start building. 10 minutes top.

## 0. Prereqs


## 1. First-time setup (everyone)

```bash
git clone <repo-url> VenusHacks2026
cd VenusHacks2026
npm install           # installs all 5 workspaces
cp .env.example .env  # fill in Supabase + OpenAI keys when Person 3/4 share them
```

Sanity check — this should pass before you write a single line of code:

```bash
npm run build:all
```

If it fails on a fresh clone, **post in the group chat before doing anything else.** Don't try to fix it solo.

## 2. Run the two surfaces

Open two terminals.

**Terminal A — web app:**
```bash
npm run dev:web
# → http://localhost:3000
```

**Terminal B — extension (watch mode):**
```bash
npm run dev:extension
# → rebuilds into apps/extension/dist on every save
```

**Load the extension in Chrome** (once):
1. Go to `chrome://extensions`
2. Toggle **Developer mode** (top right)
3. Click **Load unpacked** → select `apps/extension/dist`
 Pin the CapyConnect icon to your toolbar
5. Open https://meet.google.com — the overlay should appear

After code changes the extension auto-rebuilds, but you may need to click the reload icon on the extension card in `chrome://extensions`, then refresh the Meet/Zoom tab.

## 3. Branching + merging

  ```bash
  git checkout -b p1/captions
  ```

## 4. Coordination rules

These files are **load-bearing for everyone** — ping the group chat before editing:


Every stub file has an `OWNER:` header. Don't edit files owned by someone else without asking.

## 5. Per-person quick start

Each person, your first task is to **make your stub file render something real** so we know the wiring works.

### Person 1 — Candidate Experience
Files to open first:

First task: get the `CaptionOverlay` rendering a hard-coded transcript line on **both** the web simulator page and the extension overlay. That proves the shared-ui pipeline works end-to-end. Then wire up Web Speech API.

### Person 2 — Interviewer + Onboarding
Files to open first:

First task: build the communication-style picker on `/onboarding` (3 cards — default / relaxed / focus). Save selection to local state for now; Person 3 will plug in Supabase later.

### Person 3 — Backend / Integrations
Files to open first:

First task: stand up the Supabase project, create `users` / `interviews` / `preferences` tables, share keys in the group chat, and get `createSupabaseClient` returning a real client. Then wire `chrome.storage` token handoff from web → extension.

### Person 4 — AI + Marketing + Design system
Files to open first:

First task: finalize the color palette + type scale in `tokens.ts`, ship a real `Button` with variants, and put together the landing page hero. Then wire `clarify-question` to OpenAI using the prompt in `shared-lib/openai/prompts.ts`.

## 6. The demo plan (keep this in mind)


## 7. Common gotchas


## 8. Ask for help fast

If you're stuck for >20 minutes, post in the group chat. Hackathon time is the most expensive resource we have.

Good luck — let's ship something nice. 🐹
