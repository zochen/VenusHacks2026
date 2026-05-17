"use client";
import * as React from 'react';
import Link from 'next/link';
import './demo.css';

// Preset questions shown to the candidate (Topic board).
const PRESET_TOPICS = [
  "Tell me about a project you're proud of.",
  'Describe a challenging bug you encountered.',
  'How do you approach debugging in an unfamiliar codebase?',
  'Walk me through how you would design a URL shortener.',
  'Tell me about a time you worked on a team project.',
];

// ---- Draggable hook: attaches mousedown on the header element. ----
function useDraggable(initial: { left?: number; right?: number; top?: number; bottom?: number }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const stateRef = React.useRef({ dragging: false, startX: 0, startY: 0, originLeft: 0, originTop: 0 });

  React.useEffect(() => {
    const el = ref.current;
    const handle = headerRef.current;
    if (!el || !handle) return;

    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('button, input, textarea, a, select')) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      el.style.left = rect.left + 'px';
      el.style.top = rect.top + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      stateRef.current = {
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        originLeft: rect.left,
        originTop: rect.top,
      };
      document.body.style.userSelect = 'none';
    };
    const onMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s.dragging) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;
      el.style.left = Math.max(0, Math.min(maxX, s.originLeft + dx)) + 'px';
      el.style.top = Math.max(0, Math.min(maxY, s.originTop + dy)) + 'px';
    };
    const onUp = () => {
      if (!stateRef.current.dragging) return;
      stateRef.current.dragging = false;
      document.body.style.userSelect = '';
    };

    handle.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      handle.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const initialStyle: React.CSSProperties = {
    left: initial.left,
    right: initial.right,
    top: initial.top,
    bottom: initial.bottom,
  };

  return { ref, headerRef, initialStyle };
}

// ---- Header ----
function InterviewHeader() {
  return (
    <header className="header">
      <div>
        <div className="header-title">Stripe — Software Engineering Intern Interview</div>
        <div className="header-sub">Interviewer: Sarah Chen · Senior Software Engineer</div>
      </div>
      <div className="header-meta">
        <span><span className="live-dot" />LIVE</span>
        <span>•</span>
        <span>00:14:32</span>
      </div>
    </header>
  );
}

// ---- Interviewer video tile ----
function InterviewerVideo() {
  return (
    <div className="tile tile-interviewer">
      <div className="avatar-circle">SC</div>
      <div className="tile-label">
        Sarah Chen
        <small>Senior Software Engineer · Stripe</small>
      </div>
    </div>
  );
}

// ---- Candidate PiP (real webcam if granted) ----
function CandidateVideo() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 270 },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e: any) {
        setError(e?.message ?? 'Camera unavailable');
      }
    }
    start();
    return () => { cancelled = true; stream?.getTracks().forEach((t) => t.stop()); };
  }, []);

  return (
    <div className="tile tile-candidate">
      {error ? (
        <div className="cam-placeholder">
          Camera off
          <br />
          <span style={{ fontSize: 10, opacity: 0.7 }}>{error}</span>
        </div>
      ) : (
        <video ref={videoRef} muted playsInline autoPlay />
      )}
      <div className="tile-label">You</div>
    </div>
  );
}

function VideoStage() {
  return (
    <main className="stage">
      <InterviewerVideo />
      <CandidateVideo />
    </main>
  );
}

// ---- Bottom Zoom-style control bar ----
function ControlBar() {
  const buttons = [
    { icon: '🎤', label: 'Mute' },
    { icon: '🎥', label: 'Stop Video' },
    { icon: '👥', label: 'Participants' },
    { icon: '💬', label: 'Chat' },
    { icon: '🖥', label: 'Share' },
  ];
  return (
    <footer className="controls">
      {buttons.map((b) => (
        <button key={b.label} className="ctrl-btn" type="button">
          <span className="icon">{b.icon}</span>
          {b.label}
        </button>
      ))}
      <Link href="/" className="ctrl-btn danger">
        <span className="icon">📞</span>
        Leave
      </Link>
    </footer>
  );
}

// ---- CapyConnect Captions panel (bottom-right, draggable) ----
function CaptionsPanel() {
  const { ref, headerRef, initialStyle } = useDraggable({ right: 20, bottom: 20 });
  const [visible, setVisible] = React.useState(true);
  const [recording, setRecording] = React.useState(false);
  const [caption, setCaption] = React.useState('Click "Start" and allow microphone access.');
  const [typed, setTyped] = React.useState('');

  if (!visible) return null;

  const onToggle = () => {
    if (recording) { setRecording(false); setCaption('Captions paused.'); return; }
    setRecording(true);
    setCaption('Listening…');
  };

  const onThinkingPause = () => {
    setCaption('🫧 Asked the interviewer for a thinking pause.');
  };

  const sendCaption = () => {
    if (!typed.trim()) return;
    setCaption(typed);
    setTyped('');
  };

  return (
    <div ref={ref} className="qs-panel qs-captions" style={initialStyle} aria-label="CapyConnect captions">
      <div ref={headerRef} className="qs-head">
        <div>
          <div className="qs-title">Captions</div>
          <div className="qs-sub">Connected · room OIQ8TN · 1 online</div>
        </div>
        <button type="button" className="qs-close" aria-label="Close" onClick={() => setVisible(false)}>×</button>
      </div>

      <div className="qs-display">{caption}</div>

      <div className="qs-actions">
        <button type="button" className={`qs-btn${recording ? ' recording' : ''}`} onClick={onToggle}>
          {recording ? '■ Stop' : '🎙 Start'}
        </button>
        <button type="button" className="qs-btn alt" onClick={onThinkingPause}>
          ⏸ Thinking pause
        </button>
      </div>

      <div className="qs-input-row">
        <input
          type="text"
          className="qs-text"
          placeholder="Type to text caption..."
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendCaption(); }}
        />
        <button type="button" className="qs-icon-btn" title="Send as caption" onClick={sendCaption}>💬</button>
        <button type="button" className="qs-icon-btn alt" title="Send as question">❓</button>
      </div>
    </div>
  );
}

// ---- Topic / Question board panel (top-right, draggable) ----
function TopicPanel() {
  const { ref, headerRef, initialStyle } = useDraggable({ right: 20, top: 80 });
  const [visible, setVisible] = React.useState(true);
  const [activeIdx, setActiveIdx] = React.useState(0);

  if (!visible) return null;

  return (
    <div ref={ref} className="qs-panel qs-topics" style={initialStyle} aria-label="Interview topics">
      <div ref={headerRef} className="qs-head">
        <div>
          <div className="qs-title">Topic</div>
          <div className="qs-sub">From the interviewer · {activeIdx + 1} of {PRESET_TOPICS.length}</div>
        </div>
        <button type="button" className="qs-close" aria-label="Close" onClick={() => setVisible(false)}>×</button>
      </div>

      <div className="qs-body">
        {PRESET_TOPICS.map((t, i) => (
          <button
            key={i}
            type="button"
            className={`qs-topic-card${i === activeIdx ? ' active' : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            <span className="qs-topic-num">{i + 1}.</span>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Capybara mascot (draggable, breathing glow) ----
function CapyMascot() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const state = { dragging: false, startX: 0, startY: 0, originLeft: 0, originTop: 0 };
    const onDown = (e: MouseEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      el.style.left = rect.left + 'px';
      el.style.top = rect.top + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      state.dragging = true;
      state.startX = e.clientX;
      state.startY = e.clientY;
      state.originLeft = rect.left;
      state.originTop = rect.top;
      document.body.style.userSelect = 'none';
    };
    const onMove = (e: MouseEvent) => {
      if (!state.dragging) return;
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;
      el.style.left = Math.max(0, Math.min(maxX, state.originLeft + dx)) + 'px';
      el.style.top = Math.max(0, Math.min(maxY, state.originTop + dy)) + 'px';
    };
    const onUp = () => {
      if (!state.dragging) return;
      state.dragging = false;
      document.body.style.userSelect = '';
    };
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div ref={ref} className="qs-mascot" title="Drag to move">
      {fallback ? (
        <span style={{ fontSize: 120 }} aria-label="Capybara">🦫</span>
      ) : (
        <img src="/CapyConnect_avatar.png" alt="Capy" onError={() => setFallback(true)} />
      )}
    </div>
  );
}

// ---- Eye / privacy blur button (mirrors the extension's floating button) ----
function EyeBlurButton() {
  const [active, setActive] = React.useState(false);
  const drawOverlayRef = React.useRef<HTMLDivElement | null>(null);
  const previewRef = React.useRef<HTMLDivElement | null>(null);
  const drawModeRef = React.useRef(false);
  const startRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const existing = document.getElementById('quietspace-demo-blur');
    if (existing) existing.remove();

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
    drawOverlayRef.current = drawOverlay;

    function createBlurBox(rect: DOMRect) {
      const blurBox = document.createElement('div');
      blurBox.className = 'quietspace-demo-blur-rect';
      blurBox.style.cssText =
        `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(255,255,255,0.04);z-index:2147483640;border-radius:8px;box-shadow:0 0 0 1px rgba(52,116,141,0.3);pointer-events:none;`;

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'quietspace-demo-blur-rect__close';
      close.setAttribute('aria-label', 'Remove blur');
      close.title = 'Remove blur';
      close.textContent = 'X';
      close.style.cssText =
        'position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;background:#34748D;color:#fff;border:none;cursor:pointer;font-size:16px;line-height:1;pointer-events:auto;display:flex;align-items:center;justify-content:center;transform:translateY(-3px);';
      close.addEventListener('click', () => blurBox.remove());
      blurBox.appendChild(close);

      return blurBox;
    }

    function enterDrawMode() {
      drawModeRef.current = true;
      drawOverlay.style.display = 'block';
    }

    function exitDrawMode() {
      drawModeRef.current = false;
      drawOverlay.style.display = 'none';
      if (previewRef.current) {
        previewRef.current.remove();
        previewRef.current = null;
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (!drawModeRef.current) return;
      startRef.current.x = e.clientX;
      startRef.current.y = e.clientY;
      const preview = document.createElement('div');
      preview.style.cssText =
        `position:fixed;left:${startRef.current.x}px;top:${startRef.current.y}px;width:0;height:0;border:2px dashed #34748D;background:rgba(175,240,255,0.18);z-index:2147483646;pointer-events:none;border-radius:6px;`;
      previewRef.current = preview;
      document.body.appendChild(preview);
    }

    function onMouseMove(e: MouseEvent) {
      if (!previewRef.current) return;
      const x = Math.min(startRef.current.x, e.clientX);
      const y = Math.min(startRef.current.y, e.clientY);
      const width = Math.abs(e.clientX - startRef.current.x);
      const height = Math.abs(e.clientY - startRef.current.y);
      previewRef.current.style.left = `${x}px`;
      previewRef.current.style.top = `${y}px`;
      previewRef.current.style.width = `${width}px`;
      previewRef.current.style.height = `${height}px`;
    }

    function onMouseUp() {
      if (!previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      previewRef.current.remove();
      previewRef.current = null;
      if (rect.width < 12 || rect.height < 12) {
        exitDrawMode();
        return;
      }

      const blurBox = createBlurBox(rect);
      document.body.appendChild(blurBox);
      exitDrawMode();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && drawModeRef.current) {
        exitDrawMode();
      }
    }

    drawOverlay.addEventListener('mousedown', onMouseDown);
    drawOverlay.addEventListener('mousemove', onMouseMove);
    drawOverlay.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      drawOverlay.remove();
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const toggleDrawMode = () => {
    const overlay = drawOverlayRef.current;
    if (!overlay) return;
    setActive((current) => {
      const next = !current;
      drawModeRef.current = next;
      overlay.style.display = next ? 'block' : 'none';
      if (!next && previewRef.current) {
        previewRef.current.remove();
        previewRef.current = null;
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      className={`qs-eye-btn${active ? ' active' : ''}`}
      onClick={toggleDrawMode}
      title={active ? 'Click to stop blurring' : 'Drag on the page to blur an area'}
      aria-label="Privacy blur"
    >
      <svg width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {active ? (
          <path
            fill="#AFF0FF"
            d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5Z"
          />
        ) : (
          <path
            fill="#34748D"
            d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7Z"
          />
        )}
      </svg>
    </button>
  );
}

export default function DemoPage() {
  // Load the Outfit font (matches the extension's panel font).
  React.useEffect(() => {
    if (document.getElementById('qs-outfit-font')) return;
    const link = document.createElement('link');
    link.id = 'qs-outfit-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="demo-root">
      <InterviewHeader />
      <VideoStage />
      <ControlBar />
      <TopicPanel />
      <CaptionsPanel />
      <CapyMascot />
      <EyeBlurButton />
    </div>
  );
}
