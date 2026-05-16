// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web (simulator — interviewer-side view)
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import type { TranscriptEntry, Question } from '@quietspace/shared-types';
import { Button, Card, LiveTranscript, QuestionDisplay } from '@quietspace/shared-ui';

const DEMO_QUESTIONS: Question[] = [
  { id: 'q1', prompt: 'Walk me through how you would design a URL shortener like bit.ly. Focus on the data model and read path.' },
  { id: 'q2', prompt: 'Given a binary tree, return the level-order traversal of its nodes as a 2D array.' },
  { id: 'q3', prompt: 'Tell me about a time you had to debug something tricky in production. What was your process?' },
];

const SCRIPTED_TRANSCRIPT: TranscriptEntry[] = [
  { id: 't1', speaker: 'interviewer', text: 'Thanks for joining. Ready to get started?', timestamp: 0, isFinal: true },
  { id: 't2', speaker: 'candidate', text: 'Yes — thanks for having me.', timestamp: 1000, isFinal: true },
  { id: 't3', speaker: 'interviewer', text: "Let's start with a system design question.", timestamp: 2000, isFinal: true },
  { id: 't4', speaker: 'candidate', text: 'Sounds good. Can I take a minute to think through it?', timestamp: 3000, isFinal: true },
];

export default function InterviewerInterviewPage({ params }: { params: { id: string } }) {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [transcript, setTranscript] = React.useState<TranscriptEntry[]>(SCRIPTED_TRANSCRIPT);
  const [banner, setBanner] = React.useState<string | null>(null);

  function appendCandidateLine(text: string) {
    setTranscript((prev) => [
      ...prev,
      { id: `${Date.now()}`, speaker: 'candidate', text, timestamp: Date.now(), isFinal: true },
    ]);
  }

  function simulateMomentRequest() {
    setBanner('🌿 Priya is taking a moment to think — give her a beat.');
    appendCandidateLine('(needs a moment)');
    window.setTimeout(() => setBanner(null), 5000);
  }

  function simulateRepeatRequest() {
    setBanner('🔁 Priya asked you to repeat the question.');
    window.setTimeout(() => setBanner(null), 5000);
  }

  const question = DEMO_QUESTIONS[questionIndex]!;

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
            Interview · {params.id}
          </div>
          <h1 style={{ margin: '4px 0 0', fontSize: 28 }}>Interviewing Priya Shah</h1>
        </div>
        <span
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            background: '#e3efe7',
            color: '#5b8b6f',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Communication style: relaxed
        </span>
      </div>

      {banner && (
        <div
          style={{
            padding: 16,
            background: '#fef3e7',
            border: '1px solid #e0b072',
            color: '#8a5a18',
            borderRadius: 12,
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          {banner}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <QuestionDisplay question={question} />
          <Card>
            <h3 style={{ marginTop: 0 }}>Question control</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => setQuestionIndex((i) => Math.max(i - 1, 0))}
                disabled={questionIndex === 0}
              >
                ← Previous
              </Button>
              <Button
                variant="primary"
                onClick={() => setQuestionIndex((i) => Math.min(i + 1, DEMO_QUESTIONS.length - 1))}
                disabled={questionIndex >= DEMO_QUESTIONS.length - 1}
              >
                Next question →
              </Button>
              <Button variant="ghost">🧠 Clarify question with AI</Button>
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: '#6b7280' }}>
              Question {questionIndex + 1} of {DEMO_QUESTIONS.length}
            </div>
          </Card>
          <Card>
            <h3 style={{ marginTop: 0 }}>Simulate candidate signals</h3>
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 0 }}>
              In production these come over Supabase Realtime — for the demo you can fire them manually.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="secondary" size="sm" onClick={simulateMomentRequest}>
                Candidate needs a moment
              </Button>
              <Button variant="secondary" size="sm" onClick={simulateRepeatRequest}>
                Candidate wants a repeat
              </Button>
            </div>
          </Card>
        </div>

        <aside>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280' }}>
            Live transcript
          </h3>
          <LiveTranscript entries={transcript} height={500} />
        </aside>
      </div>
    </main>
  );
}
