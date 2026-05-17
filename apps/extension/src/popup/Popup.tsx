// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: extension — toolbar popup
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 2): read auth token from chrome.storage and show signed-in state
// TODO(Person 2): list active features pulled from chrome.storage preferences
// TODO(Person 2): swap WEB_URL constant for prod URL once deployed

const WEB_URL = 'http://localhost:3000';
const SUPPORTED_HOSTS = ['meet.google.com', 'zoom.us', 'teams.microsoft.com'];
const DEFAULT_RELAY_URL = 'ws://localhost:8787';

type Role = 'interviewer' | 'candidate';

const PRESET_QUESTIONS: { id: string; text: string }[] = [
  { id: 'q1', text: "Tell me about a project you're proud of." },
  { id: 'q2', text: 'Describe a challenging bug you encountered.' },
  { id: 'q3', text: 'How do you approach debugging in an unfamiliar codebase?' },
  { id: 'q4', text: 'Tell me about a time you worked on a team project.' },
  { id: 'q5', text: 'Walk me through how you would design a URL shortener.' },
];

export function Popup() {
  const [activeHost, setActiveHost] = React.useState<string | null>(null);
  const [hostSupported, setHostSupported] = React.useState(false);
  const [demoStatus, setDemoStatus] = React.useState<string | null>(null);
  const [roomCode, setRoomCode] = React.useState('');
  const [relayUrl, setRelayUrl] = React.useState(DEFAULT_RELAY_URL);
  const [role, setRole] = React.useState<Role | null>(null);
  const [relayState, setRelayState] = React.useState<'idle' | 'connecting' | 'open' | 'closed' | 'error'>('idle');
  const [sentQuestion, setSentQuestion] = React.useState<string | null>(null);
  const [showMascot, setShowMascot] = React.useState(true);
  const wsRef = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    chrome.storage?.local?.get(['capyRoom', 'capyRelayUrl', 'capyRole', 'capyShowMascot'], (v) => {
      if (v.capyRoom) setRoomCode(String(v.capyRoom));
      if (v.capyRelayUrl) setRelayUrl(String(v.capyRelayUrl));
      if (v.capyRole === 'interviewer' || v.capyRole === 'candidate') setRole(v.capyRole);
      if (typeof v.capyShowMascot === 'boolean') setShowMascot(v.capyShowMascot);
    });
  }, []);

  function saveRole(next: Role) {
    setRole(next);
    chrome.storage?.local?.set({ capyRole: next });
  }

  // Interviewer: maintain a WebSocket to the relay so questions can be pushed
  // directly from the popup (no overlay injection required on this side).
  React.useEffect(() => {
    if (role !== 'interviewer' || !roomCode || !relayUrl) {
      wsRef.current?.close();
      wsRef.current = null;
      setRelayState('idle');
      return;
    }
    setRelayState('connecting');
    const id = Math.random().toString(36).slice(2, 10);
    const url = `${relayUrl}/?room=${encodeURIComponent(roomCode)}&id=${encodeURIComponent(id)}`;
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      setRelayState('error');
      return;
    }
    wsRef.current = ws;
    ws.addEventListener('open', () => setRelayState('open'));
    ws.addEventListener('close', () => setRelayState('closed'));
    ws.addEventListener('error', () => setRelayState('error'));
    return () => {
      ws.close();
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, [role, roomCode, relayUrl]);

  function relaySend(payload: any) {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setSentQuestion('Not connected to relay yet.');
      return false;
    }
    ws.send(JSON.stringify(payload));
    return true;
  }

  async function toggleMascot(next: boolean) {
    setShowMascot(next);
    chrome.storage?.local?.set({ capyShowMascot: next });
  }

  function sendTopic(text: string) {
    if (relaySend({ type: 'topic', text })) setSentQuestion(`Topic: ${text}`);
  }

  function sendFollowUp(text: string) {
    if (relaySend({ type: 'followup', text })) setSentQuestion(`Follow-up: ${text}`);
  }

  function saveRoom(code: string) {
    const norm = code.trim().toUpperCase().slice(0, 8);
    setRoomCode(norm);
    chrome.storage?.local?.set({ capyRoom: norm });
  }

  function saveRelay(url: string) {
    setRelayUrl(url);
    chrome.storage?.local?.set({ capyRelayUrl: url });
  }

  function generateRoom() {
    const code = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    saveRoom(code || 'CAPY01');
  }

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
    setDemoStatus('Injecting overlay...');
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) {
        setDemoStatus('No active tab available for overlay injection.');
        return;
      }
      chrome.scripting?.executeScript(
        {
          target: { tabId },
          func: injectCaptionDemo,
          args: [
            {
              room: roomCode || null,
              relayUrl: relayUrl || null,
              role: role ?? undefined,
              presets: role === 'interviewer' ? PRESET_QUESTIONS.map((q) => ({ text: q.text })) : undefined,
              mascotUrl: chrome.runtime?.getURL('CapyConnect_avatar.png'),
              showMascot,
            },
          ],
        },
        () => {
          const err = chrome.runtime?.lastError;
          if (err) {
            setDemoStatus(`Overlay injection failed: ${err.message}`);
          } else {
            setDemoStatus('Overlay injection enabled.');
          }
        }
      );
    });
  }

  return (
    <main style={{ width: 320, fontFamily: 'system-ui, -apple-system, sans-serif', color: '#2a2d33' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #eaf6f8 0%, #fff 100%)',
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
        {/* Role selector */}
        <div style={{ display: 'flex', gap: 6, background: '#eaf6f8', padding: 4, borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => saveRole('interviewer')}
            style={role === 'interviewer' ? roleActiveStyle : roleInactiveStyle}
          >
            👔 Interviewer
          </button>
          <button
            type="button"
            onClick={() => saveRole('candidate')}
            style={role === 'candidate' ? roleActiveStyle : roleInactiveStyle}
          >
            🧑‍💻 Candidate
          </button>
        </div>
        {role === null && (
          <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
            Pick a role to continue.
          </div>
        )}

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
              background: hostSupported ? '#20576C' : '#e0b072',
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 600, color: hostSupported ? '#2b6ea3' : '#8a5a18' }}>
              {hostSupported ? 'Supported site' : 'Not on a supported call'}
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

        {/* Room pairing */}
        <div
          style={{
            padding: 10,
            background: '#f7fbff',
            border: '1px solid #d6e4f0',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <label style={{ fontSize: 11, fontWeight: 600, color: '#2b6ea3' }}>
            Pair with another device
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={roomCode}
              onChange={(e) => saveRoom(e.target.value)}
              placeholder="Room code"
              style={{
                flex: 1,
                padding: '6px 10px',
                border: '1px solid #d6e4f0',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: 'inherit',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            />
            <button
              type="button"
              onClick={generateRoom}
              title="Generate a random code"
              style={{ ...secondaryButtonStyle, padding: '6px 10px', fontSize: 11 }}
            >
              ⟳
            </button>
          </div>
          <input
            value={relayUrl}
            onChange={(e) => saveRelay(e.target.value)}
            placeholder="Relay URL (ws://…)"
            style={{
              padding: '4px 8px',
              border: '1px solid #d6e4f0',
              borderRadius: 6,
              fontSize: 11,
              fontFamily: 'inherit',
              color: '#56778d',
            }}
          />
          <div style={{ fontSize: 10, color: '#6b7280' }}>
            Both devices need the same code. Default relay runs at localhost:8787.
          </div>
        </div>

        {/* Interviewer: preset question picker */}
        {role === 'interviewer' && (
          <div
            style={{
              padding: 10,
              border: '1px solid #e1e5dd',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 12, color: '#2a2d33' }}>Preset questions</strong>
              <span style={{ fontSize: 10, color: relayStatusColor(relayState) }}>
                {relayStatusLabel(relayState, roomCode)}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280, overflowY: 'auto' }}>
              {PRESET_QUESTIONS.map((q) => {
                const ready = relayState === 'open';
                return (
                  <button
                    key={q.id}
                    type="button"
                    disabled={!ready}
                    onClick={() => sendTopic(q.text)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      background: '#f7fbff',
                      border: '1px solid #d6e4f0',
                      borderRadius: 8,
                      cursor: ready ? 'pointer' : 'not-allowed',
                      fontSize: 12,
                      color: '#2a2d33',
                      lineHeight: 1.35,
                      opacity: ready ? 1 : 0.55,
                      fontWeight: 600,
                    }}
                  >
                    {q.text}
                  </button>
                );
              })}
            </div>
            {sentQuestion && (
              <div style={{ fontSize: 11, color: '#20576C' }}>
                ✓ Sent: <em>{sentQuestion}</em>
              </div>
            )}
            <div style={{ fontSize: 10, color: '#6b7280' }}>
              Questions appear on the candidate's overlay in real time.
            </div>
            <div style={{ borderTop: '1px dashed #d6e4f0', paddingTop: 8, marginTop: 4 }}>
              <button
                type="button"
                onClick={startCaptionDemo}
                title="Inject mic overlay on this tab so spoken questions auto-forward to the candidate"
                style={primaryButtonStyle}
              >
                🎙 Start mic (auto-detect questions)
              </button>
              {demoStatus && (
                <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 6 }}>
                  {demoStatus}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Candidate actions */}
        {role === 'candidate' && (
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
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#eaf6f8', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#2a2d33' }}>
              <span>🐹 Show Capy mascot</span>
              <span
                role="switch"
                aria-checked={showMascot}
                onClick={() => toggleMascot(!showMascot)}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: 36,
                  height: 20,
                  background: showMascot ? '#68C5DC' : '#cbd5d6',
                  borderRadius: 999,
                  transition: 'background .15s',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 2,
                  left: showMascot ? 18 : 2,
                  width: 16,
                  height: 16,
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left .15s',
                  boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                }} />
              </span>
            </label>
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
          </div>
        )}

        <button type="button" onClick={openOptions} style={ghostButtonStyle}>
          Settings
        </button>

      </section>
    </main>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: '#20576C',
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

const roleActiveStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 10px',
  background: '#20576C',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 12,
};

const roleInactiveStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 10px',
  background: 'transparent',
  color: '#56778d',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 12,
};

function relayStatusLabel(state: string, room: string) {
  if (!room) return 'set a room code';
  if (state === 'open') return `● live · ${room}`;
  if (state === 'connecting') return 'connecting…';
  if (state === 'closed') return 'disconnected';
  if (state === 'error') return 'relay error';
  return '—';
}

function relayStatusColor(state: string) {
  if (state === 'open') return '#20576C';
  if (state === 'error') return '#c45c5c';
  if (state === 'connecting') return '#e0b072';
  return '#6b7280';
}

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
function injectCaptionDemo(opts: { room: string | null; relayUrl: string | null; role?: 'interviewer' | 'candidate'; presets?: { text: string }[]; mascotUrl?: string; showMascot?: boolean }) {
  const HOST_ID = 'quietspace-demo-overlay';
  const QHOST_ID = 'quietspace-demo-questions';
  const existing = document.getElementById(HOST_ID);
  const existingQ = document.getElementById(QHOST_ID);
  // Legacy banner from older versions — remove if present.
  document.getElementById('quietspace-demo-current')?.remove();
  if (existing || existingQ) {
    existing?.remove();
    existingQ?.remove();
    document.getElementById('quietspace-demo-mascot')?.remove();
    document.getElementById('quietspace-demo-mascot-tab')?.remove();
    document.getElementById('quietspace-demo-mascot-style')?.remove();
    document.getElementById('quietspace-demo-blur')?.remove();
    document.getElementById('quietspace-demo-blur-btn')?.remove();
    document.querySelectorAll('.quietspace-demo-blur-rect').forEach((el) => el.remove());
    document.getElementById('quietspace-demo-pause-popup')?.remove();
    (window as any).__capyRelaySocket?.close?.();
    (window as any).__capyRelaySocket = null;
    return;
  }
  function makeDraggable(el: HTMLElement, handle: HTMLElement) {
    handle.style.cursor = 'move';
    let dragging = false;
    let startX = 0, startY = 0, originLeft = 0, originTop = 0;
    handle.addEventListener('mousedown', (e) => {
      // Ignore drags that begin on interactive children (buttons, inputs).
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, a, select')) return;
      dragging = true;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      // Convert any right/bottom positioning to left/top once.
      el.style.left = rect.left + 'px';
      el.style.top = rect.top + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      startX = e.clientX;
      startY = e.clientY;
      originLeft = rect.left;
      originTop = rect.top;
      document.body.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;
      el.style.left = Math.max(0, Math.min(maxX, originLeft + dx)) + 'px';
      el.style.top = Math.max(0, Math.min(maxY, originTop + dy)) + 'px';
    });
    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = '';
    });
  }

  const room = opts?.room || null;
  const relayUrl = opts?.relayUrl || 'ws://localhost:8787';
  const role = opts?.role === 'interviewer' ? 'interviewer' : 'candidate';
  const clientId =
    (crypto as any).randomUUID?.() ?? Math.random().toString(36).slice(2);
  const Ctor: any =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) {
    alert('Web Speech API not supported in this browser.');
    return;
  }

  const host = document.createElement('div');
  host.id = HOST_ID;
  host.style.cssText =
    "position:fixed;right:20px;bottom:20px;width:340px;background:rgba(32,87,108,0.85);border:3px solid #68C5DC;border-radius:10px;box-shadow:0 16px 40px rgba(20,30,25,.35);font-family:'Outfit',system-ui,sans-serif;color:#fff !important;z-index:2147483647;overflow:hidden;backdrop-filter:blur(6px);display:flex;flex-direction:column;";
  host.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid rgba(104,197,220,.4);">
      <div>
        <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:14px;letter-spacing:.5px;text-transform:uppercase;color:#cdeefa;">${role === 'interviewer' ? 'Interviewer mic' : 'Captions'}</div>
        <div id="qs-demo-room" style="font-size:10px;color:rgba(255,255,255,.65);margin-top:2px;"></div>
      </div>
      <button id="qs-demo-close" style="background:transparent;border:none;cursor:pointer;font-size:20px;color:#cdeefa;line-height:1;">×</button>
    </div>
    <div id="qs-demo-status" style="display:none;"></div>
    <div id="qs-demo-captions" aria-live="polite" style="margin:12px 18px;padding:12px 14px;min-height:64px;background:rgba(20,30,25,.55);color:#fff !important;border-radius:10px;font-size:16px;line-height:1.4;font-family:'Outfit',sans-serif;">Click "Start" and allow microphone access.</div>
    <div style="padding:10px 18px;display:flex;gap:8px;border-top:1px solid rgba(104,197,220,.25);">
      <button id="qs-demo-toggle" style="flex:1;padding:8px 12px;background:#68C5DC;color:#20576C !important;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-family:'Outfit',sans-serif;">🎙 Start</button>
      ${role === 'candidate' ? `<button id="qs-demo-pause" title="Ask for a thinking pause" style="flex:1;padding:8px 12px;background:#AFF0FF;color:#20576C !important;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-family:'Outfit',sans-serif;">⏸ Thinking pause</button>` : ''}
    </div>
    <div style="padding:10px 18px 14px;display:flex;gap:6px;border-top:1px solid rgba(104,197,220,.25);">
      <input id="qs-demo-text" type="text" placeholder="Type to text caption..." style="flex:1;padding:8px 12px;border:none;border-radius:10px;font:13px 'Outfit',system-ui,sans-serif;outline:none;background:rgba(20,30,25,.55);color:#fff;" />
      <button id="qs-demo-send-cap" title="Send as caption" style="padding:6px 10px;background:#68C5DC;color:#20576C !important;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;">💬</button>
      <button id="qs-demo-send-q" title="Send as question" style="padding:6px 10px;background:#AFF0FF;color:#20576C !important;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;">❓</button>
    </div>
  `;
  document.body.appendChild(host);
  // Drag the captions panel by its header row.
  const hostHeader = host.firstElementChild as HTMLElement | null;
  if (hostHeader) makeDraggable(host, hostHeader);

  if (!document.getElementById('qs-demo-host-style')) {
    const s = document.createElement('style');
    s.id = 'qs-demo-host-style';
    s.textContent =
      '#qs-demo-text::placeholder { color: rgba(255,255,255,0.85); opacity: 1; }';
    document.head.appendChild(s);
  }

  // Eye button — toggle "draw a blur rectangle" mode.
  const blurBtn = document.createElement('button');
  blurBtn.id = 'quietspace-demo-blur-btn';
  blurBtn.type = 'button';
  blurBtn.title = 'Drag on the page to blur an area';
  blurBtn.style.cssText =
    'position:fixed;right:380px;bottom:20px;width:89px;height:89px;background:#AFF0FF;border:none;border-radius:100px;box-shadow:0 8px 20px rgba(20,30,25,.18);cursor:pointer;z-index:2147483647;transition:transform .15s ease-out, background .2s;padding:0;';
  const EYE_WRAP = (inner: string) =>
    `<span style="position:absolute;width:54px;height:54px;left:calc(50% - 27px);top:calc(50% - 27px);display:block;">${inner}</span>`;
  const EYE_OPEN_SVG = EYE_WRAP(`
    <svg width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#34748D" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5Z"/>
    </svg>
  `);
  const EYE_CLOSED_SVG = EYE_WRAP(`
    <svg width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#34748D" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7Z"/>
    </svg>
  `);
  blurBtn.innerHTML = EYE_CLOSED_SVG;
  document.body.appendChild(blurBtn);

  // Full-page capture overlay shown only while in draw-blur mode.
  const drawOverlay = document.createElement('div');
  drawOverlay.id = 'quietspace-demo-blur';
  drawOverlay.style.cssText =
    'position:fixed;inset:0;cursor:crosshair;z-index:2147483646;display:none;background:rgba(52,116,141,0.06);';
  const hint = document.createElement('div');
  hint.textContent = 'Drag to blur an area · Esc to cancel';
  hint.style.cssText =
    "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#34748D;color:#fff;padding:8px 16px;border-radius:999px;font:600 13px 'Outfit',system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25);pointer-events:none;";
  drawOverlay.appendChild(hint);
  document.body.appendChild(drawOverlay);

  let drawMode = false;
  let previewRect: HTMLDivElement | null = null;
  let startX = 0, startY = 0;

  function setBtnActive(active: boolean) {
    blurBtn.style.background = active ? '#34748D' : '#AFF0FF';
    blurBtn.innerHTML = active ? EYE_OPEN_SVG : EYE_CLOSED_SVG;
    const p = blurBtn.querySelector('path');
    if (p) p.setAttribute('fill', active ? '#AFF0FF' : '#34748D');
  }
  function enterDrawMode() {
    drawMode = true;
    drawOverlay.style.display = 'block';
    setBtnActive(true);
  }
  function exitDrawMode() {
    drawMode = false;
    drawOverlay.style.display = 'none';
    setBtnActive(false);
    if (previewRect) { previewRect.remove(); previewRect = null; }
  }

  blurBtn.addEventListener('click', () => {
    if (drawMode) exitDrawMode(); else enterDrawMode();
  });
  blurBtn.addEventListener('mouseenter', () => { blurBtn.style.transform = 'scale(1.06)'; });
  blurBtn.addEventListener('mouseleave', () => { blurBtn.style.transform = 'scale(1)'; });

  drawOverlay.addEventListener('mousedown', (e) => {
    startX = e.clientX; startY = e.clientY;
    previewRect = document.createElement('div');
    previewRect.style.cssText =
      `position:fixed;left:${startX}px;top:${startY}px;width:0;height:0;border:2px dashed #34748D;background:rgba(175,240,255,0.18);z-index:2147483646;pointer-events:none;border-radius:6px;`;
    document.body.appendChild(previewRect);
  });
  drawOverlay.addEventListener('mousemove', (e) => {
    if (!previewRect) return;
    const x = Math.min(startX, e.clientX);
    const y = Math.min(startY, e.clientY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    previewRect.style.left = x + 'px';
    previewRect.style.top = y + 'px';
    previewRect.style.width = w + 'px';
    previewRect.style.height = h + 'px';
  });
  drawOverlay.addEventListener('mouseup', () => {
    if (!previewRect) return;
    const r = previewRect.getBoundingClientRect();
    previewRect.remove();
    previewRect = null;
    if (r.width < 12 || r.height < 12) { exitDrawMode(); return; }

    const blurBox = document.createElement('div');
    blurBox.className = 'quietspace-demo-blur-rect';
    blurBox.style.cssText =
      `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(255,255,255,0.04);z-index:2147483640;border-radius:8px;box-shadow:0 0 0 1px rgba(52,116,141,0.3);pointer-events:none;`;
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '×';
    close.title = 'Remove blur';
    close.style.cssText =
      'position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;background:#34748D;color:#fff;border:none;cursor:pointer;font-size:16px;line-height:1;pointer-events:auto;display:flex;align-items:center;justify-content:center;';
    close.addEventListener('click', () => blurBox.remove());
    blurBox.appendChild(close);
    document.body.appendChild(blurBox);
    exitDrawMode();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawMode) exitDrawMode();
  });

  // Load Outfit once for the panel theme.
  if (!document.getElementById('qs-poppins-link')) {
    const link = document.createElement('link');
    link.id = 'qs-poppins-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&display=swap';
    document.head.appendChild(link);
  }

  // Separate top-right panel for detected questions.
  const qHost = document.createElement('div');
  qHost.id = QHOST_ID;
  const panelTitle = role === 'interviewer' ? 'Question board' : 'Topic';
  const panelHint = role === 'interviewer'
    ? 'Pick a preset topic to begin…'
    : 'Waiting for the interviewer to ask a question…';
  qHost.style.cssText =
    "position:fixed;top:20px;right:20px;width:379px;max-height:80vh;background:rgba(32,87,108,0.85);border:3px solid #68C5DC;border-radius:10px;box-shadow:0 16px 40px rgba(20,30,25,.35);font-family:'Outfit',system-ui,sans-serif;color:#fff !important;z-index:2147483647;overflow:hidden;display:flex;flex-direction:column;backdrop-filter:blur(6px);";
  qHost.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid rgba(104,197,220,.4);">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:'Outfit',sans-serif;font-weight:700;font-size:14px;letter-spacing:.5px;text-transform:uppercase;color:#cdeefa;">${panelTitle}</span>
      </div>
      <button id="qs-demo-qclose" style="background:transparent;border:none;cursor:pointer;font-size:20px;color:#cdeefa;line-height:1;">×</button>
    </div>
    <div id="qs-demo-topics" style="margin:0;padding:16px 22px 22px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;flex:1;">
      <div id="qs-demo-qempty" style="color:rgba(255,255,255,.7);font-style:italic;font-size:14px;font-family:'Outfit',sans-serif;">${panelHint}</div>
    </div>
  `;
  document.body.appendChild(qHost);
  // Drag the question board by its header row.
  const qHostHeader = qHost.firstElementChild as HTMLElement | null;
  if (qHostHeader) makeDraggable(qHost, qHostHeader);

  const status = host.querySelector('#qs-demo-status') as HTMLDivElement;
  const captions = host.querySelector('#qs-demo-captions') as HTMLDivElement;
  const toggleBtn = host.querySelector('#qs-demo-toggle') as HTMLButtonElement;
  const pauseBtn = host.querySelector('#qs-demo-pause') as HTMLButtonElement | null;
  if (pauseBtn) {
    let lastSent = 0;
    pauseBtn.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastSent < 1500) return; // debounce double-clicks
      lastSent = now;
      send({ type: 'signal', kind: 'pause', label: 'The candidate is asking for a moment to think.' });
      const original = pauseBtn.textContent;
      pauseBtn.textContent = '✓ Sent';
      pauseBtn.disabled = true;
      window.setTimeout(() => {
        pauseBtn.textContent = original;
        pauseBtn.disabled = false;
      }, 1500);
    });
  }
  function setToggleListening(listening: boolean) {
    toggleBtn.textContent = listening ? '■ Stop' : '🎙 Start';
    toggleBtn.style.background = listening ? '#20576C' : '#68C5DC';
    toggleBtn.style.color = listening ? '#fff' : '#20576C';
  }
  captions.style.transition = 'box-shadow 220ms ease-out';
  let glowTimer = 0;
  function pulseCaptions() {
    captions.style.boxShadow = '0 0 0 3px rgba(104,197,220,0.65), 0 0 18px 4px rgba(104,197,220,0.55)';
    window.clearTimeout(glowTimer);
    glowTimer = window.setTimeout(() => {
      captions.style.boxShadow = 'none';
    }, 350);
  }
  const closeBtn = host.querySelector('#qs-demo-close') as HTMLButtonElement;
  const qTopics = qHost.querySelector('#qs-demo-topics') as HTMLDivElement;
  const qCount = { textContent: '' } as { textContent: string };
  const qClose = qHost.querySelector('#qs-demo-qclose') as HTMLButtonElement;
  const qEmpty = qHost.querySelector('#qs-demo-qempty') as HTMLDivElement;
  const roomLabel = host.querySelector('#qs-demo-room') as HTMLDivElement;

  // ===== Relay (WebSocket room sync) =====
  let ws: WebSocket | null = null;
  let lastSentCaption = '';
  let lastCaptionAt = 0;

  function connectRelay() {
    if (!room || !relayUrl) {
      roomLabel.textContent = 'No room set (solo mode)';
      return;
    }
    const url = `${relayUrl}/?room=${encodeURIComponent(room)}&id=${encodeURIComponent(clientId)}`;
    roomLabel.textContent = `Connecting to room ${room}…`;
    try {
      ws = new WebSocket(url);
    } catch (e: any) {
      roomLabel.textContent = `Relay error: ${e?.message ?? e}`;
      return;
    }
    (window as any).__capyRelaySocket = ws;
    ws.addEventListener('open', () => {
      roomLabel.textContent = `Connected · room ${room}`;
    });
    ws.addEventListener('close', () => {
      roomLabel.textContent = `Disconnected · room ${room}`;
    });
    ws.addEventListener('error', () => {
      roomLabel.textContent = `Relay error · room ${room}`;
    });
    ws.addEventListener('message', (ev) => {
      let msg: any;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (!msg || msg.__from === clientId) return;
      if (msg.type === '__presence') {
        roomLabel.textContent = `Connected · room ${room} · ${msg.peers} online`;
        return;
      }
      if (msg.type === 'topic') {
        const text = String(msg.text ?? '');
        startTopic(text);
      } else if (msg.type === 'followup' || msg.type === 'question') {
        const text = String(msg.text ?? '');
        addFollowUp(text);
      } else if (msg.type === 'caption') {
        renderRemoteCaption(String(msg.text ?? ''));
      } else if (msg.type === 'interview') {
        renderInterviewState(msg.payload);
      } else if (msg.type === 'signal') {
        const kind = String(msg.kind ?? 'note');
        const label = String(msg.label ?? '');
        if (kind === 'pause' && role === 'interviewer') showPauseRequest(label);
        else flashSignal(kind, label);
      }
    });
  }

  function send(payload: any) {
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
  }

  function renderRemoteCaption(text: string) {
    if (!text.trim()) return;
    captions.textContent = `🛰 ${text}`;
    captions.style.background = 'rgba(43, 110, 163, 0.85)';
    window.setTimeout(() => (captions.style.background = 'rgba(20,30,25,.85)'), 1500);
  }

  function renderInterviewState(payload: any) {
    if (!payload?.currentQuestion) return;
    startTopic(String(payload.currentQuestion));
  }

  function showPauseRequest(_label: string) {
    document.getElementById('quietspace-demo-pause-popup')?.remove();
    const modal = document.createElement('div');
    modal.id = 'quietspace-demo-pause-popup';
    modal.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:395px;height:396px;background:rgba(52,116,141,0.7);border-radius:10px;box-shadow:0 16px 40px rgba(20,30,25,.45);font-family:'Outfit',system-ui,sans-serif !important;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;backdrop-filter:blur(8px);cursor:pointer;";
    modal.title = 'Click to dismiss';
    modal.innerHTML = `
      <svg width="123" height="123" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="rgba(255,255,255,0.8)" d="M10 18a8 8 0 1 1 0-16a8 8 0 0 1 0 16Zm0-2a6 6 0 1 0 0-12a6 6 0 0 0 0 12ZM7 7h2v6H7V7Zm4 0h2v6h-2V7Z"/>
      </svg>
      <div style="width:264px;font-family:'Outfit',system-ui,sans-serif !important;font-weight:500;font-size:20px;line-height:30px;text-align:center;color:#fff !important;">
        The candidate would like a moment to pause.
      </div>
    `;
    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
    window.setTimeout(() => modal.remove(), 10000);
  }

  function flashSignal(kind: string, label: string) {
    const tag = document.createElement('div');
    tag.textContent = `🛰 ${label || kind}`;
    tag.style.cssText =
      'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#2b6ea3;color:#fff !important;padding:8px 16px;border-radius:999px;font:600 13px system-ui;z-index:2147483647;box-shadow:0 8px 24px rgba(0,0,0,.3);';
    document.body.appendChild(tag);
    window.setTimeout(() => tag.remove(), 2200);
  }

  // Watch window.capyconnectInterview for changes (set by the fake-interview page)
  // and forward them to peers.
  (function watchInterviewState() {
    let lastSnapshot = '';
    window.setInterval(() => {
      const snap = (window as any).capyconnectInterview;
      if (!snap) return;
      const key = JSON.stringify(snap);
      if (key === lastSnapshot) return;
      lastSnapshot = key;
      send({ type: 'interview', payload: snap });
    }, 800);
    window.addEventListener('capyconnect:question', (e: any) => {
      send({ type: 'interview', payload: { currentQuestion: e.detail?.question, followUps: e.detail?.followUps } });
    });
  })();

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

  let totalCount = 0;
  let currentTopicFollowUps: HTMLDivElement | null = null;
  let currentTopicKey: string | null = null;
  const topicGroups = new Map<string, { group: HTMLDivElement; fuWrap: HTMLDivElement; seen: Set<string> }>();

  function fmt(q: string) {
    const t = q.trim();
    if (!t) return t;
    const capped = t.replace(/^(\p{L})/u, (m) => m.toUpperCase());
    return /[.?!,;:]$/.test(capped) ? capped : capped + '?';
  }

  function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c]);
  }

  const STOPWORDS = new Set([
    'the','a','an','and','or','but','of','to','in','on','for','with','at','by','from','as','is','are','was','were','be','been','being','do','does','did','have','has','had','will','would','could','should','can','may','might','shall',
    'i','you','your','yours','me','my','mine','we','us','our','ours','they','them','their','theirs','he','she','it','its','his','her','hers',
    'this','that','these','those','here','there',
    'tell','describe','explain','walk','give','show','how','what','why','when','where','who','which','about','through','into','over','any','some','all','one','more','most','time','times','project','approach','code','codebase','design','way',
    'me','us','please','really','very','also','just','like','than','then','so','too','if','because',
  ]);

  function highlightKeywords(text: string): string {
    const cleanEnd = text.replace(/[?.!]+$/, '');
    const tokens = cleanEnd.match(/[\p{L}\p{N}'’\-]+|[^\p{L}\p{N}\s]+|\s+/gu) ?? [];
    type Word = { i: number; raw: string; key: string; len: number };
    const words: Word[] = [];
    tokens.forEach((t, i) => {
      if (/^[\p{L}\p{N}'’\-]+$/u.test(t)) {
        const key = t.toLowerCase().replace(/[’']/g, '');
        if (!STOPWORDS.has(key) && key.length >= 4) {
          words.push({ i, raw: t, key, len: key.length });
        }
      }
    });
    const picks = new Set<number>();
    if (words.length) {
      // Prefer the longest 1–2 distinct content words.
      const sorted = [...words].sort((a, b) => b.len - a.len);
      picks.add(sorted[0].i);
      if (sorted[1] && sorted[1].key !== sorted[0].key) picks.add(sorted[1].i);
    }
    const HL = (inner: string) =>
      `<span style="background:rgba(255,171,107,0.85);padding:0 6px;color:#20576C !important;font-weight:600;border-radius:2px;">${inner}</span>`;
    let html = tokens
      .map((t, i) => (picks.has(i) ? HL(escapeHtml(t)) : escapeHtml(t)))
      .join('');
    const trailing = text.match(/[?.!]+$/)?.[0] ?? '';
    return html + escapeHtml(trailing);
  }

  function dimPreviousTopics() {
    qTopics.querySelectorAll('[data-topic="1"]').forEach((el) => {
      const node = el as HTMLElement;
      if (role === 'candidate') {
        node.style.display = 'none';
      } else {
        node.style.opacity = '0.5';
      }
    });
  }

  function highlightCurrent(group: HTMLDivElement) {
    group.style.display = 'flex';
    group.style.opacity = '1';
  }

  function startTopic(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (!key) return;
    if (key === currentTopicKey) return; // already current

    if (qEmpty?.parentElement) qEmpty.remove();

    // Re-activate an existing topic instead of duplicating it.
    const existing = topicGroups.get(key);
    if (existing) {
      dimPreviousTopics();
      highlightCurrent(existing.group);
      currentTopicFollowUps = existing.fuWrap;
      currentTopicKey = key;
      existing.group.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      qHost.animate(
        [{ boxShadow: '0 0 0 3px #20576C' }, { boxShadow: '0 12px 32px rgba(20,30,25,.18)' }],
        { duration: 500 },
      );
      return;
    }

    dimPreviousTopics();
    totalCount++;
    qCount.textContent = String(totalCount);

    const group = document.createElement('div');
    group.dataset.topic = '1';
    group.style.cssText = 'display:flex;flex-direction:column;gap:8px;transition:opacity .2s;';
    const head = document.createElement('div');
    head.dataset.topicHead = '1';
    head.style.cssText =
      `font-family:'Outfit',sans-serif;font-weight:600;font-size:14px;line-height:1.4;color:#fff !important;${role === 'interviewer' ? 'cursor:pointer;user-select:none;' : ''}`;
    head.innerHTML = role === 'interviewer' ? escapeHtml(fmt(trimmed)) : highlightKeywords(fmt(trimmed));
    if (role === 'interviewer') {
      head.title = 'Click to set this as the active topic';
      head.addEventListener('click', () => {
        if (currentTopicKey === key) return;
        send({ type: 'topic', text: trimmed });
        startTopic(trimmed);
      });
    }
    const fuWrap = document.createElement('ul');
    fuWrap.style.cssText =
      "list-style:disc;margin:4px 0 0;padding:0 0 0 22px;display:flex;flex-direction:column;gap:4px;font-family:'Outfit',sans-serif;color:#fff !important;";
    group.appendChild(head);
    group.appendChild(fuWrap);
    qTopics.appendChild(group);
    qTopics.scrollTop = qTopics.scrollHeight;

    topicGroups.set(key, { group, fuWrap, seen: new Set() });
    currentTopicFollowUps = fuWrap;
    currentTopicKey = key;
    qHost.animate(
      [{ boxShadow: '0 0 0 3px #4a90e2' }, { boxShadow: '0 12px 32px rgba(20,30,25,.18)' }],
      { duration: 600 },
    );
  }

  function addFollowUp(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (!key) return;
    if (!currentTopicKey || !currentTopicFollowUps) {
      // No topic yet — promote this follow-up to a standalone topic.
      startTopic(trimmed);
      return;
    }
    const topic = topicGroups.get(currentTopicKey);
    if (!topic) return;
    if (topic.seen.has(key)) return;
    topic.seen.add(key);
    if (qEmpty?.parentElement) qEmpty.remove();
    totalCount++;
    qCount.textContent = String(totalCount);
    const row = document.createElement('li');
    row.style.cssText =
      "font-family:'Outfit',sans-serif;font-weight:500;font-size:12px;line-height:1.4;color:#fff !important;list-style:disc;margin:0;padding:0;";
    row.innerHTML = role === 'interviewer' ? escapeHtml(fmt(trimmed)) : highlightKeywords(fmt(trimmed));
    currentTopicFollowUps.appendChild(row);
    qTopics.scrollTop = qTopics.scrollHeight;
  }

  // Locally-detected question from this side's mic → relay to peers.
  function recordQuestion(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    addFollowUp(trimmed);
    send({ type: 'followup', text: trimmed });
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
      setToggleListening(true);
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
      if (text.trim()) {
        captions.textContent = text;
        captions.style.background = 'rgba(20,30,25,.85)';
        pulseCaptions();
        const now = Date.now();
        if (text !== lastSentCaption && now - lastCaptionAt > 350) {
          lastSentCaption = text;
          lastCaptionAt = now;
          send({ type: 'caption', text });
        }
      }
    };
    rec.onerror = () => {};
    rec.onend = () => {
      const wasManual = manuallyStopped;
      rec = null;
      if (wasManual) {
        setToggleListening(false);
        captions.textContent = 'Click "Start" and allow microphone access.';
        manuallyStopped = false;
        return;
      }
      window.setTimeout(() => {
        if (!manuallyStopped) start();
      }, 250);
    };
    try {
      rec.start();
    } catch {
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

  toggleBtn.addEventListener('click', () => {
    if (rec) stop();
    else start();
  });
  closeBtn.addEventListener('click', () => {
    stop();
    host.remove();
    qHost.remove();
    try { ws?.close(); } catch {}
    (window as any).__capyRelaySocket = null;
  });
  qClose.addEventListener('click', () => qHost.remove());

  const textInput = host.querySelector('#qs-demo-text') as HTMLInputElement;
  const sendCapBtn = host.querySelector('#qs-demo-send-cap') as HTMLButtonElement;
  const sendQBtn = host.querySelector('#qs-demo-send-q') as HTMLButtonElement;

  function sendTestCaption() {
    const v = textInput.value.trim();
    if (!v) return;
    captions.textContent = v;
    captions.style.background = 'rgba(20,30,25,.85)';
    send({ type: 'caption', text: v });
    textInput.value = '';
  }
  function sendTestQuestion() {
    const v = textInput.value.trim();
    if (!v) return;
    recordQuestion(v);
    textInput.value = '';
  }
  sendCapBtn.addEventListener('click', sendTestCaption);
  sendQBtn.addEventListener('click', sendTestQuestion);
  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) sendTestQuestion();
      else sendTestCaption();
    }
  });

  // Candidate: floating mascot in the bottom-left, toggleable.
  if (role === 'candidate') {
    const MASCOT_ID = 'quietspace-demo-mascot';
    const TAB_ID = 'quietspace-demo-mascot-tab';
    const STYLE_ID = 'quietspace-demo-mascot-style';
    document.getElementById(MASCOT_ID)?.remove();
    document.getElementById(TAB_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
    const mascotUrl = opts?.mascotUrl ?? '';

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes qs-breathe {
        0%   { filter: drop-shadow(0 0 6px rgba(104,197,220,0.30)) drop-shadow(0 0 14px rgba(74,144,226,0.18)); }
        50%  { filter: drop-shadow(0 0 14px rgba(104,197,220,0.65)) drop-shadow(0 0 28px rgba(74,144,226,0.45)); }
        100% { filter: drop-shadow(0 0 6px rgba(104,197,220,0.30)) drop-shadow(0 0 14px rgba(74,144,226,0.18)); }
      }
      #${MASCOT_ID} .qs-mascot-inner { position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
      #${MASCOT_ID} #qs-demo-mascot-img { animation: qs-breathe 5s ease-in-out infinite; }
    `;
    document.head.appendChild(style);

    const mascot = document.createElement('div');
    mascot.id = MASCOT_ID;
    mascot.title = 'Drag to move · toggle from the extension popup';
    const visible = opts?.showMascot !== false;
    mascot.style.cssText =
      `position:fixed;left:24px;bottom:24px;width:180px;height:180px;background:transparent;cursor:move;z-index:2147483647;user-select:none;display:${visible ? 'flex' : 'none'};align-items:center;justify-content:center;`;
    mascot.innerHTML = `
      <div class="qs-mascot-inner">
        <img id="qs-demo-mascot-img" src="${mascotUrl}" alt="Capy" style="position:relative;width:100%;height:100%;object-fit:contain;pointer-events:none;display:block;" />
        <div id="qs-demo-mascot-fallback" style="display:none;position:relative;width:100%;height:100%;align-items:center;justify-content:center;font-size:120px;">🦫</div>
      </div>
    `;
    const imgEl = mascot.querySelector('#qs-demo-mascot-img') as HTMLImageElement;
    const fbEl = mascot.querySelector('#qs-demo-mascot-fallback') as HTMLDivElement;
    imgEl.addEventListener('error', () => {
      imgEl.style.display = 'none';
      fbEl.style.display = 'flex';
    });
    document.body.appendChild(mascot);
    makeDraggable(mascot, mascot);
  }

  // Interviewer: pre-populate the question board with all preset topics + follow-ups.
  if (role === 'interviewer' && opts?.presets?.length) {
    if (qEmpty?.parentElement) qEmpty.remove();
    for (const p of opts.presets) {
      const trimmed = p.text.trim();
      const key = trimmed.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
      if (!key || topicGroups.has(key)) continue;
      const group = document.createElement('div');
      group.dataset.topic = '1';
      group.style.cssText = 'display:flex;flex-direction:column;gap:8px;opacity:0.5;transition:opacity .2s;';

      const headRow = document.createElement('div');
      headRow.style.cssText = 'display:flex;align-items:flex-start;gap:10px;user-select:none;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.cssText = 'margin:3px 0 0;width:16px;height:16px;accent-color:#68C5DC;cursor:pointer;flex-shrink:0;';
      checkbox.title = 'Mark as covered';

      const head = document.createElement('span');
      head.dataset.topicHead = '1';
      head.style.cssText = "flex:1;font-family:'Outfit',sans-serif;font-weight:600;font-size:14px;line-height:1.4;color:#fff !important;cursor:pointer;";
      head.textContent = fmt(trimmed);

      function applyChecked() {
        head.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        head.style.opacity = checkbox.checked ? '0.6' : '1';
      }

      checkbox.addEventListener('click', (e) => {
        // Don't trigger topic-activation when toggling the checkbox.
        e.stopPropagation();
        applyChecked();
      });

      head.addEventListener('click', () => {
        if (currentTopicKey === key) return;
        send({ type: 'topic', text: trimmed });
        startTopic(trimmed);
      });

      headRow.appendChild(checkbox);
      headRow.appendChild(head);

      const fuWrap = document.createElement('ul');
      fuWrap.style.cssText = "list-style:disc;margin:4px 0 0 26px;padding:0 0 0 22px;display:flex;flex-direction:column;gap:4px;font-family:'Outfit',sans-serif;color:#fff !important;";
      group.appendChild(headRow);
      group.appendChild(fuWrap);
      qTopics.appendChild(group);
      topicGroups.set(key, { group, fuWrap, seen: new Set() });
    }
  }

  connectRelay();
}
