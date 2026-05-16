# CapyConnect

An accessibility platform for technical interviews, built as **two paired surfaces** that share UI, types, and business logic:

1. **Web app** (`apps/web`) — Next.js 14 App Router. Interviewer dashboard, candidate onboarding, and a simulated interview environment for the hackathon demo.
2. **Chrome extension** (`apps/extension`) — Manifest V3 overlay that injects the same accessibility tools on top of real video calls (Google Meet, Zoom, Microsoft Teams).

The whole point of this monorepo: **build the accessibility UI once, demo it twice.** The simulated interview in the web app and the floating overlay in the extension both consume the same components from `@quietspace/shared-ui/interview`.

## Monorepo layout

```
quietspace/
├── apps/
│   ├── web/          # Next.js app — candidate, interviewer, onboarding, marketing
│   └── extension/    # Chrome MV3 extension — content script overlay + popup + options
├── packages/
│   ├── shared-types/ # TS interfaces used by both surfaces
│   ├── shared-ui/    # React components — design primitives + interview components
│   └── shared-lib/   # Supabase client, OpenAI client, prompt templates
├── package.json      # npm workspaces config
├── tsconfig.base.json
└── .env.example
```

## Ownership

| Area                                                  | Owner    |
| ----------------------------------------------------- | -------- |
| `apps/web/app/candidate/**`                           | Person 1 |
| `apps/web/components/candidate/**`                    | Person 1 |
| `apps/extension/src/content/**`                       | Person 1 |
| `packages/shared-ui/src/interview/**`                 | Person 1 |
| `apps/web/app/interviewer/**`                         | Person 2 |
| `apps/web/app/onboarding/**`                          | Person 2 |
| `apps/web/components/interviewer/**`                  | Person 2 |
| `apps/extension/src/popup/**`                         | Person 2 |
| `apps/extension/src/options/**`                       | Person 2 |
| `apps/web/app/api/session/**`                         | Person 3 |
| `apps/extension/src/background/**`                    | Person 3 |
| `apps/extension/src/lib/messaging.ts`                 | Person 3 |
| `packages/shared-types/**` (SHARED — coordinate)      | Person 3 |
| `packages/shared-lib/src/supabase/**` (SHARED)        | Person 3 |
| `apps/web/app/(marketing)/**`                         | Person 4 |
| `apps/web/app/api/ai/**`                              | Person 4 |
| `packages/shared-ui/src/primitives/**`                | Person 4 |
| `packages/shared-ui/src/tokens.ts`                    | Person 4 |
| `packages/shared-lib/src/openai/**`                   | Person 4 |

## Setup

```bash
# at repo root
npm install
```

### Run the web app

```bash
npm run dev:web
# → http://localhost:3000
```

### Build the extension (watch mode)

```bash
npm run dev:extension
# → outputs to apps/extension/dist
```

### Load the unpacked extension into Chrome

1. Open `chrome://extensions`.
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked**.
4. Select `apps/extension/dist`.
5. Pin the QuietSpace icon to your toolbar.
6. Open https://meet.google.com or a Zoom web call — the overlay should mount.

### Build everything / typecheck

```bash
npm run build:all
npm run typecheck
```

## Cross-surface notes

- The web simulated interview is the **primary thing judges will see** at the demo. The extension only needs to prove the concept: load on a Google Meet page and show the floating panel with captions and the comfort companion (capybara).
- **Auth model:** the web app uses Supabase auth normally. The extension stores its session token in `chrome.storage`, populated after the user signs in via the web app (the popup links over to web onboarding).
- The extension can't read `.env` at runtime — Supabase URL + anon key are bundled at build time. See `apps/extension/src/lib/config.ts` (stub).

## Rules of the road

- **Branch per person.** Name them `p1/...`, `p2/...`, `p3/...`, `p4/...`.
- **Merge to `main` every 4–6 hours** to keep drift small.
- Changes to `packages/shared-types/**` or `packages/shared-lib/src/supabase/**` **require coordination in the group chat** before merging — these are load-bearing for everyone.
- Every stub file has an `OWNER:` header. Don't edit a file owned by someone else without pinging them.
