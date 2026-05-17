// Simple interviewer profile edit page

 'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/AuthContext';
import { BasicInfoForm } from '../../../components/onboarding/BasicInfoForm';
import { EMPTY_INFO, type ProfileInfo } from '../../../components/onboarding/data';

function loadProfile(): ProfileInfo {
  if (typeof window === 'undefined') return EMPTY_INFO;
  try {
    const raw = localStorage.getItem('capyconnect.profile');
    if (!raw) return EMPTY_INFO;
    const parsed = JSON.parse(raw) as Partial<ProfileInfo>;
    return { ...EMPTY_INFO, ...parsed };
  } catch {
    return EMPTY_INFO;
  }
}

export default function InterviewerProfilePage() {
  const { user } = useAuth();
  const [info, setInfo] = React.useState<ProfileInfo>(EMPTY_INFO);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    setInfo(loadProfile());
  }, []);

  function handleSave() {
    const profile = {
      fullName: info.fullName.trim(),
      username: info.username.trim(),
      birthdate: info.birthdate,
      location: info.location.trim(),
      avatarDataUrl: info.avatarDataUrl,
      company: (info as any).company,
      companyRole: (info as any).companyRole,
    };
    try {
      localStorage.setItem('capyconnect.profile', JSON.stringify(profile));
    } catch {}
    setSavedAt(Date.now());
    setIsEditing(false);
  }

  // register global save handler for header
  React.useEffect(() => {
    if (isEditing) {
      // expose a global save function that triggers the form submission
      (window as any).capyProfileSave = () => {
        const form = document.getElementById('interviewer-profile-form') as HTMLFormElement | null;
        if (form && typeof form.requestSubmit === 'function') {
          form.requestSubmit();
        }
      };
      // let header know we're editing
      window.dispatchEvent(new CustomEvent('capy:profileEditing', { detail: { isEditing: true } }));
    } else {
      // cleanup
      try {
        if ((window as any).capyProfileSave) delete (window as any).capyProfileSave;
      } catch {}
      window.dispatchEvent(new CustomEvent('capy:profileEditing', { detail: { isEditing: false } }));
    }
    return () => {
      try {
        if ((window as any).capyProfileSave) delete (window as any).capyProfileSave;
      } catch {}
      window.dispatchEvent(new CustomEvent('capy:profileEditing', { detail: { isEditing: false } }));
    };
  }, [isEditing]);

  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: '#eef6f8',
              border: '1px solid #e1e5dd',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Edit your profile
          </button>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Your profile</h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 14 }}>View and manage your interviewer profile.</p>
          </div>
        </div>
        <Link
          href="/interviewer/dashboard"
          style={{
            padding: '8px 14px',
            border: '1px solid #e1e5dd',
            borderRadius: 12,
            color: '#2a2d33',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          ← Back to dashboard
        </Link>
      </header>

      {isEditing ? (
        <BasicInfoForm info={info} onChange={setInfo} onSubmit={handleSave} mode="edit" savedAt={savedAt} role={'interviewer'} formId="interviewer-profile-form" />
      ) : (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: info.avatarDataUrl ? `url(${info.avatarDataUrl}) center/cover no-repeat` : '#eef2ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700 }}>
            {!info.avatarDataUrl && (info.fullName.trim()[0]?.toUpperCase() ?? '🌿')}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{info.fullName || '—'}</div>
            <div style={{ color: '#6b7280' }}>@{info.username || '—'}</div>
            <div style={{ marginTop: 8, color: '#6b7280' }}>Email: {user?.email ?? '—'}</div>
            <div style={{ marginTop: 6, color: '#6b7280' }}>Location: {info.location || '—'}</div>
            <div style={{ marginTop: 6, color: '#6b7280' }}>Birthdate: {info.birthdate || '—'}</div>
            <div style={{ marginTop: 6, color: '#6b7280' }}>Company: {(info as any).company || '—'}</div>
            <div style={{ marginTop: 6, color: '#6b7280' }}>Role: {(info as any).companyRole || '—'}</div>
          </div>
        </div>
      )}
    </main>
  );
}
