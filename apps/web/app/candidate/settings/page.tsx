// OWNER: Person 1 (Candidate Experience)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import * as React from 'react';
import type { Preferences, CommunicationStyle } from '@quietspace/shared-types';
import { Button, Card } from '@quietspace/shared-ui';

const DEFAULT_PREFS: Preferences = {
  communicationStyle: 'default',
  captionsEnabled: true,
  comfortCompanionEnabled: true,
  fontScale: 1,
};

const STYLES: CommunicationStyle[] = ['default', 'relaxed', 'focus'];

export default function CandidateSettingsPage() {
  const [prefs, setPrefs] = React.useState<Preferences>(DEFAULT_PREFS);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('quietspace.preferences');
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  function save() {
    localStorage.setItem('quietspace.preferences', JSON.stringify(prefs));
    setSavedAt(Date.now());
  }

  function reset() {
    setPrefs(DEFAULT_PREFS);
    localStorage.removeItem('quietspace.preferences');
    setSavedAt(Date.now());
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ fontSize: 32, margin: '0 0 8px' }}>Your preferences</h1>
      <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 32 }}>
        These apply to the simulator and (once you sign in) the Chrome extension overlay.
      </p>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Communication style</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setPrefs({ ...prefs, communicationStyle: s })}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: prefs.communicationStyle === s ? '2px solid #5b8b6f' : '1px solid #e1e5dd',
                background: prefs.communicationStyle === s ? '#e3efe7' : '#fff',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Display</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={prefs.captionsEnabled}
            onChange={(e) => setPrefs({ ...prefs, captionsEnabled: e.target.checked })}
          />
          <span>Show live captions</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={prefs.comfortCompanionEnabled}
            onChange={(e) => setPrefs({ ...prefs, comfortCompanionEnabled: e.target.checked })}
          />
          <span>Show comfort companion</span>
        </label>
        <label style={{ display: 'block' }}>
          <div style={{ marginBottom: 6 }}>Text size · {Math.round(prefs.fontScale * 100)}%</div>
          <input
            type="range"
            min={0.85}
            max={1.5}
            step={0.05}
            value={prefs.fontScale}
            onChange={(e) => setPrefs({ ...prefs, fontScale: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
      </Card>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="primary" onClick={save}>Save preferences</Button>
        <Button variant="ghost" onClick={reset}>Reset to defaults</Button>
        {savedAt && <span style={{ color: '#5b8b6f', fontSize: 14 }}>✓ Saved</span>}
      </div>
    </main>
  );
}
