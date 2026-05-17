// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@quietspace/shared-ui';

const FAKE_INTERVIEWS = [
  {
    id: 'demo-priya',
    candidate: 'Priya Shah',
    role: 'Frontend Engineer',
    when: 'Today · 2:00 PM',
    style: 'relaxed',
    status: 'scheduled',
  },
  {
    id: 'demo-jordan',
    candidate: 'Jordan Lee',
    role: 'Backend Engineer',
    when: 'Tomorrow · 10:30 AM',
    style: 'focus',
    status: 'scheduled',
  },
  {
    id: 'demo-mira',
    candidate: 'Mira Okonkwo',
    role: 'ML Engineer',
    when: 'Friday · 4:00 PM',
    style: 'default',
    status: 'scheduled',
  },
  {
    id: 'demo-sam',
    candidate: 'Sam Rivera',
    role: 'Frontend Engineer',
    when: 'Last Monday',
    style: 'relaxed',
    status: 'completed',
  },
];

const styleColor: Record<string, { bg: string; fg: string }> = {
  default: { bg: '#eef2ed', fg: '#2a2d33' },
  relaxed: { bg: '#e3efe7', fg: '#5b8b6f' },
  focus: { bg: '#fef3e7', fg: '#8a5a18' },
};

export default function InterviewerDashboardPage() {
  const [stored, setStored] = React.useState<Array<{ id: string; candidate: string; role: string; when: string; style: string; status: string }>>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('capyconnect.interviews');
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const mapped = parsed.map((iv) => ({
          id: iv.id,
          candidate: iv.candidate ?? iv.email ?? iv.id,
          role: iv.role ?? '—',
          when: iv.when ?? 'TBD',
          style: iv.style ?? 'default',
          status: iv.status ?? 'scheduled',
        }));
        setStored(mapped);
      }
    } catch {}
  }, []);
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, margin: '0 0 6px' }}>Your interviews</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Upcoming and recent technical interviews.</p>
        </div>
        <Link
          href="/interviewer/new-interview"
          style={{
            padding: '12px 20px',
            background: '#5b8b6f',
            color: '#fff',
            borderRadius: 12,
            fontWeight: 600,
          }}
        >
          + New interview
        </Link>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {(stored ?? []).concat(FAKE_INTERVIEWS).map((iv) => {
          const color = styleColor[iv.style] ?? styleColor.default!;
          return (
            <Link key={iv.id} href={`/interviewer/interview/${iv.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              <Card style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#eef2ed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    color: '#5b8b6f',
                  }}
                >
                  {iv.candidate.split(' ').map((p) => p[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{iv.candidate}</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>
                    {iv.role} · {iv.when}
                  </div>
                </div>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: color.bg,
                    color: color.fg,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {iv.style}
                </span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: iv.status === 'completed' ? '#f3f3f3' : '#e3efe7',
                    color: iv.status === 'completed' ? '#6b7280' : '#5b8b6f',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {iv.status}
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
