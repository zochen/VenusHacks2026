// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: extension — toolbar popup
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 2): read auth token from chrome.storage and show signed-in state
// TODO(Person 2): list active features pulled from chrome.storage preferences
// TODO(Person 2): swap WEB_URL constant for prod URL once deployed

const WEB_URL = 'http://localhost:3000';
const SUPPORTED_HOSTS = ['meet.google.com', 'zoom.us', 'teams.microsoft.com'];

export function Popup() {
  const [activeHost, setActiveHost] = React.useState<string | null>(null);
  const [hostSupported, setHostSupported] = React.useState(false);

  React.useEffect(() => {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url;
      if (!url) return;
      try {
        const u = new URL(url);
        setActiveHost(u.hostname);
        setHostSupported(SUPPORTED_HOSTS.some((h) => u.hostname.endsWith(h)));
      } catch {}
    });
  }, []);

  function openWeb(path: string) {
    chrome.tabs?.create({ url: `${WEB_URL}${path}` });
  }

  function openOptions() {
    chrome.runtime?.openOptionsPage?.();
  }

  return (
    <main style={{ width: 320, fontFamily: 'system-ui, -apple-system, sans-serif', color: '#2a2d33' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #f4f8f5 0%, #fff 100%)',
          borderBottom: '1px solid #e1e5dd',
        }}
      >
        <span style={{ fontSize: 22 }}>🌿</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>QuietSpace</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Accessibility overlay for interviews</div>
        </div>
      </header>

      <section style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Active-tab status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: hostSupported ? '#e3efe7' : '#fef3e7',
            borderRadius: 12,
            fontSize: 13,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: hostSupported ? '#5b8b6f' : '#e0b072',
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, color: hostSupported ? '#3d6a51' : '#8a5a18' }}>
              {hostSupported ? 'Overlay active on this tab' : 'Not on a supported call'}
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeHost ?? 'Open a tab to check'}
            </div>
          </div>
        </div>

        {/* Auth placeholder */}
        <div
          style={{
            padding: 12,
            border: '1px dashed #e1e5dd',
            borderRadius: 12,
            fontSize: 12,
            color: '#6b7280',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ display: 'block', color: '#2a2d33', marginBottom: 4 }}>Not signed in</strong>
          Sign in on the QuietSpace web app to sync your communication-style preferences here.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => openWeb('/candidate/dashboard')}
            style={primaryButtonStyle}
          >
            Open my dashboard
          </button>
          <button
            type="button"
            onClick={() => openWeb('/onboarding')}
            style={secondaryButtonStyle}
          >
            Sign in / onboard →
          </button>
          <button type="button" onClick={openOptions} style={ghostButtonStyle}>
            Settings
          </button>
        </div>

        {/* Supported hosts */}
        <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', paddingTop: 4 }}>
          Works on Google Meet, Zoom, and Microsoft Teams.
        </div>
      </section>

      <footer
        style={{
          padding: '8px 16px',
          background: '#fafafa',
          borderTop: '1px solid #e1e5dd',
          fontSize: 10,
          color: '#6b7280',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Starter build</span>
        <span>v0.0.1</span>
      </footer>
    </main>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: '#5b8b6f',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: '#fff',
  color: '#2a2d33',
  border: '1px solid #e1e5dd',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 13,
};

const ghostButtonStyle: React.CSSProperties = {
  padding: '8px 14px',
  background: 'transparent',
  color: '#6b7280',
  border: 'none',
  cursor: 'pointer',
  fontSize: 12,
};

export default Popup;
