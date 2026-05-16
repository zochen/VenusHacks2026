// OWNER: Person 3 (Backend / Integrations)
// Surface: web — Next.js Route Handler (server only)
// Do not edit without coordinating in group chat.

import { NextResponse } from 'next/server';

// TODO(Person 3): GET — return current SessionState for the authed user's active interview
// TODO(Person 3): POST — transition SessionState (start / pause / end), broadcast via Supabase Realtime
// TODO(Person 3): auth check via Supabase server client; reject if no session
// TODO(Person 3): emit transcript persistence side-effect on 'end'

export async function GET() {
  return NextResponse.json({ kind: 'idle' });
}

export async function POST(_req: Request) {
  return NextResponse.json({ ok: true });
}
