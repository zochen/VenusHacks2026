// OWNER: Person 1 (Candidate Experience)
// Surface: extension — the floating accessibility panel on Meet/Zoom/Teams
// Do not edit without coordinating in group chat.

import * as React from 'react';
import { CaptionOverlay, ComfortCompanion, PauseProcessButtons } from '@quietspace/shared-ui';
import type { TranscriptEntry } from '@quietspace/shared-types';

// TODO(Person 1): pull live transcript from Web Speech API in the content-script context
// TODO(Person 1): subscribe to Preferences via chrome.storage.onChanged for live updates
// TODO(Person 1): pipe pause/repeat events back through background via messaging.ts
// TODO(Person 1): make the panel draggable

const DEMO_TRANSCRIPT: TranscriptEntry[] = [
  { id: 'demo-1', speaker: 'interviewer', text: 'QuietSpace overlay is active — captions will appear here.', timestamp: 0, isFinal: true },
];

export function Overlay() {
  const [collapsed, setCollapsed] = React.useState(false);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Expand QuietSpace"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#5b8b6f',
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(20, 30, 25, 0.25)',
          fontSize: 26,
          cursor: 'pointer',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🌿
      </button>
    );
  }

  return (
    <div
      data-quietspace-overlay
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        width: 340,
        background: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e1e5dd',
        boxShadow: '0 12px 32px rgba(20, 30, 25, 0.16)',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        color: '#2a2d33',
        pointerEvents: 'auto',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: 'linear-gradient(135deg, #f4f8f5 0%, #fff 100%)',
          borderBottom: '1px solid #e1e5dd',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🌿</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>QuietSpace</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: '#5b8b6f',
              background: '#e3efe7',
              padding: '2px 8px',
              borderRadius: 999,
            }}
          >
            Active
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse panel"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: 18,
            lineHeight: 1,
            padding: 4,
            borderRadius: 6,
          }}
        >
          ─
        </button>
      </header>

      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CaptionOverlay entries={DEMO_TRANSCRIPT} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ transform: 'scale(0.65)', transformOrigin: 'left center', marginRight: -32 }}>
            <ComfortCompanion size={80} label="" />
          </div>
          <div style={{ flex: 1, fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>
            Breathe with me — companion paces 4 s in, 4 s out.
          </div>
        </div>

        <PauseProcessButtons />
      </div>

      <footer
        style={{
          padding: '8px 14px',
          background: '#fafafa',
          borderTop: '1px solid #e1e5dd',
          fontSize: 11,
          color: '#6b7280',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Starter build — not yet connected to web</span>
        <span style={{ color: '#5b8b6f', fontWeight: 600 }}>v0.0.1</span>
      </footer>
    </div>
  );
}

export default Overlay;
