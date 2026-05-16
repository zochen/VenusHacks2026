// OWNER: Person 4 (AI / Marketing)
// Surface: web — Next.js Route Handler (server only)
// Do not edit without coordinating in group chat.

import { NextResponse } from 'next/server';

// TODO(Person 4): validate body { previousQuestion: string, latestUtterance: string }
// TODO(Person 4): call OpenAI with DETECT_FOLLOWUP_PROMPT, parse JSON response
// TODO(Person 4): return { isFollowup: boolean, reason: string }
// TODO(Person 4): cache by hash of inputs to avoid burning tokens during the demo

export async function POST(_req: Request) {
  return NextResponse.json({ isFollowup: false, reason: '' });
}
