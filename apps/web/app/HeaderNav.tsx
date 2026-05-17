'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { createBrowserClient } from '@supabase/ssr';

export function HeaderNav() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // try client-side sign out first to update local session immediately
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        const supabase = createBrowserClient(url, key);
        await supabase.auth.signOut();
      }
    } catch (err) {
      // ignore client-side signout errors and fall back to server endpoint
    }

    // Ensure server-side cookies are cleared as well
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      // ignore
    }

    // Navigate to login
    router.push('/auth/login');
  };

  if (isLoading) {
    return <nav style={{ display: 'flex', gap: 24, fontSize: 14 }} />;
  }

  return (
    <nav style={{ display: 'flex', gap: 24, fontSize: 14, alignItems: 'center' }}>
      {user ? (
        <>
          <Link href="/download-extension" style={{ color: '#2a2d33', textDecoration: 'none', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(18,50,68,0.06)' }}>
            Download extension
          </Link>
          <Link href="/onboarding" style={{ color: '#2a2d33' }}>
            Onboarding
          </Link>
          <Link href="/candidate/dashboard" style={{ color: '#2a2d33' }}>
            My dashboard
          </Link>
          <Link href="/candidate/interview" style={{ color: '#2a2d33' }}>
            Simulator
          </Link>
          <Link href="/interviewer/dashboard" style={{ color: '#2a2d33' }}>
            Interviewer
          </Link>
          <button
            onClick={handleLogout}
            style={{
              color: '#2a2d33',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              textDecoration: 'underline',
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link href="/download-extension" style={{ color: '#2a2d33', textDecoration: 'none', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(18,50,68,0.06)' }}>
            Download extension
          </Link>
          <Link href="/auth/login" style={{ color: '#2a2d33' }}>
            Log In
          </Link>
          <Link
            href="/auth/signup"
            style={{
              color: '#ffffff',
              backgroundColor: '#2a2d33',
              padding: '8px 16px',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
}
