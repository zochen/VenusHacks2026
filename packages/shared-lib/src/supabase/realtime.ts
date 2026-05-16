// OWNER: Person 3 (Backend / Integrations)
// Surface: SHARED — used by web simulator AND extension overlay for interviewer<->candidate sync
// Do not edit without coordinating in group chat.

import type { TranscriptEntry, SessionState } from '@quietspace/shared-types';

// TODO(Person 3): subscribe to Supabase Realtime channel for an interview id
// TODO(Person 3): broadcast TranscriptEntry appends with a sequence number to dedupe
// TODO(Person 3): broadcast SessionState transitions (paused / live / ended)
// TODO(Person 3): tear down channel on unmount; expose an unsubscribe handle

export interface InterviewSubscription {
  unsubscribe: () => void;
}

export interface InterviewHandlers {
  onTranscript?: (entry: TranscriptEntry) => void;
  onState?: (state: SessionState) => void;
}

export function subscribeInterview(
  _interviewId: string,
  _handlers: InterviewHandlers,
): InterviewSubscription {
  return { unsubscribe: () => {} };
}
