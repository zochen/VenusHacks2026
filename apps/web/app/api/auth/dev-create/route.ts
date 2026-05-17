import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  // Only allow in development or when explicit flag is set
  const allowDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEV_BYPASS_CONFIRM === 'true';
  if (!allowDev) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const body = await request.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Supabase service key not configured' }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    } as any);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
