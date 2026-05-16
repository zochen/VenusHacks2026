// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@quietspace/shared-ui';

export default function NewInterviewPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [when, setWhen] = React.useState('');
  const [questions, setQuestions] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => router.push('/interviewer/dashboard'), 1200);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e1e5dd',
    borderRadius: 12,
    fontSize: 15,
    fontFamily: 'inherit',
    background: '#fff',
  };

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ fontSize: 32, margin: '0 0 8px' }}>Schedule a new interview</h1>
      <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 32 }}>
        We'll email the candidate a link to onboard before the call.
      </p>

      <Card>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Candidate email</div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              style={inputStyle}
            />
          </label>
          <label>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Role</div>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Frontend Engineer"
              style={inputStyle}
            />
          </label>
          <label>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Scheduled time</div>
            <input
              type="datetime-local"
              required
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              style={inputStyle}
            />
          </label>
          <label>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Questions (one per line)</div>
            <textarea
              rows={6}
              required
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder={'Walk me through how you would design...\nGiven a binary tree...'}
              style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button variant="primary" type="submit" disabled={submitted}>
              {submitted ? 'Creating...' : 'Create interview'}
            </Button>
            {submitted && <span style={{ color: '#5b8b6f', fontSize: 14 }}>✓ Sent — redirecting</span>}
          </div>
        </form>
      </Card>
    </main>
  );
}
