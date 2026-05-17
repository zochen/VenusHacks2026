import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/callback', '/'];

// Routes that require authentication
const protectedRoutes = ['/candidate', '/interviewer', '/onboarding'];

export async function middleware(request: NextRequest) {
  // Skip if environment variables aren't set (build time or misconfiguration)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  // Get cookies from the request
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        delete: (name: string) => cookieStore.delete(name),
      },
    }
  );

  // Refresh session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If it's a protected route and there's no session, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (session && pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }

  if (session && pathname.startsWith('/auth/signup')) {
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
