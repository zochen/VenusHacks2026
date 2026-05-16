// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: extension — full preferences page
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 2): full Preferences editor (mirror of /candidate/profile on web)
// TODO(Person 2): sign-out clears chrome.storage session token
// TODO(Person 2): import/export preferences as JSON for debugging

const WEB_URL = 'http://localhost:3000';

export function Options() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#2a2d33',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 28 }}>🌿</span>
        <div>
    <h1 style={{ margin: 0, fontSize: 24 }}>CapyConnect settings</h1>
          <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: 13 }}>Starter build — full editor coming soon.</p>
        </div>
      </header>

      <section
        style={{
          padding: 20,
          border: '1px solid #e1e5dd',
          borderRadius: 14,
          background: '#fff',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 16 }}>Sync from the web app</h2>
        <p style={{ margin: '0 0 12px', color: '#6b7280', fontSize: 14, lineHeight: 1.5 }}>
          Your communication-style preferences live on your CapyConnect web profile. The extension reads them once
          you're signed in. For now, manage them on the web:
        </p>
        <a
          href={`${WEB_URL}/candidate/profile`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 16px',
            background: '#5b8b6f',
            color: '#fff',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Edit on web →
        </a>
      </section>

      <section
        style={{
          padding: 20,
          border: '1px dashed #e1e5dd',
          borderRadius: 14,
          color: '#6b7280',
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <strong style={{ display: 'block', color: '#2a2d33', marginBottom: 4 }}>What lives here later</strong>
        Account info, sign-out, import/export of preferences as JSON, and per-call overlay tweaks.
      </section>
    </main>
  );
}

export default Options;
