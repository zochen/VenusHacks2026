// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) — mirrors what the extension overlay shows in real calls
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import type { Question, Preferences, CommunicationStyle } from '@quietspace/shared-types';
import {
  Button,
  CaptionOverlay,
  ComfortCompanion,
  PauseProcessButtons,
  QuestionDisplay,
} from '@quietspace/shared-ui';
import { useSpeechRecognition } from '../../../lib/useSpeechRecognition';

const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q1',
    prompt: 'Walk me through how you would design a URL shortener like bit.ly. Focus on the data model and read path.',
  },
  {
    id: 'q2',
    prompt: 'Given a binary tree, return the level-order traversal of its nodes as a 2D array.',
  },
  {
    id: 'q3',
    prompt: 'Tell me about a time you had to debug something tricky in production. What was your process?',
  },
];

const DEFAULT_PREFS: Preferences = {
  communicationStyle: 'default',
  captionsEnabled: true,
  comfortCompanionEnabled: true,
  fontScale: 1,
};

function loadPrefs(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
  const raw = localStorage.getItem('capyconnect.preferences');
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Preferences>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function CandidateInterviewPage() {
  const [prefs, setPrefs] = React.useState<Preferences>(DEFAULT_PREFS);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [lastAction, setLastAction] = React.useState<'pause' | 'repeat' | 'moment' | null>(null);
  const speech = useSpeechRecognition('interviewer');

  React.useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const question = DEMO_QUESTIONS[questionIndex]!;
  const style: CommunicationStyle = prefs.communicationStyle;

  function fireAction(action: 'pause' | 'repeat' | 'moment') {
    setLastAction(action);
    window.setTimeout(() => setLastAction(null), 2500);
  }

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
            Candidate · simulated interview · style: {style}
          </div>
          <h1 style={{ margin: '4px 0 0', fontSize: 28 }}>You're in an interview with Alex</h1>
        </div>
        <div style={{ fontSize: 14, color: '#6b7280' }}>
          Question {questionIndex + 1} of {DEMO_QUESTIONS.length}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              aspectRatio: '16/9',
              background: '#2a2d33',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9aa0ad',
              fontSize: 14,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 8 }}>👤</div>
              <div>Interviewer video placeholder</div>
            </div>
            {prefs.captionsEnabled && (
              <div style={{ position: 'absolute', left: 24, right: 24, bottom: 24 }}>
                <CaptionOverlay entries={speech.entries} highContrast={style === 'focus'} />
              </div>
            )}
          </div>

          <QuestionDisplay question={question} style={style} fontScale={prefs.fontScale} />

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button
              variant={speech.listening ? 'danger' : 'primary'}
              onClick={() => (speech.listening ? speech.stop() : speech.start())}
              disabled={!speech.supported}
            >
              {speech.listening ? '■  Stop listening' : '🎙  Start captions'}
            </Button>
            <Button variant="secondary" onClick={speech.reset}>
              Clear transcript
            </Button>
            <Button
              variant="ghost"
              onClick={() => setQuestionIndex((i) => Math.min(i + 1, DEMO_QUESTIONS.length - 1))}
              disabled={questionIndex >= DEMO_QUESTIONS.length - 1}
            >
              Next question →
            </Button>
          </div>

          {!speech.supported && (
            <div
              style={{
                padding: 12,
                background: '#fef3e7',
                color: '#8a5a18',
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              Live captions need the Web Speech API. Try Chrome or Edge for the demo.
            </div>
          )}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {prefs.comfortCompanionEnabled && (
            <div
              style={{
                padding: 20,
                background: '#fff',
                border: '1px solid #e1e5dd',
                borderRadius: 20,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ComfortCompanion />
            </div>
          )}
          <div style={{ padding: 20, background: '#fff', border: '1px solid #e1e5dd', borderRadius: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280' }}>
              Accessibility controls
            </h3>
            <PauseProcessButtons
              onPause={() => fireAction('pause')}
              onRequestRepeat={() => fireAction('repeat')}
              onNeedMoment={() => fireAction('moment')}
              lastAction={lastAction}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
