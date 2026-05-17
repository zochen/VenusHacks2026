// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { CommunicationStyle } from '@quietspace/shared-types';
import { BasicInfoForm } from '../../components/onboarding/BasicInfoForm';
import { BundlePicker } from '../../components/onboarding/BundlePicker';
import { EMPTY_INFO, derivePreferencesFromFeatures, type ProfileInfo } from '../../components/onboarding/data';

type Step = 'role' | 'info' | 'style';
type Role = 'candidate' | 'interviewer' | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>('role');
  const [role, setRole] = React.useState<Role>(null);
  const [info, setInfo] = React.useState<ProfileInfo>(EMPTY_INFO);

  function handleInfoSubmit() {
    const profile = {
      fullName: info.fullName.trim(),
      username: info.username.trim(),
      birthdate: info.birthdate,
      location: info.location.trim(),
      avatarDataUrl: info.avatarDataUrl,
      // optional interviewer fields
      company: (info as any).company ?? undefined,
      companyRole: (info as any).companyRole ?? undefined,
    };
    try {
      // persist role along with basic profile info
      localStorage.setItem('capyconnect.role', role ?? 'candidate');
    } catch {}
    try {
      // also set a cookie so server-side middleware can enforce role-based routing
      if (typeof document !== 'undefined') {
        document.cookie = `capyconnect.role=${encodeURIComponent(role ?? 'candidate')}; Path=/; SameSite=Lax`;
      }
    } catch {}
    try {
      localStorage.setItem('capyconnect.profile', JSON.stringify(profile));
    } catch {}
    // If the user is an interviewer, skip the communication style step and go to interviewer dashboard
    if (role === 'interviewer') {
      try {
        router.push('/interviewer/dashboard');
        return;
      } catch {}
    }
    setStep('style');
  }

  function handleStyleSave(bundle: CommunicationStyle, features: string[]) {
    const prefs = {
      communicationStyle: bundle,
      ...derivePreferencesFromFeatures(features),
    };
    try {
      localStorage.setItem('capyconnect.preferences', JSON.stringify(prefs));
      localStorage.setItem('capyconnect.features', JSON.stringify(features));
    } catch {}
    router.push('/candidate/dashboard');
  }

  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px' }}>
      {/* Hide the step indicator while role picking */}
      {step !== 'role' && <StepIndicator step={step} onJumpToInfo={() => setStep('info')} role={role} />}

      {step === 'role' && (
        <RolePicker
          onChoose={(r) => {
            setRole(r);
            setStep('info');
          }}
        />
      )}

      {step === 'info' && (
        <BasicInfoForm info={info} onChange={setInfo} onSubmit={handleInfoSubmit} mode="create" role={role} showPasswordFields={false} />
      )}

      {step === 'style' && <BundlePicker onSave={handleStyleSave} />}
    </main>
  );
}

function StepIndicator({ step, onJumpToInfo, role }: { step: Step; onJumpToInfo: () => void; role?: Role | null }) {
  // If role is interviewer, hide the Communication style step
  const steps = role === 'interviewer'
    ? [{ id: 'info' as Step, label: 'Your profile' }]
    : [
        { id: 'info' as Step, label: 'Your profile' },
        { id: 'style' as Step, label: 'Communication style' },
      ];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 32 }}>
      {steps.map((s, idx) => {
        const isCurrent = s.id === step;
        const isDone = step === 'style' && s.id === 'info';
        const canClick = s.id === 'info' && step === 'style';
        return (
          <React.Fragment key={s.id}>
            <button
              type="button"
              onClick={() => canClick && onJumpToInfo()}
              disabled={!canClick}
              style={{
                all: 'unset',
                cursor: canClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 12px',
                borderRadius: 999,
                background: isCurrent ? '#e3efe7' : 'transparent',
                opacity: isCurrent || isDone ? 1 : 0.5,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: isDone || isCurrent ? '#5b8b6f' : '#cfd6cc',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {isDone ? '✓' : idx + 1}
              </span>
              <span style={{ fontSize: 14, fontWeight: isCurrent ? 600 : 500, color: '#2a2d33' }}>
                {s.label}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <span aria-hidden style={{ width: 32, height: 2, background: '#cfd6cc' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function RolePicker({ onChoose }: { onChoose: (r: Role) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 40 }}>
      <h2 className="capy-title" style={{ fontSize: 28, margin: 0 }}>Who are you?</h2>
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <button
          type="button"
          onClick={() => onChoose('candidate')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '18px 28px',
            borderRadius: 14,
            border: '1px solid rgba(45, 55, 72, 0.08)',
            background: '#fff',
            boxShadow: '0 1px 2px rgba(20,30,25,0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 180,
          }}
        >
          <div style={{ fontSize: 28 }}>👤</div>
          <div className="capy-title" style={{ marginTop: 10, fontSize: 20, fontWeight: 600 }}>Candidate</div>
        </button>

        <button
          type="button"
          onClick={() => onChoose('interviewer')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '18px 28px',
            borderRadius: 14,
            border: '1px solid rgba(45, 55, 72, 0.08)',
            background: '#fff',
            boxShadow: '0 1px 2px rgba(20,30,25,0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 180,
          }}
        >
          <div style={{ fontSize: 28 }}>💼</div>
          <div className="capy-title" style={{ marginTop: 10, fontSize: 20, fontWeight: 600 }}>Interviewer</div>
        </button>
      </div>
    </div>
  );
}
