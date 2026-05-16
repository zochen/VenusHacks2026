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
  const [demoStatus, setDemoStatus] = React.useState<string | null>(null);

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

  async function startCaptionDemo() {
    setDemoStatus('Injecting overlay…');
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setDemoStatus('No active tab.');
        return;
      }
      if (tab.url && /^(chrome|edge|about|chrome-extension):/i.test(tab.url)) {
        setDemoStatus('Cannot inject on browser pages. Open any normal site.');
        return;
      }
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectCaptionDemo,
      });
      setDemoStatus('Overlay added — grant mic permission on the page.');
    } catch (e: any) {
      setDemoStatus(`Failed: ${e?.message ?? e}`);
    }
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
          <div style={{ fontWeight: 700, fontSize: 15 }}>CapyConnect</div>
          <div style={{ fontSize: 11, color: '#56778d' }}>Accessibility overlay for interviews</div>
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
              background: hostSupported ? '#eaf6ff' : '#fef7ec',
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
              <div style={{ fontWeight: 600, color: hostSupported ? '#2b6ea3' : '#8a5a18' }}>
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
          Sign in on the CapyConnect web app to sync your communication-style preferences here.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={startCaptionDemo}
            title="Inject a live caption overlay onto the current tab"
            style={primaryButtonStyle}
          >
            🎙 Start caption demo
          </button>
          {demoStatus && (
            <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>{demoStatus}</div>
          )}
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

// Runs in the page (via chrome.scripting.executeScript). Must be self-contained.
function injectCaptionDemo() {
  const HOST_ID = 'quietspace-demo-overlay';
  const existing = document.getElementById(HOST_ID);
  if (existing) {
    existing.remove();
    return;
  }
  const Ctor: any =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) {
    alert('Web Speech API not supported in this browser.');
    return;
  }

  const host = document.createElement('div');
  host.id = HOST_ID;
  host.style.cssText =
    'position:fixed;right:20px;bottom:20px;width:340px;background:#fff;border:1px solid #e1e5dd;border-radius:16px;box-shadow:0 12px 32px rgba(20,30,25,.18);font:14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#2a2d33;z-index:2147483647;overflow:hidden;';
  host.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#f4f8f5,#fff);border-bottom:1px solid #e1e5dd;">
      <span style="font-weight:700;">🌿 QuietSpace · Captions</span>
      <button id="qs-demo-close" style="background:transparent;border:none;cursor:pointer;font-size:18px;color:#6b7280;">×</button>
    </div>
    <div id="qs-demo-status" style="padding:6px 14px;font-size:11px;color:#6b7280;">Click "Start" and allow microphone access.</div>
    <div id="qs-demo-captions" aria-live="polite" style="margin:8px 14px;padding:12px 14px;min-height:64px;background:rgba(20,30,25,.85);color:#fff;border-radius:10px;font-size:16px;line-height:1.4;">Waiting for speech…</div>
    <div style="margin:8px 14px;">
      <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:4px;">
        <span>Detected questions</span>
        <span id="qs-demo-qcount" style="background:#e3efe7;color:#3d6a51;padding:1px 8px;border-radius:999px;font-size:10px;">0</span>
      </div>
      <ul id="qs-demo-questions" style="margin:0;padding:0;list-style:none;max-height:120px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;font-size:13px;color:#2a2d33;"></ul>
    </div>
    <div style="padding:10px 14px;display:flex;gap:8px;border-top:1px solid #e1e5dd;background:#fafafa;">
      <button id="qs-demo-start" style="flex:1;padding:8px 12px;background:#5b8b6f;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;">🎙 Start</button>
      <button id="qs-demo-stop" style="flex:1;padding:8px 12px;background:#c45c5c;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;" disabled>■ Stop</button>
    </div>
  `;
  document.body.appendChild(host);

  const status = host.querySelector('#qs-demo-status') as HTMLDivElement;
  const captions = host.querySelector('#qs-demo-captions') as HTMLDivElement;
  const startBtn = host.querySelector('#qs-demo-start') as HTMLButtonElement;
  const stopBtn = host.querySelector('#qs-demo-stop') as HTMLButtonElement;
  const closeBtn = host.querySelector('#qs-demo-close') as HTMLButtonElement;
  const qList = host.querySelector('#qs-demo-questions') as HTMLUListElement;
  const qCount = host.querySelector('#qs-demo-qcount') as HTMLSpanElement;

  const QUESTION_WORDS = [
    'who', 'what', 'where', 'when', 'why', 'how', 'which', 'whose',
    'can', 'could', 'would', 'should', 'will', 'do', 'does', 'did',
    'is', 'are', 'was', 'were', 'have', 'has', 'had', 'may', 'might',
    'tell me', 'walk me', 'explain', 'describe',
  ];

  function isQuestion(text: string): boolean {
    const t = text.trim().toLowerCase();
    if (!t) return false;
    if (t.endsWith('?')) return true;
    const firstTwo = t.split(/\s+/).slice(0, 2).join(' ');
    return QUESTION_WORDS.some((w) => firstTwo === w || firstTwo.startsWith(w + ' '));
  }

  function splitSentences(text: string): string[] {
    return text
      .split(/(?<=[.?!])\s+|(?<=\?)/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const seen = new Set<string>();
  let questionCount = 0;

  function recordQuestion(q: string) {
    const key = q.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    questionCount++;
    qCount.textContent = String(questionCount);
    const li = document.createElement('li');
    li.style.cssText =
      'padding:6px 10px;background:#f4f8f5;border-left:3px solid #5b8b6f;border-radius:6px;line-height:1.35;';
    li.textContent = q.endsWith('?') ? q : q + '?';
    qList.prepend(li);
    // Subtle flash
    host.animate(
      [{ boxShadow: '0 0 0 3px #5b8b6f' }, { boxShadow: '0 12px 32px rgba(20,30,25,.18)' }],
      { duration: 600 },
    );
  }

  let rec: any = null;
  let manuallyStopped = false;

  function start() {
    if (rec) return;
    rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => {
      status.textContent = 'Listening…';
      startBtn.disabled = true;
      stopBtn.disabled = false;
    };
    rec.onresult = (ev: any) => {
      let text = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        text += r[0].transcript;
        if (r.isFinal) {
          for (const sentence of splitSentences(r[0].transcript)) {
            if (isQuestion(sentence)) recordQuestion(sentence);
          }
        }
      }
      if (text.trim()) captions.textContent = text;
    };
    rec.onerror = (ev: any) => {
      status.textContent = `Error: ${ev.error}`;
    };
    rec.onend = () => {
      const wasManual = manuallyStopped;
      rec = null;
      if (wasManual) {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        status.textContent = 'Stopped.';
        manuallyStopped = false;
        return;
      }
      // Chrome ends recognition after silence or after a final result.
      // Restart with a short delay to avoid InvalidStateError.
      status.textContent = 'Restarting…';
      window.setTimeout(() => {
        if (!manuallyStopped) start();
      }, 250);
    };
    try {
      rec.start();
    } catch (e: any) {
      // InvalidStateError can fire if a previous instance hasn't fully torn down — retry once.
      status.textContent = `Retrying… (${e?.message ?? e})`;
      rec = null;
      window.setTimeout(() => {
        if (!manuallyStopped) start();
      }, 400);
    }
  }

  function stop() {
    if (!rec) return;
    manuallyStopped = true;
    rec.stop();
  }

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
  closeBtn.addEventListener('click', () => {
    stop();
    host.remove();
  });
}
