# CapyConnect

**Interviews that work for everyone — without asking anyone to disclose why.**

CapyConnect is a Chrome extension that quietly adapts your existing video calls (Google Meet, Zoom, Microsoft Teams) so behavioral interviews measure how candidates actually think, not how fast they talk, how well they perform under stress, or how comfortable they are with rapid-fire conversation.

---

## Why we built it

Interview tools were designed for one kind of communicator. They reward speed, social ease, and short-term memory — and quietly screen out people who think more carefully, process language differently, or simply need a moment.

Candidates can already ask for accommodations. Most don't. Disclosure feels like a risk, and "request a slower interview" isn't a button on any HR portal.

CapyConnect makes the accommodation invisible. The candidate turns on the tools they need. The interviewer never has to know why.

---

## What it does

### For candidates
- **Live captions** for every spoken question, persistently on screen so you can re-read instead of trying to remember.
- **Always-visible questions** — the current question stays pinned while you think and respond.
- **Thinking pause** — one click signals the interviewer that you need a moment, without having to interrupt.
- **Blur tool** — desaturate or hide any part of your screen (notes, distractions, your own video preview) without exiting the call.
- **Capy companion** — an optional on-screen capybara mascot that breathes calmly. Soft regulation for high-pressure moments.
- **Reading-friendly font** and **black & white mode** — one-tap accessibility presets that change how the overlay looks, not what it does.
- **Communication preferences** set once — captions, pacing, focus tools all come back the way you want them, every interview.

### For interviewers
- **Schedule and run interviews** from a clean dashboard, with questions stored per candidate.
- **Bias check on every question** — AI flags wording that disadvantages specific candidates and suggests neutral rewrites you can apply with one click.
- **Question board** that pushes your current question to the candidate's screen in real time, so you don't have to repeat yourself.
- **Same overlay, your side** — see what the candidate sees, drag panels around, minimize anything to the edge of the screen.

### For both
- **Live on real calls.** CapyConnect doesn't replace your interview platform — it overlays on top of the one you already use.
- **No diagnosis disclosure required.** Candidates configure their own experience. Interviewers see a normal call.
- **Minimal, draggable, dismissible** — every panel can be moved, minimized to a side tab, or hidden entirely.

---

## Get started

### Candidates
1. Install the CapyConnect Chrome extension.
2. Open the popup, choose **🧑‍💻 Candidate**, and set your preferences.
3. Join your interview as usual — the overlay loads automatically on supported video platforms.

### Interviewers
1. Sign up at the CapyConnect web app and add your team.
2. Schedule an interview, paste in your questions, and let the bias checker review them.
3. Install the extension and pick **👔 Interviewer** to push questions live during the call.

### Supported video platforms
Google Meet · Zoom (web) · Microsoft Teams

---

## A note on the name

Capybaras are calm. They share hot springs with orange-bearing wildlife and don't judge anyone for how long it takes to answer a question. We thought that was a good vibe for an interview tool.

---

## For developers

This is a monorepo with two surfaces and three shared packages:

```
quietspace/
├── apps/
│   ├── web/          # Next.js — marketing, dashboard, onboarding, simulated interview
│   └── extension/    # Chrome MV3 — overlay content script, popup, options
├── packages/
│   ├── shared-types/ # TS interfaces used by both surfaces
│   ├── shared-ui/    # Design primitives + interview components
│   └── shared-lib/   # Supabase + OpenAI clients, prompt templates
```

Quick start:

```bash
npm install
npm run dev:web          # → http://localhost:3000
npm run dev:extension    # → outputs to apps/extension/dist
```

Load the unpacked extension from `apps/extension/dist` in `chrome://extensions` (Developer mode → Load unpacked).

Type-check and build everything:

```bash
npm run typecheck
npm run build:all
```
