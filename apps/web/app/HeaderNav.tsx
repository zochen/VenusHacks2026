'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';

export function HeaderNav() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  if (isLoading) {
    return <nav style={{ display: 'flex', gap: 24, fontSize: 14 }} />;
  }

  return (
    <nav style={{ display: 'flex', gap: 24, fontSize: 14, alignItems: 'center' }}>
      {user ? (
        <>
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
