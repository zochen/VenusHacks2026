# Fake Interview Site

A throwaway Zoom-style interview UI used as a demo target for the **CapyConnect** browser extension. No real video conferencing, no networking — just a believable stage so the extension's accessibility overlays (captions, question panel, follow-ups, comfort companion) have something realistic to sit on top of.

## Run it

```bash
# from the repo root (workspaces wire it up)
npm install
npm run dev --workspace apps/fake-interview

# or directly
cd apps/fake-interview
npm install
npm run dev
```

Vite serves the site at **http://localhost:5174**.

The "You" tile uses `getUserMedia` for the candidate webcam — your browser will prompt for camera permission on first load. If you deny it, you'll see a "Camera off" placeholder instead.

## How the extension reads interview data

The simulation hook (`src/hooks/useInterviewSimulation.ts`) publishes the current question state to two well-known surfaces on `window`:

### 1. `window.capyconnectInterview`

A live snapshot, updated on every state change:

```ts
window.capyconnectInterview = {
  currentQuestion: string | null,
  followUps: string[],
  captionLines: string[],
  isSpeaking: boolean,
  askedAt: number | null,
}
```

A content script can poll or read this directly:

```js
const q = window.capyconnectInterview?.currentQuestion;
```

### 2. `capyconnect:question` CustomEvent

Fired on `window` every time the question or follow-ups change, so the extension doesn't have to poll:

```js
window.addEventListener('capyconnect:question', (e) => {
  console.log('new question:', e.detail.question, e.detail.followUps);
});
```

## Demo flow

1. Open the site → interviewer avatar visible, candidate webcam in corner.
2. Click **Ask Question** in the floating dev panel (bottom-left).
3. The interviewer avatar gets a green "speaking" ring, the question streams word-by-word into `captionLines`, then follow-ups appear gradually.
4. Click **Next Question** to advance, **Follow-Up** to surface one more probe, **Reset** to start over.
5. With the CapyConnect extension loaded on this tab, its caption-detection and question-display overlays will pick up the streamed text and `window.capyconnectInterview` state.

## Project layout

```
src/
  components/
    InterviewHeader.tsx
    VideoStage.tsx
    InterviewerVideo.tsx
    CandidateVideo.tsx
    ControlBar.tsx
    DevQuestionPanel.tsx
  data/questions.ts        # the demo question bank
  hooks/useInterviewSimulation.ts   # state + window publishing
  pages/InterviewPage.tsx
  App.tsx
  main.tsx
  styles.css
```

Intentionally tiny — no router, no state library, no UI kit. Hackathon-grade.
