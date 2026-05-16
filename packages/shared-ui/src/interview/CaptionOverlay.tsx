// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';
import type { TranscriptEntry } from '@quietspace/shared-types';

// TODO(Person 1): rolling window of latest N transcript entries
// TODO(Person 1): high-contrast mode for the 'focus' communication style
// TODO(Person 1): handle interim vs final transcript states differently

export interface CaptionOverlayProps {
  entries: TranscriptEntry[];
}

export function CaptionOverlay({ entries }: CaptionOverlayProps) {
  return <div aria-live="polite">{entries.map((e) => e.text).join(' ')}</div>;
}

export default CaptionOverlay;
