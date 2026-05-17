// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@quietspace/shared-ui';
import { createBrowserSupabaseClient } from '@quietspace/shared-lib';
import { useAuth } from '../../../lib/AuthContext';

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

type BiasSeverity = 'high' | 'medium' | 'low' | 'none';

type BiasFinding = {
  severity: BiasSeverity;
  issues: string[];
  explanations: string[];
  suggestions: string[];
};

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

const severityRank: Record<BiasSeverity, number> = { high: 3, medium: 2, low: 1, none: 0 };

const severityColor: Record<BiasSeverity, { bg: string; border: string; label: string }> = {
  high:   { bg: '#fde2e1', border: '#f4a8a4', label: '#8a1f1a' },
  medium: { bg: '#fef6d4', border: '#f0d77a', label: '#7a5b10' },
  low:    { bg: '#e7f2dc', border: '#bcd9a2', label: '#3f5d22' },
  none:   { bg: '#eef2ed', border: '#d6dcd6', label: '#2a2d33' },
};

// Bias evaluation is performed server-side via /api/ai/evaluate-question (Gemini).


const styleColor: Record<string, { bg: string; fg: string }> = {
  default: { bg: '#eef2ed', fg: '#2a2d33' },
  relaxed: { bg: '#e3efe7', fg: '#0d9488' },
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
  const { user, isLoading } = useAuth();

  const getSupabase = React.useCallback(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null;
    }
    return createBrowserSupabaseClient({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  }, []);

  React.useEffect(() => {
    const loadLocalInterviews = () => {
      try {
        const raw = localStorage.getItem('capyconnect.interviews');
        if (raw) {
          const parsed = JSON.parse(raw) as any[];
          const mapped: InterviewItem[] = parsed.map((iv) => ({
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
          }));
          setStored(mapped);
        }
      } catch {}
    };

    const load = async () => {
      if (isLoading) return;
      const supabase = getSupabase();
      if (!user || !supabase) {
        loadLocalInterviews();
        return;
      }
      const { data, error } = await supabase
        .from('planned_interviews')
        .select('id, candidate_email, candidate_name, role, scheduled_at, status')
        .eq('interviewer_id', user.id)
        .order('scheduled_at', { ascending: true });
      if (error) {
        console.warn('Failed to load planned interviews from Supabase', error);
        loadLocalInterviews();
        return;
      }

      const interviewIds = (data ?? []).map((iv: any) => iv.id);
      const questionsByInterview: Record<string, string> = {};
      if (interviewIds.length > 0) {
        const { data: qData, error: qError } = await supabase
          .from('questions')
          .select('interview_id, prompt, order_number')
          .in('interview_id', interviewIds)
          .order('order_number', { ascending: true });
        if (qError) {
          console.warn('Failed to load interview questions from Supabase', qError);
        } else {
          const grouped: Record<string, string[]> = {};
          (qData ?? []).forEach((q: any) => {
            if (!grouped[q.interview_id]) grouped[q.interview_id] = [];
            grouped[q.interview_id]!.push(String(q.prompt ?? ''));
          });
          for (const [id, prompts] of Object.entries(grouped)) {
            questionsByInterview[id] = prompts.filter(Boolean).join('\n');
          }
        }
      }

      setStored((data ?? []).map((iv: any) => ({
        id: iv.id,
        candidate: iv.candidate_name ?? iv.candidate_email ?? iv.id,
        role: iv.role ?? '—',
        when: iv.scheduled_at ? formatInterviewTime(iv.scheduled_at) : 'TBD',
        style: 'default',
        status: iv.status ?? 'scheduled',
        questionsText: questionsByInterview[iv.id] ?? null,
        attachedFileDataUrl: null,
        attachedFileName: null,
        inviteStatus: 'pending',
      })));
    };

    void load();
  }, [user, isLoading, getSupabase]);

  const [selected, setSelected] = React.useState<null | any>(null);
  const [inviteStates, setInviteStates] = React.useState<Record<string, InviteStatus>>({});
  const [editingQuestions, setEditingQuestions] = React.useState<string[] | null>(null);
  const [evaluation, setEvaluation] = React.useState<{ text: string; finding: BiasFinding; originalText?: string; originalFinding?: BiasFinding }[] | null>(null);
  const [expandedEval, setExpandedEval] = React.useState<number | null>(null);
  const [evalDirty, setEvalDirty] = React.useState(false);
  const [flashing, setFlashing] = React.useState(false);
  const [evalLoading, setEvalLoading] = React.useState(false);
  const [evalError, setEvalError] = React.useState<string | null>(null);

  async function persistQuestionsToSupabase(interviewId: string, newText: string | null) {
    const supabase = getSupabase();
    if (!user || !supabase) return;
    const { error: delErr } = await supabase
      .from('questions')
      .delete()
      .eq('interview_id', interviewId);
    if (delErr) {
      console.warn('Failed to delete existing questions before update', delErr);
      return;
    }
    if (!newText) return;
    const rows = newText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((prompt, i) => ({ interview_id: interviewId, prompt, order_number: i + 1 }));
    if (rows.length === 0) return;
    const { error: insErr } = await supabase.from('questions').insert(rows);
    if (insErr) console.warn('Failed to insert updated questions', insErr);
  }

  async function fetchFindings(questions: string[]): Promise<BiasFinding[]> {
    const res = await fetch('/api/ai/evaluate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || `Request failed (${res.status})`);
    }
    const arr: any[] = Array.isArray(data?.findings) ? data.findings : [];
    return questions.map((_, i) => {
      const f = arr[i] ?? {};
      return {
        severity: f.severity ?? 'none',
        issues: f.issues ?? [],
        explanations: f.explanations ?? [],
        suggestions: f.suggestions ?? [],
      };
    });
  }

  async function runEvaluation() {
    if (!selected?.questionsText) return;
    const items = String(selected.questionsText).split('\n').map((s) => s.trim()).filter(Boolean);
    setEvalLoading(true);
    setEvalError(null);
    setEvaluation(null);
    setExpandedEval(null);
    setEvalDirty(false);
    try {
      const findings = await fetchFindings(items);
      const scored = items.map((text, i) => ({ text, finding: findings[i]! }));
      scored.sort((a, b) => severityRank[b.finding.severity] - severityRank[a.finding.severity]);
      setEvaluation(scored);
    } catch (err: any) {
      setEvalError(err?.message || 'Failed to evaluate questions.');
    } finally {
      setEvalLoading(false);
    }
  }

  function clearEvaluation() {
    setEvaluation(null);
    setExpandedEval(null);
    setEvalError(null);
    setEvalDirty(false);
  }

  function applyVariation(idx: number, suggestion: string) {
    if (!evaluation) return;
    const next = [...evaluation];
    const current = next[idx]!;
    // Suggestions are LLM-generated non-biased rewrites; mark as clean optimistically.
    // Preserve the original text + finding so we can show a pending-replacement badge and allow undo.
    next[idx] = {
      text: suggestion,
      finding: { severity: 'none', issues: [], explanations: [], suggestions: [] },
      originalText: current.originalText ?? current.text,
      originalFinding: current.originalFinding ?? current.finding,
    };
    setEvaluation(next);
    setExpandedEval(null);
    setEvalDirty(true);
  }

  function undoVariation(idx: number) {
    if (!evaluation) return;
    const next = [...evaluation];
    const current = next[idx]!;
    if (current.originalText === undefined || current.originalFinding === undefined) return;
    next[idx] = { text: current.originalText, finding: current.originalFinding };
    setEvaluation(next);
    setEvalDirty(next.some((item) => item.originalText !== undefined));
  }

  function saveEvaluation() {
    if (!selected || !evaluation) return;
    const newText = evaluation.map((e) => e.text.trim()).filter(Boolean).join('\n') || null;
    setSelected({ ...selected, questionsText: newText });
    setStored((prev) => prev.map((iv) => (iv.id === selected.id ? { ...iv, questionsText: newText } : iv)));
    try {
      const raw = localStorage.getItem('capyconnect.interviews');
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const idx = parsed.findIndex((p) => p.id === selected.id);
        if (idx >= 0) {
          parsed[idx].questionsText = newText;
          localStorage.setItem('capyconnect.interviews', JSON.stringify(parsed));
        }
      }
    } catch {}
    void persistQuestionsToSupabase(selected.id, newText);
    setEvalDirty(false);
  }

  function triggerFlash() {
    setFlashing(true);
    window.setTimeout(() => setFlashing(false), 700);
  }

  function attemptClose() {
    setSelected(null);
    setEditingQuestions(null);
    setEvaluation(null);
    setExpandedEval(null);
    setEvalDirty(false);
    setEvalError(null);
    setEvalLoading(false);
  }

  function startEditing() {
    if (!selected) return;
    const text = selected.questionsText ? String(selected.questionsText) : '';
    const arr = text.split('\n').map((s) => s.trim()).filter(Boolean);
    setEditingQuestions(arr.length ? arr : ['']);
    setEvaluation(null);
    setExpandedEval(null);
  }

  function cancelEditing() {
    setEditingQuestions(null);
  }

  function saveEditing() {
    if (!selected || !editingQuestions) return;
    const joined = editingQuestions.map((q) => q.trim()).filter(Boolean).join('\n');
    const newText = joined || null;

    setSelected({ ...selected, questionsText: newText });
    setStored((prev) => prev.map((iv) => (iv.id === selected.id ? { ...iv, questionsText: newText } : iv)));

    try {
      const raw = localStorage.getItem('capyconnect.interviews');
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const idx = parsed.findIndex((p) => p.id === selected.id);
        if (idx >= 0) {
          parsed[idx].questionsText = newText;
          localStorage.setItem('capyconnect.interviews', JSON.stringify(parsed));
        }
      }
    } catch {}

    void persistQuestionsToSupabase(selected.id, newText);
    setEditingQuestions(null);
  }

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
            background: '#0d9488',
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
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelected(iv)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(iv);
                  }
                }}
                style={{ width: '100%', display: 'block', cursor: 'pointer' }}
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
                      color: '#0d9488',
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
                      color: iv.status === 'completed' ? '#6b7280' : '#0d9488',
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
              </div>
            </div>
          );
        })}

        {/* Overlay modal for selected interview */}
        {selected && (
          <div
            role="dialog"
            aria-modal
            style={{ position: 'fixed', inset: 0, background: 'rgba(12,18,22,0.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}
            onClick={attemptClose}
          >
            <style>{`
              @keyframes capyFlash {
                0%, 100% { transform: translateX(0); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                15% { transform: translateX(-4px); box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.45); }
                30% { transform: translateX(4px); box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.35); }
                45% { transform: translateX(-3px); box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.45); }
                60% { transform: translateX(3px); box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.30); }
                75% { transform: translateX(-2px); box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.20); }
              }
              .capy-flash { animation: capyFlash 0.7s ease-in-out; }
            `}</style>
            <div style={{ width: 'min(920px, 92%)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <Card style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>Interview · {selected.id}</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{selected.candidate}</div>
                    <div style={{ color: '#6b7280', marginTop: 6 }}>{selected.role} · {selected.when}</div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={attemptClose}
                      className={flashing ? 'capy-flash' : undefined}
                      style={{ all: 'unset', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: '#eef2ed' }}
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ margin: 0 }}>Questions</h3>
                    {editingQuestions === null ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        {selected.questionsText && (
                          evaluation === null ? (
                            <button
                              type="button"
                              onClick={runEvaluation}
                              disabled={evalLoading}
                              style={{ all: 'unset', cursor: evalLoading ? 'wait' : 'pointer', padding: '6px 12px', borderRadius: 8, background: '#e0e7ff', color: '#3730a3', fontSize: 14, fontWeight: 600, opacity: evalLoading ? 0.7 : 1 }}
                            >
                              {evalLoading ? 'Evaluating…' : 'Evaluate for bias'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={clearEvaluation}
                              style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, background: '#f3f3f3', fontSize: 14, fontWeight: 600 }}
                            >
                              Clear evaluation
                            </button>
                          )
                        )}
                        <button
                          type="button"
                          onClick={startEditing}
                          style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, background: '#eef2ed', fontSize: 14, fontWeight: 600 }}
                        >
                          {selected.questionsText ? 'Edit' : '+ Add questions'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, background: '#f3f3f3', fontSize: 14, fontWeight: 600 }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveEditing}
                          style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, background: '#0d9488', color: '#fff', fontSize: 14, fontWeight: 600 }}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  {editingQuestions !== null ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {editingQuestions.map((q, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <div style={{ padding: '10px 0', color: '#6b7280', fontSize: 14, minWidth: 24, textAlign: 'right' }}>
                            {i + 1}.
                          </div>
                          <textarea
                            rows={2}
                            value={q}
                            onChange={(e) => {
                              const next = [...editingQuestions];
                              next[i] = e.target.value;
                              setEditingQuestions(next);
                            }}
                            placeholder={i === 0 ? 'Walk me through how you would design...' : 'Add another question'}
                            style={{ flex: 1, padding: '10px 14px', border: '1px solid #e1e5dd', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', background: '#fff', resize: 'vertical' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (editingQuestions.length === 1) {
                                setEditingQuestions(['']);
                                return;
                              }
                              setEditingQuestions(editingQuestions.filter((_, idx) => idx !== i));
                            }}
                            style={{ all: 'unset', cursor: 'pointer', padding: '8px 12px', borderRadius: 8, background: '#f3f3f3', fontSize: 14, fontWeight: 600 }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div>
                        <button
                          type="button"
                          onClick={() => setEditingQuestions([...editingQuestions, ''])}
                          style={{ all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 8, background: '#eef2ed', fontSize: 14, fontWeight: 600 }}
                        >
                          + Add question
                        </button>
                      </div>
                    </div>
                  ) : evalLoading ? (
                    <div style={{ padding: 16, border: '1px solid #e1e5dd', borderRadius: 10, background: '#fafbf8' }}>
                      <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 10 }}>Evaluating questions…</div>
                      <div style={{ position: 'relative', height: 6, background: '#e6eef6', borderRadius: 999, overflow: 'hidden' }}>
                        <div
                          className="capy-progress"
                          style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, #0d9488, #8ab69a)', borderRadius: 999 }}
                        />
                      </div>
                      <style>{`
                        @keyframes capyProgressSlide {
                          0%   { left: -40%; }
                          100% { left: 100%; }
                        }
                        .capy-progress { animation: capyProgressSlide 1.2s ease-in-out infinite; }
                      `}</style>
                    </div>
                  ) : evalError ? (
                    <div style={{ padding: 16, border: '1px solid #f4a8a4', borderRadius: 10, background: '#fde2e1', color: '#8a1f1a', fontSize: 14 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Evaluation failed</div>
                      <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{evalError}</div>
                      <button
                        type="button"
                        onClick={runEvaluation}
                        style={{ all: 'unset', cursor: 'pointer', marginTop: 10, padding: '6px 12px', borderRadius: 8, background: '#fff', border: '1px solid #f4a8a4', color: '#8a1f1a', fontWeight: 600, fontSize: 13 }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : evaluation !== null ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>
                        Sorted by suggested severity. Click a question to see AI rewrite suggestions.
                      </div>
                      {evaluation.map((item, idx) => {
                        const c = severityColor[item.finding.severity];
                        const isOpen = expandedEval === idx;
                        const isPending = item.originalText !== undefined;
                        const sevLabel = isPending
                          ? 'pending replacement · save to apply'
                          : item.finding.severity === 'none' ? 'no issues detected' : `${item.finding.severity} severity`;
                        return (
                          <div
                            key={idx}
                            style={{
                              background: isPending ? '#eef2ff' : c.bg,
                              border: `1px solid ${isPending ? '#a5b4fc' : c.border}`,
                              borderRadius: 10,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              role={isPending ? undefined : 'button'}
                              tabIndex={isPending ? undefined : 0}
                              onClick={() => !isPending && setExpandedEval(isOpen ? null : idx)}
                              onKeyDown={(e) => {
                                if (isPending) return;
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setExpandedEval(isOpen ? null : idx);
                                }
                              }}
                              aria-expanded={isPending ? undefined : isOpen}
                              style={{ cursor: isPending ? 'default' : 'pointer', display: 'block', width: '100%', padding: '10px 14px' }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: isPending ? '#3730a3' : c.label, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
                                    {sevLabel}
                                    {!isPending && item.finding.issues.length > 0 && <span style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0, marginLeft: 8, color: c.label }}>· {item.finding.issues.join(', ')}</span>}
                                  </div>
                                  <div style={{ fontSize: 15, color: '#1f2937' }}>{item.text}</div>
                                  {isPending && (
                                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #a5b4fc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>Replacing</div>
                                        <div style={{ fontSize: 13, color: '#6b7280', textDecoration: 'line-through' }}>{item.originalText}</div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); undoVariation(idx); }}
                                        style={{ all: 'unset', cursor: 'pointer', padding: '4px 10px', borderRadius: 6, background: '#fff', border: '1px solid #a5b4fc', color: '#3730a3', fontSize: 12, fontWeight: 600 }}
                                      >
                                        Undo
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {!isPending && <div style={{ fontSize: 18, color: c.label, lineHeight: 1 }}>{isOpen ? '▾' : '▸'}</div>}
                              </div>
                            </div>
                            {isOpen && (
                              <div style={{ padding: '0 14px 12px 14px', borderTop: `1px solid ${c.border}` }}>
                                {item.finding.explanations.length > 0 && (
                                  <>
                                    <div style={{ fontSize: 13, color: c.label, fontWeight: 600, margin: '10px 0 6px' }}>Why this is biased</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                                      {item.finding.explanations.map((ex, eIdx) => (
                                        <div key={eIdx} style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.45 }}>
                                          {ex}
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                                {item.finding.suggestions.length > 0 ? (
                                  <>
                                    <div style={{ fontSize: 13, color: c.label, fontWeight: 600, margin: '4px 0 6px' }}>Suggested non-biased variations · click to use</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      {item.finding.suggestions.map((s, sIdx) => (
                                        <button
                                          key={sIdx}
                                          type="button"
                                          onClick={() => applyVariation(idx, s)}
                                          style={{
                                            all: 'unset',
                                            cursor: 'pointer',
                                            fontSize: 14,
                                            color: '#1f2937',
                                            background: '#fff',
                                            border: `1px solid ${c.border}`,
                                            borderRadius: 8,
                                            padding: '8px 10px',
                                            display: 'block',
                                          }}
                                        >
                                          <span style={{ color: c.label, fontWeight: 700, marginRight: 6 }}>{sIdx + 1}.</span>
                                          {s}
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <div style={{ fontSize: 13, color: '#6b7280', paddingTop: 10 }}>
                                    No bias patterns flagged for this question.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {evalDirty && (
                        <div style={{ fontSize: 13, color: '#7a5b10', background: '#fef6d4', border: '1px solid #f0d77a', padding: '8px 12px', borderRadius: 8 }}>
                          You have unsaved changes — save before closing.
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid #e6eef6', marginTop: 4 }}>
                        <button
                          type="button"
                          onClick={saveEvaluation}
                          disabled={!evalDirty}
                          className={flashing ? 'capy-flash' : undefined}
                          style={{
                            all: 'unset',
                            cursor: evalDirty ? 'pointer' : 'not-allowed',
                            padding: '10px 18px',
                            borderRadius: 10,
                            background: evalDirty ? '#0d9488' : '#cbd5d0',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {evalDirty ? 'Save changes' : 'No changes to save'}
                        </button>
                      </div>
                    </div>
                  ) : selected.questionsText ? (
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

function formatInterviewTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
