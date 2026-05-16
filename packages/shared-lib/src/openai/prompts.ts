// OWNER: Person 4 (AI / Marketing)
// Surface: server-only (referenced by Next.js /api/ai routes).
// Do not edit without coordinating in group chat.

// TODO(Person 4): iterate on these with real interview questions before the demo
// TODO(Person 4): add few-shot examples covering clarifying ambiguous wording
// TODO(Person 4): tune output format (JSON vs plain text) per route handler
// TODO(Person 4): add a "tone" parameter that maps to the candidate's communication style

export const CLARIFY_QUESTION_PROMPT = `You are an accessibility assistant in a technical interview.
Rewrite the interviewer's question to be clearer and less idiomatic for the candidate,
without changing the underlying technical intent.
Return only the rewritten question.`;

export const DETECT_FOLLOWUP_PROMPT = `You are listening to a technical interview transcript.
Decide whether the latest interviewer utterance is a follow-up to the previous question
or a brand-new question. Respond with JSON: { "isFollowup": boolean, "reason": string }.`;
