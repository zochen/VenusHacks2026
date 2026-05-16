// OWNER: Person 1 (Candidate Experience)
// Surface: web (candidate simulator)
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import type { TranscriptEntry } from '@quietspace/shared-types';

type AnyWindow = typeof window & {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
};

export interface UseSpeechRecognitionResult {
  entries: TranscriptEntry[];
  listening: boolean;
  supported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(speaker: TranscriptEntry['speaker'] = 'interviewer'): UseSpeechRecognitionResult {
  const [entries, setEntries] = React.useState<TranscriptEntry[]>([]);
  const [listening, setListening] = React.useState(false);
  const [supported, setSupported] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as AnyWindow;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      const next: TranscriptEntry[] = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        next.push({
          id: `${Date.now()}-${i}`,
          speaker,
          text: result[0].transcript.trim(),
          timestamp: Date.now(),
          isFinal: result.isFinal,
        });
      }
      setEntries((prev) => {
        const finals = prev.filter((e) => e.isFinal);
        return [...finals, ...next];
      });
    };

    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    recognitionRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {}
    };
  }, [speaker]);

  const start = React.useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {}
  }, []);

  const stop = React.useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setListening(false);
  }, []);

  const reset = React.useCallback(() => setEntries([]), []);

  return { entries, listening, supported, start, stop, reset };
}
