// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web — shared between /onboarding and /candidate/profile
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import { Card, Button } from '@quietspace/shared-ui';
import type { ProfileInfo } from './data';

export interface BasicInfoFormProps {
  info: ProfileInfo;
  onChange: (next: ProfileInfo) => void;
  onSubmit: () => void;
  mode?: 'create' | 'edit';
  role?: 'candidate' | 'interviewer' | null;
  readOnly?: boolean;
  formId?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  savedAt?: number | null;
  showPasswordFields?: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #e1e5dd',
  borderRadius: 12,
  fontSize: 15,
  fontFamily: 'inherit',
  background: '#fff',
  outline: 'none',
};

export function BasicInfoForm({
  info,
  onChange,
  onSubmit,
  mode = 'create',
  role = null,
  readOnly = false,
  formId,
  title,
  subtitle,
  submitLabel,
  savedAt,
  showPasswordFields = true,
}: BasicInfoFormProps) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ProfileInfo, string>>>({});

  const isEdit = mode === 'edit';
  const headerTitle = title ?? (isEdit ? 'Your profile' : 'Set up your profile');
  const headerSubtitle =
    subtitle ?? (isEdit ? 'Update any field, then save your changes.' : 'A few basics so we can save your preferences and invite you to interviews.');
  // Interviewers should see a Continue to Dashboard button during onboarding
  const buttonLabel = submitLabel ?? (isEdit ? 'Save changes' : role === 'interviewer' ? 'Continue to Dashboard' : 'Continue to communication style →');

  function set<K extends keyof ProfileInfo>(key: K, value: ProfileInfo[K]) {
    onChange({ ...info, [key]: value });
  }

  function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      setErrors((prev) => ({ ...prev, avatarDataUrl: 'Image must be under 2 MB' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set('avatarDataUrl', reader.result as string);
      setErrors((prev) => ({ ...prev, avatarDataUrl: undefined }));
    };
    reader.readAsDataURL(file);
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (info.fullName.trim().length < 2) next.fullName = 'Tell us your name.';
    if (!/^[a-z0-9_]{3,30}$/i.test(info.username.trim())) {
      next.username = '3–30 chars; letters, numbers, underscores only.';
    }
    if (!isEdit && showPasswordFields !== false) {
      if (info.password.length < 8) next.password = 'At least 8 characters.';
      if (info.confirmPassword !== info.password) next.confirmPassword = 'Passwords do not match.';
    }
    if (!info.birthdate) next.birthdate = 'Required.';
    else if (new Date(info.birthdate) > new Date()) next.birthdate = 'Birthdate must be in the past.';
    if (info.location.trim().length < 2) next.location = 'Required.';
    if (role === 'interviewer') {
      if (!info.company || info.company.trim().length < 2) next.company = 'Required.';
      if (!info.companyRole || info.companyRole.trim().length < 2) next.companyRole = 'Required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit();
  }

  const justSaved = savedAt && Date.now() - savedAt < 4000;
  const editingActive = mode === 'edit' && !readOnly;
  const headerAccent = '#caf2f7ff';
  const cardStyle: React.CSSProperties = {
    maxWidth: 640,
    margin: '0 auto',
    padding: 28,
    // when actively editing, give the card an outline matching the header
    ...(editingActive ? { boxShadow: `0 0 0 4px ${headerAccent}` } : {}),
  };

  return (
    <section style={{ animation: 'capyconnect-panel-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
      {/* show header only when explicit title/subtitle provided */}
      {(title ?? headerTitle) && (subtitle ?? headerSubtitle) ? (
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 className="capy-title" style={{ fontSize: 32, margin: '0 0 10px' }}>{title ?? headerTitle}</h1>
          <p style={{ color: '#6b7280', fontSize: 16, margin: 0 }}>{subtitle ?? headerSubtitle}</p>
        </div>
      ) : null}

      <Card style={cardStyle}>
        <form id={formId} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {readOnly ? (
              <div
                aria-hidden
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: info.avatarDataUrl ? `url(${info.avatarDataUrl}) center/cover no-repeat` : '#eef2ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5b8b6f',
                  fontSize: 36,
                  fontWeight: 700,
                }}
              >
                {!info.avatarDataUrl && (info.fullName.trim()[0]?.toUpperCase() ?? '🌿')}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Choose a profile picture"
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: info.avatarDataUrl ? `url(${info.avatarDataUrl}) center/cover no-repeat` : '#eef2ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5b8b6f',
                  fontSize: 36,
                  fontWeight: 700,
                  border: '3px solid #fff',
                  boxShadow: '0 0 0 1px #e1e5dd, 0 4px 12px rgba(20, 30, 25, 0.08)',
                  flexShrink: 0,
                }}
              >
                {!info.avatarDataUrl && (info.fullName.trim()[0]?.toUpperCase() ?? '🌿')}
              </button>
            )}
            <div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Profile picture</div>
              <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>
                Optional. PNG or JPG, under 2 MB.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!readOnly && (
                  <>
                    <Button variant="secondary" size="sm" type="button" onClick={() => fileRef.current?.click()}>
                      {info.avatarDataUrl ? 'Change' : 'Upload'}
                    </Button>
                    {info.avatarDataUrl && (
                      <Button variant="ghost" size="sm" type="button" onClick={() => set('avatarDataUrl', '')}>
                        Remove
                      </Button>
                    )}
                  </>
                )}
              </div>
              {errors.avatarDataUrl && <FieldError msg={errors.avatarDataUrl} />}
              <input ref={fileRef} type="file" accept="image/*" onChange={onAvatar} style={{ display: 'none' }} />
            </div>
          </div>

          <Field label="Full name" error={errors.fullName}>
            <input
              type="text"
              value={info.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Priya Shah"
              autoComplete="name"
              style={inputStyle}
              disabled={readOnly}
            />
          </Field>

          <Field label="Username" error={errors.username} hint="This is what other people will see.">
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e1e5dd', borderRadius: 12, background: '#fff', paddingLeft: 12 }}>
              <span style={{ color: '#6b7280', fontSize: 15 }}>@</span>
              <input
                type="text"
                value={info.username}
                onChange={(e) => set('username', e.target.value.replace(/\s/g, ''))}
                placeholder="priya"
                autoComplete="username"
                style={{ ...inputStyle, border: 'none', background: 'transparent', padding: '10px 12px 10px 4px' }}
              />
            </div>
          </Field>

          {!isEdit && showPasswordFields !== false && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Password" error={errors.password}>
                <input
                  type="password"
                  value={info.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  style={inputStyle}
                  disabled={readOnly}
                />
              </Field>
              <Field label="Confirm password" error={errors.confirmPassword}>
                <input
                  type="password"
                  value={info.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                  style={inputStyle}
                  disabled={readOnly}
                />
              </Field>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Birthdate" error={errors.birthdate}>
              <input
                type="date"
                value={info.birthdate}
                  onChange={(e) => set('birthdate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={inputStyle}
                  disabled={readOnly}
              />
            </Field>
            <Field label="Location" error={errors.location} hint="City, country">
              <input
                type="text"
                value={info.location}
                  onChange={(e) => set('location', e.target.value)}
                placeholder="Irvine, CA"
                autoComplete="address-level2"
                style={inputStyle}
                  disabled={readOnly}
              />
            </Field>
          </div>

          {/* Interviewer-specific fields shown when role is interviewer */}
          {role === 'interviewer' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Company" error={errors.company}>
                  <input
                    type="text"
                    value={info.company ?? ''}
                    onChange={(e) => set('company', e.target.value)}
                    placeholder="Acme Corp"
                    style={inputStyle}
                    disabled={readOnly}
                  />
                </Field>
                <Field label="Your role" error={errors.companyRole}>
                  <input
                    type="text"
                    value={info.companyRole ?? ''}
                    onChange={(e) => set('companyRole', e.target.value)}
                    placeholder="Talent Partner"
                    style={inputStyle}
                    disabled={readOnly}
                  />
                </Field>
            </div>
          )}

          {/* Password change flow moved — no inline note shown on profile pages */}

          {!readOnly && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 8 }}>
              {justSaved && <span style={{ color: '#5b8b6f', fontSize: 14 }}>✓ Saved</span>}
              <Button variant="primary" size="lg" type="submit">
                {buttonLabel}
              </Button>
            </div>
          )}
        </form>
      </Card>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 14 }}>{label}</div>
      {children}
      {hint && !error && <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>{hint}</div>}
      {error && <FieldError msg={error} />}
    </label>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <div style={{ color: '#d97a6c', fontSize: 12, marginTop: 4 }}>{msg}</div>;
}
