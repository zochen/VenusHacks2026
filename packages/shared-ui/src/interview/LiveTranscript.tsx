// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';
import type { TranscriptEntry } from '@quietspace/shared-types';

// TODO(Person 1): virtualized scroll for long transcripts
// TODO(Person 1): speaker labels with color coding
// TODO(Person 1): copy-to-clipboard for any line; export-on-end hook

export interface LiveTranscriptProps {
  entries: TranscriptEntry[];
}

export function LiveTranscript({ entries }: LiveTranscriptProps) {
  return (
    <ol>
      {entries.map((e) => (
        <li key={e.id}>
          <strong>{e.speaker}:</strong> {e.text}
        </li>
      ))}
    </ol>
  );
}

export default LiveTranscript;
