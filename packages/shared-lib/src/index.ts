// OWNER: Person 3 (Supabase) / Person 4 (OpenAI)
// Surface: SHARED — web + extension
// Do not edit without coordinating in group chat.

export { createBrowserSupabaseClient, createServerSupabaseClient } from './supabase/client';
export { subscribeInterview } from './supabase/realtime';
export { createOpenAIClient } from './openai/client';
export { CLARIFY_QUESTION_PROMPT, DETECT_FOLLOWUP_PROMPT } from './openai/prompts';
