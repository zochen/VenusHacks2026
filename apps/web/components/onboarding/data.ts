// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web — shared between /onboarding and /candidate/profile
// Do not edit without coordinating in group chat.

import type { CommunicationStyle } from '@quietspace/shared-types';

export type Feature = {
  id: string;
  label: string;
  group?: string;
  hint?: string;
};

export type ColumnKey = 'selected' | 'available';

export type ProfileInfo = {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
  location: string;
  avatarDataUrl: string;
  // Optional fields for interviewers
  company?: string;
  companyRole?: string;
};

export const EMPTY_INFO: ProfileInfo = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
  birthdate: '',
  location: '',
  avatarDataUrl: '',
  company: '',
  companyRole: '',
};

export const ALL_FEATURES: Feature[] = [
  { id: 'captions-standard', label: 'Standard captions', group: 'captions', hint: 'Live captions overlaid on the interviewer video' },
  { id: 'captions-high-contrast', label: 'High-contrast captions', group: 'captions', hint: 'Bright yellow on black for max legibility' },
  { id: 'captions-large', label: 'Large-text captions', group: 'captions', hint: '24pt caption text' },
  { id: 'video-small', label: 'Small interviewer video', group: 'video', hint: 'Picture-in-picture corner' },
  { id: 'video-medium', label: 'Medium interviewer video', group: 'video', hint: 'Standard centered video' },
  { id: 'video-large', label: 'Large interviewer video', group: 'video', hint: 'Fills the viewport' },
  { id: 'text-standard', label: 'Standard question text', group: 'text', hint: '20pt question display' },
  { id: 'text-larger', label: 'Larger question text', group: 'text', hint: '24pt question display' },
  { id: 'text-largest', label: 'Largest question text', group: 'text', hint: '28pt question display' },
  { id: 'companion', label: 'Comfort companion', hint: 'Breathing capybara in the corner' },
  { id: 'pacing-extra-time', label: 'Extra response time', hint: 'Pads timers by 30% across the session' },
  { id: 'pacing-ai-clarify', label: 'AI-clarified questions', hint: 'Rewrites idiomatic questions for clarity' },
  { id: 'pacing-pause-warnings', label: 'Pause warnings for interviewer', hint: 'Nudges interviewer to pause longer between questions' },
];

export const BUNDLE_FEATURES: Record<CommunicationStyle, string[]> = {
  default: ['captions-standard', 'video-medium', 'text-standard'],
  relaxed: ['captions-standard', 'video-medium', 'text-standard', 'companion', 'pacing-extra-time', 'pacing-pause-warnings'],
  focus: ['captions-high-contrast', 'video-small', 'text-larger', 'pacing-ai-clarify'],
};

export const BUNDLES: {
  id: CommunicationStyle;
  title: string;
  subtitle: string;
  icon: string;
  details: string;
}[] = [
  {
    id: 'default',
    title: 'Default',
    subtitle: 'Standard pacing, captions on.',
    icon: '🌱',
    details: 'A typical interview rhythm with live captions — a good baseline if you have no specific preferences.',
  },
  {
    id: 'relaxed',
    title: 'Relaxed',
    subtitle: 'Extra processing time, comfort companion.',
    icon: '🌿',
    details: 'Interviewer is nudged to pause longer. The breathing capybara stays visible throughout.',
  },
  {
    id: 'focus',
    title: 'Focus',
    subtitle: 'High-contrast captions, larger text, minimal motion.',
    icon: '🎯',
    details: 'Reduces visual noise. AI clarification turns on by default to remove idiomatic phrasing.',
  },
];

export function derivePreferencesFromFeatures(features: string[]) {
  return {
    captions_enabled: features.some((f) => f.startsWith('captions-')),
    comfort_companion_enabled: features.includes('companion'),
    font_scale: features.includes('text-largest') ? 130 : features.includes('text-larger') ? 115 : 100,
    selected_features: features,
  };
}
