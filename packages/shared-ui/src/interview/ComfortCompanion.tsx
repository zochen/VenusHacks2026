// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 1): render the capybara SVG / Lottie (asset TBD — coordinate with Person 4)
// TODO(Person 1): breathing pulse animation (4s inhale, 4s exhale) via CSS keyframes
// TODO(Person 1): respect prefers-reduced-motion
// TODO(Person 1): optional "sync your breath" guided overlay when user opts in

export interface ComfortCompanionProps {
  size?: number;
}

export function ComfortCompanion({ size = 96 }: ComfortCompanionProps) {
  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      data-component="comfort-companion"
    />
  );
}

export default ComfortCompanion;
