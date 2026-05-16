// OWNER: Person 4 (Marketing)
// Surface: web
// Do not edit without coordinating in group chat.

import Link from 'next/link';
import { Card } from '@quietspace/shared-ui';

const features = [
  {
    icon: '💬',
    title: 'Live captions, always on',
    body: 'Web Speech transcribes the interviewer in real time so candidates never have to ask "could you repeat that?"',
  },
  {
    icon: '🧠',
    title: 'AI-clarified questions',
    body: 'Idiomatic or rushed phrasing gets rewritten to be unambiguous — without changing the underlying technical intent.',
  },
  {
    icon: '🌿',
    title: 'A calmer pace',
    body: 'A breathing companion and one-tap "need a moment" controls give candidates room to think before they speak.',
  },
];

export default function MarketingPage() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 96px' }}>
      <section style={{ textAlign: 'center', marginBottom: 80 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 999,
            background: '#e3efe7',
            color: '#5b8b6f',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.5,
            marginBottom: 24,
          }}
        >
          VenusHacks 2026
        </span>
        <h1 style={{ fontSize: 56, lineHeight: 1.1, margin: '0 0 24px', maxWidth: 820, marginInline: 'auto', fontWeight: 700 }}>
          Technical interviews shouldn't sound the same to everyone.
        </h1>
        <p style={{ fontSize: 20, color: '#6b7280', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.5 }}>
          CapyConnect is an accessibility layer for technical interviews — captions, clarifications, and a calmer pace,
          available in our practice simulator and as a Chrome overlay on real video calls.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/onboarding"
            style={{
              padding: '14px 28px',
              background: '#4a90e2',
              color: '#fff',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Try the demo →
          </Link>
          <Link
            href="/interviewer/dashboard"
            style={{
              padding: '14px 28px',
              background: '#fff',
              color: '#123244',
              border: '1px solid #e6eef6',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            I'm an interviewer
          </Link>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {features.map((f) => (
          <Card key={f.title} elevated>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>{f.title}</h3>
            <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.55, fontSize: 15 }}>{f.body}</p>
          </Card>
        ))}
      </section>

      <section
        style={{
          marginTop: 80,
          padding: 40,
          background: '#eef2ed',
          borderRadius: 20,
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 12px', fontSize: 28 }}>Two surfaces, one experience.</h2>
        <p style={{ margin: '0 auto 24px', maxWidth: 560, color: '#6b7280', lineHeight: 1.5 }}>
          Practice in our simulator, then take the same accessibility tools into your real Google Meet, Zoom, or Teams interview
          via our Chrome extension.
        </p>
        <Link
          href="/candidate/interview"
          style={{
            padding: '12px 24px',
            background: '#2a2d33',
            color: '#fff',
            borderRadius: 12,
            fontWeight: 600,
            display: 'inline-block',
          }}
        >
          Open the simulator
        </Link>
      </section>
    </main>
  );
}
