// OWNER: Person 1 (Candidate Experience)
// Surface: web (simulator) + extension (overlay) — via shared-ui
// Do not edit without coordinating in group chat.

import * as React from 'react';
import type { Question, CommunicationStyle } from '@quietspace/shared-types';

// TODO(Person 1): render question with style-aware formatting (default / relaxed / focus)
// TODO(Person 1): support clarified-question swap when AI rewrites the prompt
// TODO(Person 1): typography respects user fontScale preference

export interface QuestionDisplayProps {
  question: Question;
  style?: CommunicationStyle;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  return <div>{question.prompt}</div>;
}

export default QuestionDisplay;
