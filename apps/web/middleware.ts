import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/callback', '/'];

// Routes that require authentication
const protectedRoutes = ['/candidate', '/interviewer'];

export async function middleware(request: NextRequest) {
  // Skip if environment variables aren't set (build time or misconfiguration)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          response.cookies.set(name, value, options);
        },
        delete: (name: string, options: any) => {
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        },
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

  // Enforce role-based access: read role from cookies (set by onboarding or client profile save)
  const roleCookie = request.cookies.get('capyconnect.role')?.value ?? null;
  // If user is a candidate but trying to access interviewer routes, redirect
  if (roleCookie === 'candidate' && pathname.startsWith('/interviewer')) {
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }
  // If user is an interviewer but trying to access candidate routes, redirect
  if (roleCookie === 'interviewer' && pathname.startsWith('/candidate')) {
    return NextResponse.redirect(new URL('/interviewer/dashboard', request.url));
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (session && pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }

  if (session && pathname.startsWith('/auth/signup')) {
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }

  return response;
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
