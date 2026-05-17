// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@quietspace/shared-ui';

type InviteStatus = 'pending' | 'accepted';

type InterviewItem = {
  id: string;
  candidate: string;
  role: string;
  when: string;
  style: string;
  status: string;
  questionsText?: string | null;
  attachedFileDataUrl?: string | null;
  attachedFileName?: string | null;
  inviteStatus?: InviteStatus;
};

const FAKE_INTERVIEWS: InterviewItem[] = [
  {
    id: 'demo-priya',
    candidate: 'Priya Shah',
    role: 'Frontend Engineer',
    when: 'Today · 2:00 PM',
    style: 'relaxed',
    status: 'scheduled',
    inviteStatus: 'pending',
  },
  {
    id: 'demo-jordan',
    candidate: 'Jordan Lee',
    role: 'Backend Engineer',
    when: 'Tomorrow · 10:30 AM',
    style: 'focus',
    status: 'scheduled',
    inviteStatus: 'accepted',
  },
  {
    id: 'demo-mira',
    candidate: 'Mira Okonkwo',
    role: 'ML Engineer',
    when: 'Friday · 4:00 PM',
    style: 'default',
    status: 'scheduled',
    inviteStatus: 'pending',
  },
];

const styleColor: Record<string, { bg: string; fg: string }> = {
  default: { bg: '#eef2ed', fg: '#2a2d33' },
  relaxed: { bg: '#e3efe7', fg: '#5b8b6f' },
  focus: { bg: '#fef3e7', fg: '#8a5a18' },
};

function formatWhen(raw?: string | null) {
  if (!raw) return 'TBD';
  // If it's already a user-friendly string, return it
  if (typeof raw !== 'string') return String(raw);
  // Detect ISO-ish datetime (e.g. 2026-05-18T14:36)
  const isoMatch = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw);
  try {
    if (isoMatch) {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return raw;
      const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d);
      const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
      const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(d);
      // e.g. "Monday (May 18) 2:36 PM"
      return `${weekday} (${date}) ${time}`;
    }

    // Handle friendly strings like "Today · 2:00 PM" or "Tomorrow · 10:30 AM" or "Friday · 4:00 PM"
    const friendlyMatch = /^(Today|Tomorrow|[A-Za-z]+)\b/.exec(raw);
    if (friendlyMatch && friendlyMatch[1]) {
      const term = String(friendlyMatch[1]);
      let refDate: Date | null = null;
      const now = new Date();
      if (/^Today$/i.test(term)) refDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      else if (/^Tomorrow$/i.test(term)) refDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      else {
        // Try to parse weekday name (Monday, Tuesday...)
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const idx = weekdays.findIndex((w) => w.toLowerCase() === term.toLowerCase());
        if (idx >= 0) {
          // find next date matching this weekday (within next 14 days)
          for (let i = 0; i < 14; i++) {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            if (d.getDay() === idx) {
              refDate = d;
              break;
            }
          }
        }
      }

      if (refDate) {
        const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(refDate);
        // append the exact date in parentheses after the friendly term
        // keep the remainder (e.g., time) after the first delimiter like '·' or space
        const remainder = raw.replace(/^\s*(Today|Tomorrow|[A-Za-z]+)\s*\u00B7?\s*/i, '');
        return `${term} (${date}) ${remainder}`.trim();
      }
    }

    return raw;
  } catch (e) {
    return raw;
  }
}

function computeTwoWeeksMondayIso() {
  const now = new Date();
  const twoWeeks = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  // find Monday on or after twoWeeks
  const desiredWeekday = 1; // Monday
  let d = new Date(twoWeeks.getFullYear(), twoWeeks.getMonth(), twoWeeks.getDate());
  for (let i = 0; i < 7; i++) {
    if (d.getDay() === desiredWeekday) break;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  }
  // set to 4:00 PM local
  d.setHours(16, 0, 0, 0);
  // format to yyyy-mm-ddThh:mm
  const pad = (n: number) => String(n).padStart(2, '0');
  const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return iso;
}

export default function InterviewerDashboardPage() {
  const [stored, setStored] = React.useState<InterviewItem[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('capyconnect.interviews');
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const mapped = parsed.map((iv) => ({
          id: iv.id,
          candidate: iv.candidate ?? iv.email ?? iv.id,
          role: iv.role ?? '—',
          when: formatWhen(iv.when ?? iv.whenRaw ?? 'TBD'),
          style: iv.style ?? 'default',
          status: iv.status ?? 'scheduled',
          questionsText: iv.questionsText ?? iv.questions ?? null,
          attachedFileDataUrl: iv.attachedFileDataUrl ?? null,
          attachedFileName: iv.attachedFileName ?? null,
        }));
        setStored(mapped);
      }
    } catch {}
  }, []);
  const [selected, setSelected] = React.useState<null | any>(null);
  const [inviteStates, setInviteStates] = React.useState<Record<string, InviteStatus>>({});

  React.useEffect(() => {
    // initialize invite state from stored interviews and defaults for fakes
    const map: Record<string, 'pending' | 'accepted'> = {};
    (stored ?? []).forEach((s) => {
      map[s.id] = (s as any).inviteStatus ?? 'pending';
    });
    FAKE_INTERVIEWS.forEach((f) => {
      map[f.id] = (f as any).inviteStatus ?? 'pending';
    });
    setInviteStates(map);
  }, [stored]);

  function setInvite(id: string, value: 'pending' | 'accepted') {
    setInviteStates((prev) => ({ ...prev, [id]: value }));
    // persist to localStorage for stored interviews
    try {
      const raw = localStorage.getItem('capyconnect.interviews');
      if (!raw) return;
      const parsed = JSON.parse(raw) as any[];
      const idx = parsed.findIndex((p) => p.id === id);
      if (idx >= 0) {
        parsed[idx].inviteStatus = value;
        localStorage.setItem('capyconnect.interviews', JSON.stringify(parsed));
        // update local copy too
        setStored(parsed.map((iv) => ({
          id: iv.id,
          candidate: iv.candidate ?? iv.email ?? iv.id,
          role: iv.role ?? '—',
          when: formatWhen(iv.when ?? iv.whenRaw ?? 'TBD'),
          style: iv.style ?? 'default',
          status: iv.status ?? 'scheduled',
          questionsText: iv.questionsText ?? iv.questions ?? null,
          attachedFileDataUrl: iv.attachedFileDataUrl ?? null,
          attachedFileName: iv.attachedFileName ?? null,
          inviteStatus: iv.inviteStatus ?? 'pending',
        })));
      }
    } catch (e) {
      // ignore
    }
  }

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
          const candidateInitials = (iv.candidate || '').split(' ').map((p: string) => p[0] ?? '').join('').toUpperCase();
          // compute demo Sam date substitution
          const ivCopy = { ...iv } as any;
          const displayInvite: InviteStatus = (inviteStates[iv.id] ?? (ivCopy.inviteStatus ?? 'pending')) as InviteStatus;
          if (iv.when === '__DEMO_TWO_WEEKS_MONDAY__') {
            const iso = computeTwoWeeksMondayIso();
            ivCopy.when = formatWhen(iso);
          }

          return (
            <div key={iv.id} style={{ color: 'inherit', textDecoration: 'none' }}>
              <button
                type="button"
                onClick={() => setSelected(iv)}
                style={{ all: 'unset', width: '100%', display: 'block', cursor: 'pointer' }}
              >
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
                    {candidateInitials || '—'}
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
                  <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = displayInvite === 'pending' ? 'accepted' : 'pending';
                        setInvite(iv.id, next);
                      }}
                      aria-pressed={displayInvite === 'accepted'}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        background: displayInvite === 'accepted' ? '#bbf7d0' : '#fde68a',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      {displayInvite === 'accepted' ? 'Accepted' : 'Pending'}
                    </button>
                  </div>
                </Card>
              </button>
            </div>
          );
        })}

        {/* Overlay modal for selected interview */}
        {selected && (
          <div
            role="dialog"
            aria-modal
            style={{ position: 'fixed', inset: 0, background: 'rgba(12,18,22,0.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}
            onClick={() => setSelected(null)}
          >
            <div style={{ width: 'min(920px, 92%)' }} onClick={(e) => e.stopPropagation()}>
              <Card style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>Interview · {selected.id}</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{selected.candidate}</div>
                    <div style={{ color: '#6b7280', marginTop: 6 }}>{selected.role} · {selected.when}</div>
                  </div>
                  <div>
                    <button type="button" onClick={() => setSelected(null)} style={{ all: 'unset', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: '#eef2ed' }}>Close</button>
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <h3 style={{ margin: '0 0 8px' }}>Questions</h3>
                  {selected.questionsText ? (
                    <ol style={{ marginTop: 8 }}>
                      {String(selected.questionsText).split('\n').filter(Boolean).map((q: string, idx: number) => (
                        <li key={idx} style={{ marginBottom: 8 }}>{q}</li>
                      ))}
                    </ol>
                  ) : selected.attachedFileDataUrl ? (
                    <div>
                      <div style={{ color: '#6b7280', marginBottom: 8 }}>Uploaded file:</div>
                      <a href={selected.attachedFileDataUrl} download={selected.attachedFileName ?? 'questions.pdf'} style={{ color: '#2563eb' }}>
                        Download {selected.attachedFileName ?? 'file'}
                      </a>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280' }}>No questions uploaded for this interview.</div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
