// Simple interviewer profile edit page

 'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/AuthContext';
import { createBrowserSupabaseClient } from '@quietspace/shared-lib';
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
  const { user, isLoading } = useAuth();
  const [info, setInfo] = React.useState<ProfileInfo>(EMPTY_INFO);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

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
    const load = async () => {
      if (isLoading) {
        return;
      }

      if (!user) {
        setInfo(loadProfile());
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        setInfo(loadProfile());
        return;
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('Failed to load interviewer profile from Supabase', error);
        setInfo(loadProfile());
        return;
      }

      if (!profile) {
        // No saved row yet — pre-fill from whatever onboarding stored locally
        // so the user doesn't see an empty edit form on first visit.
        setInfo(loadProfile());
        return;
      }

      setInfo({
        ...EMPTY_INFO,
        fullName: profile.full_name ?? '',
        username: profile.username ?? '',
        birthdate: profile.birthdate ?? '',
        location: profile.location ?? '',
        avatarDataUrl: profile.avatar_url ?? '',
        company: profile.company ?? '',
        companyRole: profile.company_role ?? '',
      });
    };

    void load();
  }, [user, isLoading, getSupabase]);

  async function handleSave() {
    const profile = {
      full_name: info.fullName.trim(),
      username: info.username.trim(),
      birthdate: info.birthdate,
      location: info.location.trim(),
      avatar_url: info.avatarDataUrl,
      company: info.company?.trim() || null,
      company_role: info.companyRole?.trim() || null,
    };

    const supabase = getSupabase();
    if (user && supabase) {
      const { error } = await supabase.from('user_profiles').upsert(
        {
          user_id: user.id,
          ...profile,
          role: 'interviewer',
        },
        { onConflict: 'user_id' }
      );
      if (error) {
        console.warn('Failed to persist interviewer profile to Supabase', error);
      }
    }

    try {
      document.cookie = 'capyconnect.role=interviewer; Path=/; SameSite=Lax';
      localStorage.setItem('capyconnect.role', 'interviewer');
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
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px', fontFamily: "Poppins, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 14, color: '#6b7280', marginRight: 6 }}>Interviewer</div>
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
        </div>
      </header>

      {isEditing ? (
        <BasicInfoForm info={info} onChange={setInfo} onSubmit={handleSave} mode="edit" savedAt={savedAt} role={'interviewer'} formId="interviewer-profile-form" title="" subtitle="" />
      ) : (
        <BasicInfoForm info={info} onChange={setInfo} onSubmit={() => {}} mode="edit" savedAt={savedAt} role={'interviewer'} readOnly formId="interviewer-profile-form" title="" subtitle="" />
      )}
    </main>
  );
}
