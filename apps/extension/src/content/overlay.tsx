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

const INITIAL_TRANSCRIPT: TranscriptEntry[] = [
  { id: 'demo-1', speaker: 'interviewer', text: 'QuietSpace overlay is active — press "Start captions" to detect speech.', timestamp: 0, isFinal: true },
];

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function Overlay() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [entries, setEntries] = React.useState<TranscriptEntry[]>(INITIAL_TRANSCRIPT);
  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);

  const stopCaptions = React.useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const startCaptions = React.useCallback(() => {
    if (recognitionRef.current) return;
    const Ctor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      setError('Web Speech API not supported in this browser.');
      return;
    }
    setError(null);
    const rec: SpeechRecognitionLike = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (ev: any) => {
      const next: TranscriptEntry[] = [];
      for (let i = 0; i < ev.results.length; i++) {
        const r = ev.results[i];
        next.push({
          id: `live-${i}`,
          speaker: 'interviewer',
          text: r[0].transcript,
          timestamp: Date.now(),
          isFinal: r.isFinal,
        });
      }
      setEntries(next.slice(-6));
    };
    rec.onerror = (ev: any) => setError(String(ev.error ?? 'speech error'));
    rec.onend = () => {
      if (recognitionRef.current === rec) {
        try { rec.start(); } catch { setListening(false); recognitionRef.current = null; }
      }
    };
    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      setError(String(e));
      recognitionRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    const listener = (msg: any) => {
      if (msg?.type === 'START_CAPTION_DEMO') startCaptions();
      if (msg?.type === 'STOP_CAPTION_DEMO') stopCaptions();
    };
    chrome.runtime?.onMessage?.addListener(listener);
    return () => {
      chrome.runtime?.onMessage?.removeListener(listener);
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, [startCaptions, stopCaptions]);

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
        <CaptionOverlay entries={entries} />

        <button
          type="button"
          onClick={listening ? stopCaptions : startCaptions}
          style={{
            padding: '8px 12px',
            background: listening ? '#c45c5c' : '#5b8b6f',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {listening ? '■ Stop captions' : '🎙 Start captions (demo)'}
        </button>
        {error && (
          <div style={{ fontSize: 11, color: '#c45c5c' }}>{error}</div>
        )}

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
