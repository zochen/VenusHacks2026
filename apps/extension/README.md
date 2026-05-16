# CapyConnect — Chrome extension (starter)

A Manifest V3 browser extension that injects an accessibility overlay on top of live video interviews (Google Meet, Zoom, Microsoft Teams). This is a **starter scaffold** — it builds, loads, and shows a floating panel on supported sites, but it isn't yet connected to the QuietSpace web app.

## What's in the starter

- **`src/background/index.ts`** — service worker. Opens the web onboarding tab on first install. Owns auth-token persistence to `chrome.storage` (TODO).
- **`src/content/index.tsx`** — content script. Mounts a React tree into the host page at `document_idle`.
- **`src/content/overlay.tsx`** — the floating accessibility panel (bottom-right). Header with brand + collapse, live captions placeholder, comfort companion, pause/process buttons. Collapses to a small floating button.
- **`src/popup/`** — toolbar popup. Shows whether the active tab is a supported call host, and links to the web dashboard / onboarding / options.
- **`src/options/`** — full settings page. Currently a placeholder that links the user back to the web profile editor.
- **`src/lib/messaging.ts`** — typed wrapper around `chrome.runtime.sendMessage`.
- **`src/lib/config.ts`** — build-time config (Supabase URL + anon key). The extension can't read `.env` at runtime.
- **`manifest.json`** — MV3 manifest with permissions: `storage`, `activeTab`, `scripting`, `tabs`; host permissions for `meet.google.com`, `*.zoom.us`, `teams.microsoft.com`.
- **`vite.config.ts`** — Vite + `@crxjs/vite-plugin` for HMR-friendly extension builds.

## Build & load

From the repo root:

```bash
npm install            # first time only
npm run dev:extension  # watches and rebuilds into apps/extension/dist
```

Then in Chrome:

1. Open `chrome://extensions`
2. Toggle **Developer mode** on (top right)
3. Click **Load unpacked**
4. Select `apps/extension/dist`
5. Pin the CapyConnect icon to your toolbar

Open <https://meet.google.com> (or any supported call URL) and the floating panel appears in the bottom-right. Click the brand icon to collapse, click the small green button to expand.

## After code changes

Vite watch mode rebuilds `dist/` on every save. To pick up the new build in Chrome:

1. Open `chrome://extensions`
2. Click the **reload** icon on the CapyConnect card
3. Refresh the Meet/Zoom/Teams tab

The popup and options pages reload automatically.

## Where the work continues

Search the codebase for `TODO(` to find the owner-tagged next steps. Briefly:

- **Person 1** — wire the Web Speech API into the content-script overlay so captions are live, not placeholder. Move the React mount into a shadow DOM.
- **Person 2** — flesh out the options page with a full preferences editor (mirror of `/candidate/profile`).
- **Person 3** — wire `chrome.storage` token handoff from the web app, instantiate Supabase from `lib/config.ts`, and turn `background/index.ts` into a real message router.

## Known limitations of the starter

- **No icons yet.** Chrome shows its default puzzle-piece in the toolbar. Drop 16/48/128 PNGs into `apps/extension/icons/` and add an `icons` field to `manifest.json` when you have art.
- **No shadow DOM.** Host-page CSS can theoretically affect the overlay. Inline styles mitigate it; full isolation requires moving the React mount into a `host.attachShadow({ mode: 'open' })` root.
- **Auth is fully stubbed.** Sign-in handoff is a TODO; for now `chrome.storage` is empty.
- **`WEB_URL` is hard-coded to `http://localhost:3000`** in `background/index.ts`, `popup/Popup.tsx`, and `options/Options.tsx`. Swap to the prod URL once the web app is deployed.
