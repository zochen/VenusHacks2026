// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';
import type { TranscriptEntry } from '@quietspace/shared-types';
import { tokens } from '../tokens';

export interface CaptionOverlayProps {
  entries: TranscriptEntry[];
  maxLines?: number;
  highContrast?: boolean;
}

export function CaptionOverlay({ entries, maxLines = 2, highContrast = false }: CaptionOverlayProps) {
  const recent = entries.slice(-maxLines);
  const bg = highContrast ? '#000' : 'rgba(20, 30, 25, 0.85)';
  const fg = highContrast ? '#ffeb3b' : '#fff';

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      style={{
        background: bg,
        color: fg,
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
        borderRadius: tokens.radius.md,
        fontFamily: tokens.font.sans,
        fontSize: 18,
        lineHeight: 1.4,
        minHeight: 64,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        boxShadow: tokens.shadow.md,
      }}
    >
      {recent.length === 0 ? (
        <span style={{ opacity: 0.6, fontStyle: 'italic' }}>Waiting for speech...</span>
      ) : (
        recent.map((e) => (
          <span key={e.id} style={{ opacity: e.isFinal ? 1 : 0.7 }}>
            {e.text}
          </span>
        ))
      )}
    </div>
  );
}

export default CaptionOverlay;
