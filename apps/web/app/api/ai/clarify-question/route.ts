// OWNER: Person 4 (AI / Marketing)
// Surface: web — Next.js Route Handler (server only)
// Do not edit without coordinating in group chat.

import { NextResponse } from 'next/server';

// TODO(Person 4): validate body { question: string }
// TODO(Person 4): call OpenAI with CLARIFY_QUESTION_PROMPT from @quietspace/shared-lib
// TODO(Person 4): return { clarified: string }
// TODO(Person 4): rate-limit per session id

export async function POST(_req: Request) {
  return NextResponse.json({ clarified: '' });
}
