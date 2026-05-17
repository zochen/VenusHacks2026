// OWNER: Person 1 (Candidate Experience)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, Button } from '@quietspace/shared-ui';

type Profile = {
  fullName: string;
  username: string;
  birthdate: string;
  location: string;
  avatarDataUrl: string;
};

type UpcomingInterview = {
  id: string;
  company: string;
  logo: string;
  logoBg: string;
  role: string;
  interviewer: string;
  interviewerTitle: string;
  whenISO: string;
  durationMins: number;
};

const FAKE_INTERVIEWS: UpcomingInterview[] = [
  {
    id: 'iv-stripe',
    company: 'Stripe',
    logo: '💳',
    logoBg: '#635bff',
    role: 'Frontend Engineer · L4',
    interviewer: 'Alex Chen',
    interviewerTitle: 'Senior Engineer, Payments UI',
    whenISO: nextDate(1, 14, 0),
    durationMins: 60,
  },
  {
    id: 'iv-linear',
    company: 'Linear',
    logo: '📐',
    logoBg: '#5e6ad2',
    role: 'Product Engineer',
    interviewer: 'Marta Ruiz',
    interviewerTitle: 'Engineering Manager',
    whenISO: nextDate(3, 10, 30),
    durationMins: 45,
  },
  {
    id: 'iv-figma',
    company: 'Figma',
    logo: '🎨',
    logoBg: '#a259ff',
    role: 'Software Engineer, Multiplayer',
    interviewer: 'Jordan Lee',
    interviewerTitle: 'Staff Engineer',
    whenISO: nextDate(5, 16, 0),
    durationMins: 60,
  },
  {
    id: 'iv-vercel',
    company: 'Vercel',
    logo: '▲',
    logoBg: '#111111',
    role: 'Frontend Infrastructure',
    interviewer: 'Priya Shah',
    interviewerTitle: 'Senior Engineer',
    whenISO: nextDate(8, 11, 0),
    durationMins: 45,
  },
];

function nextDate(daysFromNow: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function formatWhen(iso: string): { date: string; time: string; relative: string } {
  const d = new Date(iso);
  const now = new Date();
  const daysDiff = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  let relative = '';
  if (daysDiff === 0) relative = 'Today';
  else if (daysDiff === 1) relative = 'Tomorrow';
  else if (daysDiff < 7) relative = `In ${daysDiff} days`;
  else relative = `In ${Math.round(daysDiff / 7)} week${daysDiff >= 14 ? 's' : ''}`;

  return {
    date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    relative,
  };
}

function loadProfile(): Profile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('capyconnect.profile');
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export default function CandidateDashboardPage() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    setProfile(loadProfile());
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const displayName = profile?.fullName?.trim() || 'there';
  const firstName = displayName.split(' ')[0]!;

  const sorted = [...FAKE_INTERVIEWS].sort((a, b) => a.whenISO.localeCompare(b.whenISO));
  const next = sorted[0];

  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 32px' }}>
      {/* Welcome header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: profile?.avatarDataUrl
              ? `url(${profile.avatarDataUrl}) center/cover no-repeat`
              : '#eef2ed',
            color: '#5b8b6f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 700,
            border: '3px solid #fff',
            boxShadow: '0 0 0 1px #e1e5dd',
            flexShrink: 0,
          }}
        >
          {!profile?.avatarDataUrl && firstName[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="capy-title" style={{ margin: '0 0 4px', fontSize: 28 }}>Welcome, {displayName}</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
            {greeting(now)} · {sorted.length} upcoming interview{sorted.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/candidate/profile"
          style={{
            padding: '8px 14px',
            border: '1px solid #e1e5dd',
            borderRadius: 12,
            color: '#2a2d33',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Edit profile
        </Link>
      </header>

      {/* Next-up banner */}
      {next && (
        <Card
          elevated
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 32,
            border: '1px solid #cfe0d4',
            background: 'linear-gradient(135deg, #f4f8f5 0%, #fff 100%)',
          }}
        >
          <CompanyLogo company={next.company} logo={next.logo} bg={next.logoBg} size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#5b8b6f', fontWeight: 600, marginBottom: 4 }}>
              Next up
            </div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {next.role} at {next.company}
            </div>
            <div style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>
              {formatWhen(next.whenISO).relative} · {formatWhen(next.whenISO).date} at {formatWhen(next.whenISO).time} · {next.durationMins} min
            </div>
          </div>
          <Link href="/candidate/interview" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">
              Open simulator →
            </Button>
          </Link>
        </Card>
      )}

      {/* Upcoming list */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Upcoming interviews</h2>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{sorted.length} scheduled</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map((iv) => {
            const when = formatWhen(iv.whenISO);
            return (
              <Card key={iv.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <CompanyLogo company={iv.company} logo={iv.logo} bg={iv.logoBg} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{iv.company}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{iv.role}</div>
                </div>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Interviewer</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{iv.interviewer}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{iv.interviewerTitle}</div>
                </div>
                <div style={{ minWidth: 160, textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: '#5b8b6f', fontWeight: 600 }}>{when.relative}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{when.date}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{when.time} · {iv.durationMins} min</div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function greeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function CompanyLogo({ company, logo, bg, size }: { company: string; logo: string; bg: string; size: number }) {
  return (
    <div
      aria-label={`${company} logo`}
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        background: bg,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        fontWeight: 700,
        flexShrink: 0,
        boxShadow: '0 2px 6px rgba(20, 30, 25, 0.1)',
      }}
    >
      {logo}
    </div>
  );
}
