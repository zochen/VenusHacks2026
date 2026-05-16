// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';
import type { Question, CommunicationStyle } from '@quietspace/shared-types';
import { tokens } from '../tokens';

export interface QuestionDisplayProps {
  question: Question;
  style?: CommunicationStyle;
  fontScale?: number;
  clarified?: string | null;
}

export function QuestionDisplay({ question, style = 'default', fontScale = 1, clarified }: QuestionDisplayProps) {
  const baseSize = style === 'focus' ? 24 : 20;
  return (
    <div
      style={{
        background: tokens.color.surfaceMuted,
        border: `1px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        fontFamily: tokens.font.sans,
      }}
    >
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: tokens.color.textMuted, marginBottom: 8 }}>
        Question
      </div>
      <div style={{ fontSize: baseSize * fontScale, color: tokens.color.text, lineHeight: 1.5, fontWeight: 500 }}>
        {question.prompt}
      </div>
      {clarified && (
        <div
          style={{
            marginTop: tokens.spacing.md,
            paddingTop: tokens.spacing.md,
            borderTop: `1px dashed ${tokens.color.border}`,
            fontSize: (baseSize - 2) * fontScale,
            color: tokens.color.accent,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ display: 'block', marginBottom: 4, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Clarified
          </strong>
          {clarified}
        </div>
      )}
    </div>
  );
}

export default QuestionDisplay;
