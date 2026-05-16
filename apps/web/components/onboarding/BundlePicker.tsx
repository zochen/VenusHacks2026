// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web — shared between /onboarding and /candidate/profile
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import type { CommunicationStyle } from '@quietspace/shared-types';
import { Card, Button } from '@quietspace/shared-ui';
import { ALL_FEATURES, BUNDLES, BUNDLE_FEATURES, type Feature, type ColumnKey } from './data';

export interface BundlePickerProps {
  title?: string;
  subtitle?: string;
  saveLabel?: string;
  initialBundle?: CommunicationStyle | null;
  initialFeatures?: string[];
  savedAt?: number | null;
  onSave: (bundle: CommunicationStyle, features: string[]) => void;
  /** When true, do not show the "Cancel" / collapse buttons on the customizer. */
  alwaysExpanded?: boolean;
}

export function BundlePicker({
  title = 'How do you communicate best?',
  subtitle = 'Pick a bundle to expand it — then drag features between columns or use the +/− buttons.',
  saveLabel = 'Save and continue →',
  initialBundle = null,
  initialFeatures,
  savedAt,
  onSave,
  alwaysExpanded = false,
}: BundlePickerProps) {
  const [expanded, setExpanded] = React.useState<CommunicationStyle | null>(initialBundle);
  const [selectedFeatures, setSelectedFeatures] = React.useState<Set<string>>(
    new Set(initialFeatures ?? (initialBundle ? BUNDLE_FEATURES[initialBundle] : [])),
  );

  function openBundle(id: CommunicationStyle) {
    if (expanded === id && !alwaysExpanded) {
      setExpanded(null);
      return;
    }
    setSelectedFeatures(new Set(BUNDLE_FEATURES[id]));
    setExpanded(id);
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
    onSave(expanded, Array.from(selectedFeatures));
  }

  const selected = ALL_FEATURES.filter((f) => selectedFeatures.has(f.id));
  const available = ALL_FEATURES.filter((f) => !selectedFeatures.has(f.id));
  const currentBundle = BUNDLES.find((b) => b.id === expanded);

  return (
  <section style={{ animation: 'capyconnect-panel-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, margin: '0 0 10px' }}>{title}</h1>
        <p style={{ color: '#6b7280', fontSize: 16, margin: 0 }}>{subtitle}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {BUNDLES.map((b) => {
          const isActive = expanded === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => openBundle(b.id)}
              aria-pressed={isActive}
              aria-expanded={isActive}
              style={{ all: 'unset', cursor: 'pointer', display: 'block', borderRadius: 20 }}
            >
              <Card
                elevated={isActive}
                style={{
                  height: '100%',
                  transition: 'transform 150ms ease, background 150ms ease, border-color 150ms ease',
                  border: isActive ? '2px solid #5b8b6f' : '1px solid #e1e5dd',
                  background: isActive ? '#f4f8f5' : '#fff',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 20 }}>{b.title}</h3>
                <p style={{ margin: '0 0 12px', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>{b.subtitle}</p>
                <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>{b.details}</p>
                <div style={{ fontSize: 12, color: '#5b8b6f', fontWeight: 600 }}>
                  {isActive ? '▾ Customizing below' : `${BUNDLE_FEATURES[b.id].length} features included →`}
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {expanded && currentBundle && (
        <BundleCustomizer
          key={expanded}
          bundle={currentBundle}
          selected={selected}
          available={available}
          saveLabel={saveLabel}
          savedAt={savedAt}
          allowCollapse={!alwaysExpanded}
          onAdd={addFeature}
          onRemove={removeFeature}
          onCollapse={() => setExpanded(null)}
          onSave={save}
        />
      )}
    </section>
  );
}

function BundleCustomizer({
  bundle,
  selected,
  available,
  saveLabel,
  savedAt,
  allowCollapse,
  onAdd,
  onRemove,
  onCollapse,
  onSave,
}: {
  bundle: { id: CommunicationStyle; title: string; icon: string };
  selected: Feature[];
  available: Feature[];
  saveLabel: string;
  savedAt?: number | null;
  allowCollapse: boolean;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onCollapse: () => void;
  onSave: () => void;
}) {
  const [dragOver, setDragOver] = React.useState<ColumnKey | null>(null);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  function handleDrop(e: React.DragEvent, target: ColumnKey) {
    e.preventDefault();
    setDragOver(null);
    setDraggingId(null);
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    try {
      const { featureId, from } = JSON.parse(raw) as { featureId: string; from: ColumnKey };
      if (from === target) return;
      if (target === 'selected') onAdd(featureId);
      else onRemove(featureId);
    } catch {}
  }

  function handleDragOver(e: React.DragEvent, target: ColumnKey) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(target);
  }

  const justSaved = savedAt && Date.now() - savedAt < 4000;

  return (
    <section
      style={{
        marginTop: 24,
        background: '#fff',
        border: '1px solid #e1e5dd',
        borderRadius: 24,
        padding: 28,
        boxShadow: '0 4px 16px rgba(20, 30, 25, 0.06)',
        overflow: 'hidden',
  animation: 'capyconnect-panel-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 26 }}>{bundle.icon}</span>
            <h2 style={{ margin: 0, fontSize: 22 }}>{bundle.title} bundle</h2>
          </div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
            Drag features between columns, or use the +/− buttons. Picking a different captions/video/text size
            swaps the previous one out automatically.
          </p>
        </div>
        {allowCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Collapse"
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 13,
              color: '#6b7280',
              border: '1px solid #e1e5dd',
            }}
          >
            Collapse ▴
          </button>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Column
          name="selected"
          title="Current features"
          subtitle={`${selected.length} selected · drop here to add`}
          accent
          isDragTarget={dragOver === 'selected'}
          onDragOver={(e) => handleDragOver(e, 'selected')}
          onDragLeave={() => setDragOver((c) => (c === 'selected' ? null : c))}
          onDrop={(e) => handleDrop(e, 'selected')}
        >
          {selected.length === 0 ? (
            <Empty message="No features selected. Drag some from the right, or click +." />
          ) : (
            selected.map((f) => (
              <FeatureRow
                key={f.id}
                feature={f}
                action="remove"
                from="selected"
                dragging={draggingId === f.id}
                onDragStart={() => setDraggingId(f.id)}
                onDragEnd={() => setDraggingId(null)}
                onClick={() => onRemove(f.id)}
              />
            ))
          )}
        </Column>
        <Column
          name="available"
          title="More features"
          subtitle={`${available.length} available · drop here to remove`}
          isDragTarget={dragOver === 'available'}
          onDragOver={(e) => handleDragOver(e, 'available')}
          onDragLeave={() => setDragOver((c) => (c === 'available' ? null : c))}
          onDrop={(e) => handleDrop(e, 'available')}
        >
          {available.length === 0 ? (
            <Empty message="You've added everything!" />
          ) : (
            available.map((f) => (
              <FeatureRow
                key={f.id}
                feature={f}
                action="add"
                from="available"
                dragging={draggingId === f.id}
                onDragStart={() => setDraggingId(f.id)}
                onDragEnd={() => setDraggingId(null)}
                onClick={() => onAdd(f.id)}
              />
            ))
          )}
        </Column>
      </div>

      <footer style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #e1e5dd' }}>
        {justSaved && <span style={{ color: '#5b8b6f', fontSize: 14 }}>✓ Saved</span>}
        {allowCollapse && (
          <Button variant="ghost" onClick={onCollapse}>Cancel</Button>
        )}
        <Button variant="primary" size="lg" onClick={onSave}>
          {saveLabel}
        </Button>
      </footer>
    </section>
  );
}

function Column({
  name,
  title,
  subtitle,
  accent,
  isDragTarget,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: {
  name: ColumnKey;
  title: string;
  subtitle: string;
  accent?: boolean;
  isDragTarget?: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  children: React.ReactNode;
}) {
  const baseBg = accent ? '#f4f8f5' : '#fafafa';
  const baseBorder = accent ? '#cfe0d4' : '#e1e5dd';
  return (
    <div
      data-column={name}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        background: isDragTarget ? '#e3efe7' : baseBg,
        border: `2px ${isDragTarget ? 'solid' : 'dashed'} ${isDragTarget ? '#5b8b6f' : baseBorder}`,
        borderRadius: 16,
        padding: 16,
        minHeight: 320,
        transition: 'background 120ms ease, border-color 120ms ease',
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
  from,
  dragging,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  feature: Feature;
  action: 'add' | 'remove';
  from: ColumnKey;
  dragging: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const isAdd = action === 'add';

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('application/json', JSON.stringify({ featureId: feature.id, from }));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart();
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        background: '#fff',
        border: '1px solid #e1e5dd',
        borderRadius: 12,
        cursor: 'grab',
        opacity: dragging ? 0.4 : 1,
        transform: dragging ? 'scale(0.98)' : 'none',
        transition: 'opacity 120ms ease, transform 120ms ease, background 120ms ease, border-color 120ms ease',
      }}
      onMouseEnter={(e) => {
        if (dragging) return;
        e.currentTarget.style.background = isAdd ? '#f4f8f5' : '#fdf3f1';
        e.currentTarget.style.borderColor = isAdd ? '#cfe0d4' : '#f0c8c0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff';
        e.currentTarget.style.borderColor = '#e1e5dd';
      }}
    >
      <span aria-hidden style={{ flexShrink: 0, color: '#9aa0ad', fontSize: 14, letterSpacing: -1, userSelect: 'none' }}>⋮⋮</span>
      <button
        type="button"
        onClick={onClick}
        aria-label={isAdd ? `Add ${feature.label}` : `Remove ${feature.label}`}
        style={{
          all: 'unset',
          cursor: 'pointer',
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
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#2a2d33' }}>{feature.label}</div>
        {feature.hint && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{feature.hint}</div>}
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
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div style={{ padding: 20, textAlign: 'center', color: '#6b7280', fontSize: 13, fontStyle: 'italic' }}>
      {message}
    </div>
  );
}
