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

export function Popup() {
  const [activeHost, setActiveHost] = React.useState<string | null>(null);
  const [hostSupported, setHostSupported] = React.useState(false);
  const [demoStatus, setDemoStatus] = React.useState<string | null>(null);
  const [roomCode, setRoomCode] = React.useState('');
  const [relayUrl, setRelayUrl] = React.useState(DEFAULT_RELAY_URL);

  React.useEffect(() => {
    chrome.storage?.local?.get(['capyRoom', 'capyRelayUrl'], (v) => {
      if (v.capyRoom) setRoomCode(String(v.capyRoom));
      if (v.capyRelayUrl) setRelayUrl(String(v.capyRelayUrl));
    });
  }, []);

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
        args: [{ room: roomCode || null, relayUrl: relayUrl || null }],
      });
      setDemoStatus(
        roomCode
          ? `Overlay added — room ${roomCode}. Grant mic permission.`
          : 'Overlay added — set a room code to sync with another machine.',
      );
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
function injectCaptionDemo(opts: { room: string | null; relayUrl: string | null }) {
  const HOST_ID = 'quietspace-demo-overlay';
  const QHOST_ID = 'quietspace-demo-questions';
  const existing = document.getElementById(HOST_ID);
  const existingQ = document.getElementById(QHOST_ID);
  if (existing || existingQ) {
    existing?.remove();
    existingQ?.remove();
    (window as any).__capyRelaySocket?.close?.();
    (window as any).__capyRelaySocket = null;
    return;
  }
  const room = opts?.room || null;
  const relayUrl = opts?.relayUrl || 'ws://localhost:8787';
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
    'position:fixed;right:20px;bottom:20px;width:340px;background:#fff;border:1px solid #e1e5dd;border-radius:16px;box-shadow:0 12px 32px rgba(20,30,25,.18);font:14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#2a2d33;z-index:2147483647;overflow:hidden;';
  host.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#f4f8f5,#fff);border-bottom:1px solid #e1e5dd;">
      <div>
        <div style="font-weight:700;">🌿 CapyConnect · Captions</div>
        <div id="qs-demo-room" style="font-size:10px;color:#6b7280;margin-top:2px;"></div>
      </div>
      <button id="qs-demo-close" style="background:transparent;border:none;cursor:pointer;font-size:18px;color:#6b7280;">×</button>
    </div>
    <div id="qs-demo-status" style="padding:6px 14px;font-size:11px;color:#6b7280;">Click "Start" and allow microphone access.</div>
    <div id="qs-demo-captions" aria-live="polite" style="margin:8px 14px;padding:12px 14px;min-height:64px;background:rgba(20,30,25,.85);color:#fff;border-radius:10px;font-size:16px;line-height:1.4;">Waiting for speech…</div>
    <div style="padding:10px 14px;display:flex;gap:8px;border-top:1px solid #e1e5dd;background:#fafafa;">
      <button id="qs-demo-start" style="flex:1;padding:8px 12px;background:#5b8b6f;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;">🎙 Start</button>
      <button id="qs-demo-stop" style="flex:1;padding:8px 12px;background:#c45c5c;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;" disabled>■ Stop</button>
    </div>
    <div style="padding:10px 14px;display:flex;gap:6px;border-top:1px solid #e1e5dd;background:#f7fbff;">
      <input id="qs-demo-text" type="text" placeholder="Type to test relay…" style="flex:1;padding:6px 10px;border:1px solid #d6e4f0;border-radius:6px;font:13px system-ui;outline:none;" />
      <button id="qs-demo-send-cap" title="Send as caption" style="padding:6px 10px;background:#2b6ea3;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;">💬</button>
      <button id="qs-demo-send-q" title="Send as question" style="padding:6px 10px;background:#8a5cf2;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;">❓</button>
    </div>
  `;
  document.body.appendChild(host);

  // Separate top-right panel for detected questions.
  const qHost = document.createElement('div');
  qHost.id = QHOST_ID;
  qHost.style.cssText =
    'position:fixed;top:20px;right:20px;width:320px;max-height:60vh;background:#fff;border:1px solid #e1e5dd;border-radius:16px;box-shadow:0 12px 32px rgba(20,30,25,.18);font:14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#2a2d33;z-index:2147483647;overflow:hidden;display:flex;flex-direction:column;';
  qHost.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#eaf6ff,#fff);border-bottom:1px solid #e1e5dd;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-weight:700;">❓ Detected questions</span>
        <span id="qs-demo-qcount" style="background:#eaf6ff;color:#2b6ea3;padding:1px 8px;border-radius:999px;font-size:11px;font-weight:600;">0</span>
      </div>
      <button id="qs-demo-qclose" style="background:transparent;border:none;cursor:pointer;font-size:18px;color:#6b7280;">×</button>
    </div>
    <ul id="qs-demo-questions" style="margin:0;padding:10px 14px;list-style:none;overflow-y:auto;display:flex;flex-direction:column;gap:6px;font-size:13px;color:#2a2d33;flex:1;">
      <li id="qs-demo-qempty" style="color:#6b7280;font-style:italic;font-size:12px;">No questions detected yet…</li>
    </ul>
  `;
  document.body.appendChild(qHost);

  const status = host.querySelector('#qs-demo-status') as HTMLDivElement;
  const captions = host.querySelector('#qs-demo-captions') as HTMLDivElement;
  const startBtn = host.querySelector('#qs-demo-start') as HTMLButtonElement;
  const stopBtn = host.querySelector('#qs-demo-stop') as HTMLButtonElement;
  const closeBtn = host.querySelector('#qs-demo-close') as HTMLButtonElement;
  const qList = qHost.querySelector('#qs-demo-questions') as HTMLUListElement;
  const qCount = qHost.querySelector('#qs-demo-qcount') as HTMLSpanElement;
  const qClose = qHost.querySelector('#qs-demo-qclose') as HTMLButtonElement;
  const qEmpty = qHost.querySelector('#qs-demo-qempty') as HTMLLIElement;
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
        roomLabel.textContent = `Connected · room ${room} · ${msg.peers} peer${msg.peers === 1 ? '' : 's'}`;
        return;
      }
      if (msg.type === 'question') {
        recordQuestion(String(msg.text ?? ''), true);
      } else if (msg.type === 'caption') {
        renderRemoteCaption(String(msg.text ?? ''));
      } else if (msg.type === 'interview') {
        renderInterviewState(msg.payload);
      } else if (msg.type === 'signal') {
        flashSignal(String(msg.kind ?? 'note'), String(msg.label ?? ''));
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
    // Treat the remote interview's currentQuestion as a detected question.
    recordQuestion(String(payload.currentQuestion), true);
  }

  function flashSignal(kind: string, label: string) {
    const tag = document.createElement('div');
    tag.textContent = `🛰 ${label || kind}`;
    tag.style.cssText =
      'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#2b6ea3;color:#fff;padding:8px 16px;border-radius:999px;font:600 13px system-ui;z-index:2147483647;box-shadow:0 8px 24px rgba(0,0,0,.3);';
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

  const seen = new Set<string>();
  let questionCount = 0;

  function recordQuestion(q: string, remote = false) {
    const key = q.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    questionCount++;
    qCount.textContent = String(questionCount);
    if (qEmpty?.parentElement) qEmpty.remove();
    const li = document.createElement('li');
    li.style.cssText = remote
      ? 'padding:8px 10px;background:#f0e6ff;border-left:3px solid #8a5cf2;border-radius:6px;line-height:1.35;'
      : 'padding:8px 10px;background:#eaf6ff;border-left:3px solid #4a90e2;border-radius:6px;line-height:1.35;';
    li.textContent = (remote ? '🛰 ' : '') + (q.endsWith('?') ? q : q + '?');
    qList.prepend(li);
    qHost.animate(
      [{ boxShadow: `0 0 0 3px ${remote ? '#8a5cf2' : '#4a90e2'}` }, { boxShadow: '0 12px 32px rgba(20,30,25,.18)' }],
      { duration: 600 },
    );
    if (!remote) send({ type: 'question', text: q });
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
      if (text.trim()) {
        captions.textContent = text;
        captions.style.background = 'rgba(20,30,25,.85)';
        const now = Date.now();
        if (text !== lastSentCaption && now - lastCaptionAt > 350) {
          lastSentCaption = text;
          lastCaptionAt = now;
          send({ type: 'caption', text });
        }
      }
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
    recordQuestion(v, false);
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

  connectRelay();
}
