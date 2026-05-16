// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 1): emit pause / "need a moment" / repeat-question events to the host surface
// TODO(Person 1): keyboard shortcuts (Space = pause, R = repeat)
// TODO(Person 1): visual confirmation state after press

export interface PauseProcessButtonsProps {
  onPause?: () => void;
  onRequestRepeat?: () => void;
  onNeedMoment?: () => void;
}

export function PauseProcessButtons(_props: PauseProcessButtonsProps) {
  return (
    <div role="group" aria-label="Pause and process controls">
      <button type="button">Pause</button>
      <button type="button">Need a moment</button>
      <button type="button">Repeat question</button>
    </div>
  );
}

export default PauseProcessButtons;
