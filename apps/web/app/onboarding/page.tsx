// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { CommunicationStyle } from '@quietspace/shared-types';
import { Card, Button } from '@quietspace/shared-ui';

type Feature = {
  id: string;
  label: string;
  group?: string;
  hint?: string;
};

const ALL_FEATURES: Feature[] = [
  { id: 'captions-standard', label: 'Standard captions', group: 'captions', hint: 'Live captions overlaid on the interviewer video' },
  { id: 'captions-high-contrast', label: 'High-contrast captions', group: 'captions', hint: 'Bright yellow on black for max legibility' },
  { id: 'captions-large', label: 'Large-text captions', group: 'captions', hint: '24pt caption text' },
  { id: 'video-small', label: 'Small interviewer video', group: 'video', hint: 'Picture-in-picture corner' },
  { id: 'video-medium', label: 'Medium interviewer video', group: 'video', hint: 'Standard centered video' },
  { id: 'video-large', label: 'Large interviewer video', group: 'video', hint: 'Fills the viewport' },
  { id: 'text-standard', label: 'Standard question text', group: 'text', hint: '20pt question display' },
  { id: 'text-larger', label: 'Larger question text', group: 'text', hint: '24pt question display' },
  { id: 'text-largest', label: 'Largest question text', group: 'text', hint: '28pt question display' },
  { id: 'companion', label: 'Comfort companion', hint: 'Breathing capybara in the corner' },
  { id: 'pacing-extra-time', label: 'Extra response time', hint: 'Pads timers by 30% across the session' },
  { id: 'pacing-ai-clarify', label: 'AI-clarified questions', hint: 'Rewrites idiomatic questions for clarity' },
  { id: 'pacing-pause-warnings', label: 'Pause warnings for interviewer', hint: 'Nudges interviewer to pause longer between questions' },
];

const BUNDLE_FEATURES: Record<CommunicationStyle, string[]> = {
  default: ['captions-standard', 'video-medium', 'text-standard'],
  relaxed: ['captions-standard', 'video-medium', 'text-standard', 'companion', 'pacing-extra-time', 'pacing-pause-warnings'],
  focus: ['captions-high-contrast', 'video-small', 'text-larger', 'pacing-ai-clarify'],
};

const BUNDLES: { id: CommunicationStyle; title: string; subtitle: string; icon: string; details: string }[] = [
  {
    id: 'default',
    title: 'Default',
    subtitle: 'Standard pacing, captions on.',
    icon: '🌱',
    details: 'A typical interview rhythm with live captions — a good baseline if you have no specific preferences.',
  },
  {
    id: 'relaxed',
    title: 'Relaxed',
    subtitle: 'Extra processing time, comfort companion.',
    details: 'Interviewer is nudged to pause longer. The breathing capybara stays visible throughout.',
    icon: '🌿',
  },
  {
    id: 'focus',
    title: 'Focus',
    subtitle: 'High-contrast captions, larger text, minimal motion.',
    details: 'Reduces visual noise. AI clarification turns on by default to remove idiomatic phrasing.',
    icon: '🎯',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [expanded, setExpanded] = React.useState<CommunicationStyle | null>(null);
  const [selectedFeatures, setSelectedFeatures] = React.useState<Set<string>>(new Set());

  function openBundle(id: CommunicationStyle) {
    setSelectedFeatures(new Set(BUNDLE_FEATURES[id]));
    setExpanded(id);
  }

  function closeBundle() {
    setExpanded(null);
  }

  function addFeature(featureId: string) {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      const feature = ALL_FEATURES.find((f) => f.id === featureId);
      if (feature?.group) {
        for (const f of ALL_FEATURES) {
          if (f.group === feature.group) next.delete(f.id);
        }
      }
      next.add(featureId);
      return next;
    });
  }

  function removeFeature(featureId: string) {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      next.delete(featureId);
      return next;
    });
  }

  function save() {
    if (!expanded) return;
    const features = Array.from(selectedFeatures);
    const prefs = {
      communicationStyle: expanded,
      captionsEnabled: features.some((f) => f.startsWith('captions-')),
      comfortCompanionEnabled: features.includes('companion'),
      fontScale: features.includes('text-largest') ? 1.3 : features.includes('text-larger') ? 1.15 : 1,
    };
    try {
      localStorage.setItem('quietspace.preferences', JSON.stringify(prefs));
      localStorage.setItem('quietspace.features', JSON.stringify(features));
    } catch {}
    router.push('/candidate/interview');
  }

  const selected = ALL_FEATURES.filter((f) => selectedFeatures.has(f.id));
  const available = ALL_FEATURES.filter((f) => !selectedFeatures.has(f.id));
  const currentBundle = BUNDLES.find((b) => b.id === expanded);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, margin: '0 0 12px' }}>How do you communicate best?</h1>
        <p style={{ color: '#6b7280', fontSize: 17, margin: 0 }}>
          Pick a bundle to expand it — then add or remove features to tailor it to you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {BUNDLES.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => openBundle(b.id)}
            style={{ all: 'unset', cursor: 'pointer', display: 'block', borderRadius: 20 }}
          >
            <Card
              elevated
              style={{
                height: '100%',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
                border: '1px solid #e1e5dd',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
              <h3 style={{ margin: '0 0 6px', fontSize: 20 }}>{b.title}</h3>
              <p style={{ margin: '0 0 12px', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>{b.subtitle}</p>
              <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>{b.details}</p>
              <div style={{ fontSize: 12, color: '#5b8b6f', fontWeight: 600 }}>
                {BUNDLE_FEATURES[b.id].length} features included →
              </div>
            </Card>
          </button>
        ))}
      </div>

      {expanded && currentBundle && (
        <BundleCustomizer
          bundle={currentBundle}
          selected={selected}
          available={available}
          onAdd={addFeature}
          onRemove={removeFeature}
          onClose={closeBundle}
          onSave={save}
        />
      )}
    </main>
  );
}

function BundleCustomizer({
  bundle,
  selected,
  available,
  onAdd,
  onRemove,
  onClose,
  onSave,
}: {
  bundle: { id: CommunicationStyle; title: string; icon: string };
  selected: Feature[];
  available: Feature[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(20, 30, 25, 0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 999,
          animation: 'quietspace-backdrop-in 200ms ease-out',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${bundle.title} bundle`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(880px, 92vw)',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 24,
          padding: 32,
          boxShadow: '0 24px 64px rgba(20, 30, 25, 0.2)',
          zIndex: 1000,
          animation: 'quietspace-modal-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 28 }}>{bundle.icon}</span>
              <h2 style={{ margin: 0, fontSize: 24 }}>{bundle.title} bundle</h2>
            </div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              Add or remove features. Picking a different size or caption style swaps the previous one out automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
              fontSize: 20,
              color: '#6b7280',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Column title="Current features" subtitle={`${selected.length} selected`} accent>
            {selected.length === 0 ? (
              <Empty message="No features selected. Add some from the right." />
            ) : (
              selected.map((f) => (
                <FeatureRow key={f.id} feature={f} action="remove" onClick={() => onRemove(f.id)} />
              ))
            )}
          </Column>
          <Column title="More features" subtitle={`${available.length} available`}>
            {available.length === 0 ? (
              <Empty message="You've added everything!" />
            ) : (
              available.map((f) => (
                <FeatureRow key={f.id} feature={f} action="add" onClick={() => onAdd(f.id)} />
              ))
            )}
          </Column>
        </div>

        <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #e1e5dd' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="lg" onClick={onSave}>
            Save and continue →
          </Button>
        </footer>
      </div>
    </>
  );
}

function Column({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: accent ? '#f4f8f5' : '#fafafa',
        border: `1px solid ${accent ? '#cfe0d4' : '#e1e5dd'}`,
        borderRadius: 16,
        padding: 16,
        minHeight: 320,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: accent ? '#5b8b6f' : '#6b7280' }}>
          {title}
        </h3>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function FeatureRow({
  feature,
  action,
  onClick,
}: {
  feature: Feature;
  action: 'add' | 'remove';
  onClick: () => void;
}) {
  const isAdd = action === 'add';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        background: '#fff',
        border: '1px solid #e1e5dd',
        borderRadius: 12,
        transition: 'background 120ms ease, border-color 120ms ease, transform 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isAdd ? '#f4f8f5' : '#fdf3f1';
        e.currentTarget.style.borderColor = isAdd ? '#cfe0d4' : '#f0c8c0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff';
        e.currentTarget.style.borderColor = '#e1e5dd';
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: isAdd ? '#5b8b6f' : '#d97a6c',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {isAdd ? '+' : '−'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#2a2d33' }}>{feature.label}</div>
        {feature.hint && (
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{feature.hint}</div>
        )}
      </div>
      {feature.group && (
        <span
          title={`Only one ${feature.group} feature at a time`}
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: '#6b7280',
            background: '#eef2ed',
            padding: '2px 8px',
            borderRadius: 999,
          }}
        >
          {feature.group}
        </span>
      )}
    </button>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div style={{ padding: 20, textAlign: 'center', color: '#6b7280', fontSize: 13, fontStyle: 'italic' }}>
      {message}
    </div>
  );
}
