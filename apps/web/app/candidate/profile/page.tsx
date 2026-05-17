// OWNER: Person 1 (Candidate Experience)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import Link from 'next/link';
import type { CommunicationStyle } from '@quietspace/shared-types';
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

export default function CandidateProfilePage() {
  const [tab, setTab] = React.useState<Tab>('profile');
  const [info, setInfo] = React.useState<ProfileInfo>(EMPTY_INFO);
  const [role, setRole] = React.useState<'candidate' | 'interviewer' | null>(null);
  const [profileSavedAt, setProfileSavedAt] = React.useState<number | null>(null);
  const [prefsSavedAt, setPrefsSavedAt] = React.useState<number | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const [initialBundle, setInitialBundle] = React.useState<CommunicationStyle | null>(null);
  const [initialFeatures, setInitialFeatures] = React.useState<string[]>([]);

  React.useEffect(() => {
    setInfo(loadProfile());
    try {
      const rawRole = localStorage.getItem('capyconnect.role');
      setRole((rawRole as any) ?? null);
    } catch {}
    const prefs = loadPrefs();
    const features = loadFeatures();
    const bundle = prefs?.communicationStyle ?? 'default';
    setInitialBundle(bundle);
    setInitialFeatures(features ?? BUNDLE_FEATURES[bundle]);
    setHydrated(true);
  }, []);

  function handleProfileSave() {
    const profile = {
      fullName: info.fullName.trim(),
      username: info.username.trim(),
      birthdate: info.birthdate,
      location: info.location.trim(),
      avatarDataUrl: info.avatarDataUrl,
    };
    try {
      localStorage.setItem('capyconnect.profile', JSON.stringify(profile));
      // if role exists in localStorage, ensure cookie is set as well
      try {
        const rawRole = localStorage.getItem('capyconnect.role') ?? 'candidate';
        if (typeof document !== 'undefined') {
          document.cookie = `capyconnect.role=${encodeURIComponent(rawRole)}; Path=/; SameSite=Lax`;
        }
      } catch {}
    } catch {}
    setProfileSavedAt(Date.now());
  }

  function handlePreferencesSave(bundle: CommunicationStyle, features: string[]) {
    const prefs = {
      communicationStyle: bundle,
      ...derivePreferencesFromFeatures(features),
    };
    try {
      localStorage.setItem('capyconnect.preferences', JSON.stringify(prefs));
      localStorage.setItem('capyconnect.features', JSON.stringify(features));
    } catch {}
    setPrefsSavedAt(Date.now());
  }

  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Edit your profile</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: 14 }}>
            Update your details or rework your communication preferences. Changes save in place.
          </p>
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
          <BasicInfoForm
            info={info}
            onChange={setInfo}
            onSubmit={handleProfileSave}
            mode="edit"
            savedAt={profileSavedAt}
            role={role}
          />
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
