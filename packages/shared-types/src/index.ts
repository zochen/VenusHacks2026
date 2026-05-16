// OWNER: Person 3 (Backend / Integrations)
// Surface: SHARED — used by web + extension
// Do not edit without coordinating in group chat — this package is load-bearing for everyone.

// TODO(Person 3): finalize User shape once Supabase auth schema is locked in
// TODO(Person 3): decide whether Interview includes a denormalized question list or a join
// TODO(Person 3): align ExtensionMessage variants with whatever messaging.ts ends up needing
// TODO(Person 3): add Zod schemas (or similar) for runtime validation at API + message boundaries

export type CommunicationStyle = 'default' | 'relaxed' | 'focus';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  preferences?: Preferences;
}

export interface Preferences {
  communicationStyle: CommunicationStyle;
  captionsEnabled: boolean;
  comfortCompanionEnabled: boolean;
  fontScale: number;
}

export interface Question {
  id: string;
  prompt: string;
  notes?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  interviewerId: string;
  scheduledAt: string;
  questions: Question[];
  status: 'scheduled' | 'live' | 'completed';
}

export type SessionState =
  | { kind: 'idle' }
  | { kind: 'connecting' }
  | { kind: 'live'; interviewId: string; startedAt: string }
  | { kind: 'paused'; interviewId: string }
  | { kind: 'ended'; interviewId: string };

export interface TranscriptEntry {
  id: string;
  speaker: 'candidate' | 'interviewer' | 'unknown';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export type ExtensionMessage =
  | { type: 'OVERLAY_MOUNTED'; tabId?: number }
  | { type: 'TRANSCRIPT_APPEND'; entry: TranscriptEntry }
  | { type: 'PREFS_UPDATED'; preferences: Preferences }
  | { type: 'AUTH_TOKEN_SET'; token: string }
  | { type: 'AUTH_TOKEN_CLEARED' }
  | { type: 'REQUEST_CLARIFY'; questionText: string }
  | { type: 'CLARIFY_RESULT'; original: string; clarified: string };

const _default = {};
export default _default;
