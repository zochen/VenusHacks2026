// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@quietspace/shared-ui';
import { createBrowserSupabaseClient } from '@quietspace/shared-lib';
import { useAuth } from '../../../lib/AuthContext';

export default function NewInterviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [when, setWhen] = React.useState('');
  const [questionsRaw, setQuestionsRaw] = React.useState('');
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [filePreview, setFilePreview] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const getSupabase = React.useCallback(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null;
    }
    return createBrowserSupabaseClient({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitted(true);
    const questions = questionsRaw.split(/\r?\n/).map((q) => q.trim()).filter(Boolean).join('\n');

    const localPart = email ? email.split('@')[0] : '';
    const candidateName = localPart
      ? localPart.split(/[._-]/).map((p) => {
          const s = String(p ?? '');
          return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : '';
        }).join(' ')
      : email;

    const supabase = getSupabase();
    if (user && supabase) {
      const { data: interview, error: interviewError } = await supabase
        .from('planned_interviews')
        .insert({
          interviewer_id: user.id,
          candidate_email: email,
          candidate_name: candidateName,
          role,
          scheduled_at: new Date(when).toISOString(),
          status: 'scheduled',
        })
        .select('id')
        .single();

      if (interviewError || !interview) {
        console.warn('Failed to create planned interview in Supabase', interviewError);
        setError(interviewError?.message ?? 'Failed to create planned interview.');
        setSubmitted(false);
        return;
      }

      const questionRows = questions
        .split('\n')
        .map((prompt) => prompt.trim())
        .filter(Boolean)
        .map((prompt, index) => ({
          interview_id: interview.id,
          prompt,
          order_number: index + 1,
        }));

      if (questionRows.length > 0) {
        const { error: questionsError } = await supabase.from('questions').insert(questionRows);
        if (questionsError) {
          console.warn('Failed to create interview questions in Supabase', questionsError);
          setError(questionsError.message);
          setSubmitted(false);
          return;
        }
      }

      window.setTimeout(() => router.push('/interviewer/dashboard'), 1200);
      return;
    }

    // Fallback for local/demo mode when Supabase auth is unavailable.
    try {
      const raw = localStorage.getItem('capyconnect.interviews');
      const existing = raw ? (JSON.parse(raw) as any[]) : [];
      const id = `iv-${Date.now()}`;
      const interview = {
        id,
        candidate: candidateName,
        email,
        role,
        when,
        style: 'default',
        status: 'scheduled',
        inviteStatus: 'pending',
        questionsText: questions || null,
        attachedFileName: fileName,
        attachedFileDataUrl: filePreview,
      };
      existing.unshift(interview);
      localStorage.setItem('capyconnect.interviews', JSON.stringify(existing));
    } catch (err) {
      // ignore storage errors
    }

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
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Questions</div>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>
              Paste your questions below — one per line. Blank lines are ignored.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea
                rows={12}
                required={!filePreview}
                value={questionsRaw}
                onChange={(e) => setQuestionsRaw(e.target.value)}
                placeholder={'Walk me through how you would design a URL shortener.\n\nDescribe a recent project where you owned a feature end-to-end.'}
                style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt,.pdf,text/plain,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setFileName(f.name);
                    if (f.type === 'text/plain' || f.name.endsWith('.txt')) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setQuestionsRaw(String(reader.result ?? ''));
                        setFilePreview(null);
                      };
                      reader.readAsText(f);
                    } else if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFilePreview(String(reader.result ?? ''));
                      };
                      reader.readAsDataURL(f);
                    } else {
                      setFileName(null);
                      setFilePreview(null);
                    }
                  }}
                />
                <Button variant="secondary" type="button" onClick={() => fileRef.current?.click()}>
                  Upload .txt or .pdf
                </Button>
                {fileName && <div style={{ color: '#6b7280', fontSize: 13 }}>{fileName}</div>}
              </div>
            </div>
          </label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button variant="primary" type="submit" disabled={submitted}>
              {submitted ? 'Creating...' : 'Create interview'}
            </Button>
            {submitted && <span style={{ color: '#0d9488', fontSize: 14 }}>✓ Sent — redirecting</span>}
          </div>
          {error && (
            <div style={{ color: '#991b1b', background: '#fee2e2', borderRadius: 10, padding: 12, fontSize: 14 }}>
              {error}
            </div>
          )}
        </form>
      </Card>
    </main>
  );
}
