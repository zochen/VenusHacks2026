import * as React from 'react';

const BUTTONS: { icon: string; label: string }[] = [
  { icon: '🎤', label: 'Mute' },
  { icon: '🎥', label: 'Stop Video' },
  { icon: '👥', label: 'Participants' },
  { icon: '💬', label: 'Chat' },
  { icon: '🖥', label: 'Share' },
];

export default function ControlBar() {
  return (
    <footer className="controls">
      {BUTTONS.map((b) => (
        <button key={b.label} className="ctrl-btn" type="button">
          <span className="icon">{b.icon}</span>
          {b.label}
        </button>
      ))}
      <button className="ctrl-btn danger" type="button">
        <span className="icon">📞</span>
        Leave
      </button>
    </footer>
  );
}
