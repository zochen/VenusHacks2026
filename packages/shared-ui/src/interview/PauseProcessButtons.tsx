// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';
import { tokens } from '../tokens';
import { Button } from '../primitives/Button';

export interface PauseProcessButtonsProps {
  onPause?: () => void;
  onRequestRepeat?: () => void;
  onNeedMoment?: () => void;
  lastAction?: 'pause' | 'repeat' | 'moment' | null;
}

export function PauseProcessButtons({ onPause, onRequestRepeat, onNeedMoment, lastAction }: PauseProcessButtonsProps) {
  return (
    <div
      role="group"
      aria-label="Pause and process controls"
      style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}
    >
      <Button variant="secondary" size="md" onClick={onNeedMoment} fullWidth>
        ⏸  I need a moment
      </Button>
      <Button variant="secondary" size="md" onClick={onRequestRepeat} fullWidth>
        🔁  Please repeat the question
      </Button>
      <Button variant="ghost" size="sm" onClick={onPause} fullWidth>
        Pause the interview
      </Button>
      {lastAction && (
        <div style={{ fontSize: 12, color: tokens.color.accent, textAlign: 'center', marginTop: 4 }}>
          ✓ Sent to interviewer
        </div>
      )}
    </div>
  );
}

export default PauseProcessButtons;
