// OWNER: Person 1 (Candidate Experience)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/AuthContext';
import type { CommunicationStyle } from '@quietspace/shared-types';
import { createBrowserSupabaseClient } from '@quietspace/shared-lib';
import { BasicInfoForm } from '../../../components/onboarding/BasicInfoForm';
import { BundlePicker } from '../../../components/onboarding/BundlePicker';
import {
  EMPTY_INFO,
  BUNDLE_FEATURES,
  derivePreferencesFromFeatures,
  type ProfileInfo,
} from '../../../components/onboarding/data';

type SavedPrefs = {
  communicationStyle: CommunicationStyle;
  captionsEnabled: boolean;
  comfortCompanionEnabled: boolean;
  fontScale: number;
};

type Tab = 'profile' | 'preferences';

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

function loadPrefs(): SavedPrefs | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('capyconnect.preferences');
    return raw ? (JSON.parse(raw) as SavedPrefs) : null;
  } catch {
    return null;
  }
}

function loadFeatures(): string[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('capyconnect.features');
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

function featuresFromPreferenceRow(prefs: {
  captions_enabled?: boolean | null;
  comfort_companion_enabled?: boolean | null;
  font_scale?: number | null;
  selected_features?: string[] | null;
}): string[] {
  if (prefs.selected_features?.length) {
    return prefs.selected_features;
  }

  const features = new Set<string>();

  if (prefs.captions_enabled ?? true) {
    features.add('captions-standard');
  }
  if (prefs.comfort_companion_enabled) {
    features.add('companion');
  }

  const fontScale = prefs.font_scale ?? 100;
  if (fontScale >= 130) {
    features.add('text-largest');
  } else if (fontScale >= 115) {
    features.add('text-larger');
  } else {
    features.add('text-standard');
  }

  return Array.from(features);
}

export default function CandidateProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = React.useState<Tab>('profile');
  const [info, setInfo] = React.useState<ProfileInfo>(EMPTY_INFO);
  const [role, setRole] = React.useState<'candidate' | 'interviewer' | null>(null);
  const [profileSavedAt, setProfileSavedAt] = React.useState<number | null>(null);
  const [prefsSavedAt, setPrefsSavedAt] = React.useState<number | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const [initialBundle, setInitialBundle] = React.useState<CommunicationStyle | null>(null);
  const [initialFeatures, setInitialFeatures] = React.useState<string[]>([]);
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
      if (!user) {
        setHydrated(true);
        return;
      }
      const supabase = getSupabase();
      if (!supabase) {
        setInfo(loadProfile());
        const rawRole = typeof window !== 'undefined' ? localStorage.getItem('capyconnect.role') : null;
        setRole((rawRole as any) ?? null);
        const prefs = loadPrefs();
        const features = loadFeatures();
        const bundle = prefs?.communicationStyle ?? 'default';
        setInitialBundle(bundle);
        setInitialFeatures(features ?? BUNDLE_FEATURES[bundle]);
        setHydrated(true);
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!profileError && profile) {
          setInfo({
            ...EMPTY_INFO,
            fullName: profile.full_name ?? '',
            username: profile.username ?? '',
            birthdate: profile.birthdate ?? '',
            location: profile.location ?? '',
            avatarDataUrl: profile.avatar_url ?? '',
          });
          setRole((profile.role as any) ?? null);
        } else {
          setInfo(loadProfile());
          const rawRole = typeof window !== 'undefined' ? localStorage.getItem('capyconnect.role') : null;
          setRole((rawRole as any) ?? null);
        }
      } catch (err) {
        console.warn('Failed to load profile from Supabase', err);
        setInfo(loadProfile());
      }

      try {
        if (supabase) {
          const { data: prefs, error: prefsError } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!prefsError && prefs) {
            const bundle = (prefs.communication_style as CommunicationStyle | null) ?? 'default';
            setInitialBundle(bundle);
            setInitialFeatures(featuresFromPreferenceRow(prefs));
          } else {
            const localPrefs = loadPrefs();
            const localFeatures = loadFeatures();
            const bundle = localPrefs?.communicationStyle ?? 'default';
            setInitialBundle(bundle);
            setInitialFeatures(localFeatures ?? BUNDLE_FEATURES[bundle]);
          }
        }
      } catch (err) {
        console.warn('Failed to load preferences from Supabase', err);
        const localPrefs = loadPrefs();
        const localFeatures = loadFeatures();
        const bundle = localPrefs?.communicationStyle ?? 'default';
        setInitialBundle(bundle);
        setInitialFeatures(localFeatures ?? BUNDLE_FEATURES[bundle]);
      }

      setHydrated(true);
    };

    void load();
  }, [user, getSupabase]);

  // Expose a global save function for the header to call and inform header when editing
  React.useEffect(() => {
    if (isEditing) {
      (window as any).capyProfileSave = () => {
        const form = document.getElementById('candidate-profile-form') as HTMLFormElement | null;
        if (form && typeof form.requestSubmit === 'function') {
          form.requestSubmit();
        }
      };
      window.dispatchEvent(new CustomEvent('capy:profileEditing', { detail: { isEditing: true } }));
    } else {
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

  async function handleProfileSave() {
    const profile = {
      full_name: info.fullName.trim(),
      username: info.username.trim(),
      birthdate: info.birthdate,
      location: info.location.trim(),
      avatar_url: info.avatarDataUrl,
    };

    const supabase = getSupabase();
    if (user && supabase) {
      const { error } = await supabase.from('user_profiles').upsert(
        {
          user_id: user.id,
          ...profile,
          role: role ?? 'candidate',
        },
        { onConflict: 'user_id' }
      );
      if (error) {
        console.warn('Failed to persist profile to Supabase', error);
      }
    }

    try {
      if (typeof document !== 'undefined') {
        document.cookie = `capyconnect.role=${encodeURIComponent(role ?? 'candidate')}; Path=/; SameSite=Lax`;
      }
    } catch {}

    setProfileSavedAt(Date.now());
    setIsEditing(false);
  }

  async function handlePreferencesSave(bundle: CommunicationStyle, features: string[]) {
    const prefs = {
      user_id: user?.id,
      communication_style: bundle,
      ...derivePreferencesFromFeatures(features),
    };
    const supabase = getSupabase();
    if (user && supabase) {
      const { error } = await supabase.from('user_preferences').upsert(prefs, { onConflict: 'user_id' });
      if (error) {
        console.warn('Failed to persist preferences to Supabase', error);
      }
    }

    setPrefsSavedAt(Date.now());
  }

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
        </div>
        <Link
          href="/candidate/dashboard"
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

      <Tabs tab={tab} onChange={setTab} hidePreferences={role === 'interviewer'} />

      <div style={{ marginTop: 24 }}>
        {tab === 'profile' && (
          isEditing ? (
            <BasicInfoForm info={info} onChange={setInfo} onSubmit={handleProfileSave} mode="edit" savedAt={profileSavedAt} role={role} formId="candidate-profile-form" title="" subtitle="" />
          ) : (
            <BasicInfoForm info={info} onChange={setInfo} onSubmit={() => {}} mode="edit" savedAt={profileSavedAt} role={role} readOnly formId="candidate-profile-form" title="" subtitle="" />
          )
        )}

        {tab === 'preferences' && hydrated && role !== 'interviewer' && (
          <BundlePicker
            key={`prefs-${initialBundle}`}
            title="Communication preferences"
            subtitle="Pick a bundle to expand it, then drag features between columns or use the +/− buttons."
            saveLabel="Save preferences"
            initialBundle={initialBundle}
            initialFeatures={initialFeatures}
            savedAt={prefsSavedAt}
            onSave={handlePreferencesSave}
          />
        )}
      </div>
    </main>
  );
}

function Tabs({ tab, onChange, hidePreferences = false }: { tab: Tab; onChange: (t: Tab) => void; hidePreferences?: boolean }) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    ...(hidePreferences
      ? []
      : ([{ id: 'preferences' as Tab, label: 'Communication preferences', icon: '🎛' }] as { id: Tab; label: string; icon: string }[])),
  ];
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        background: '#eef2ed',
        padding: 4,
        borderRadius: 14,
        gap: 4,
      }}
    >
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(t.id)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              color: active ? '#2a2d33' : '#6b7280',
              background: active ? '#fff' : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(20, 30, 25, 0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 120ms ease, color 120ms ease',
            }}
          >
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
