// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';
import type { TranscriptEntry } from '@quietspace/shared-types';
import { tokens } from '../tokens';

export interface LiveTranscriptProps {
  entries: TranscriptEntry[];
  height?: number;
}

const speakerColor: Record<TranscriptEntry['speaker'], string> = {
  candidate: tokens.color.accent,
  interviewer: '#8068b8',
  unknown: tokens.color.textMuted,
};

export function LiveTranscript({ entries, height = 360 }: LiveTranscriptProps) {
  const scrollRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <ol
      ref={scrollRef}
      style={{
        listStyle: 'none',
        margin: 0,
        padding: tokens.spacing.md,
        background: tokens.color.surface,
        border: `1px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.md,
        height,
        overflowY: 'auto',
        fontFamily: tokens.font.sans,
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      {entries.length === 0 ? (
        <li style={{ color: tokens.color.textMuted, fontStyle: 'italic' }}>No transcript yet.</li>
      ) : (
        entries.map((e) => (
          <li key={e.id} style={{ marginBottom: 10, opacity: e.isFinal ? 1 : 0.65 }}>
            <span style={{ color: speakerColor[e.speaker], fontWeight: 600, textTransform: 'capitalize', marginRight: 8 }}>
              {e.speaker}:
            </span>
            <span style={{ color: tokens.color.text }}>{e.text}</span>
          </li>
        ))
      )}
    </ol>
  );
}

export default LiveTranscript;
