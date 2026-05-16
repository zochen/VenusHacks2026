// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';
import { tokens } from '../tokens';

export interface ComfortCompanionProps {
  size?: number;
  label?: string;
}

const KEYFRAMES_ID = 'capyconnect-companion-keyframes';

function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes capyconnect-breathe {
      0%, 100% { transform: scale(1); opacity: 0.85; }
      50% { transform: scale(1.08); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .capyconnect-breathing { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

export function ComfortCompanion({ size = 120, label = 'Breathe with me' }: ComfortCompanionProps) {
  React.useEffect(() => {
    injectKeyframes();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: tokens.font.sans }}>
      <div
        className="capyconnect-breathing"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: tokens.color.accentMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.55,
          animation: 'capyconnect-breathe 8s ease-in-out infinite',
          boxShadow: `0 0 0 12px ${tokens.color.accentMuted}55`,
        }}
        role="img"
        aria-label="Calming companion"
      >
        🐹
      </div>
      <span style={{ fontSize: 13, color: tokens.color.textMuted, letterSpacing: 0.5 }}>{label}</span>
    </div>
  );
}

export default ComfortCompanion;
