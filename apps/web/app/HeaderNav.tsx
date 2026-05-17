'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { createBrowserClient } from '@supabase/ssr';

export function HeaderNav() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [role, setRole] = React.useState<'candidate' | 'interviewer' | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('capyconnect.role');
      setRole((raw as any) ?? null);
    } catch {}
  }, []);

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
    return <nav style={{ display: 'flex', gap: 16, fontSize: 14 }} />;
  }

  function StyledAction({ href, onClick, children }: { href?: string; onClick?: () => void; children: React.ReactNode }) {
    const [hover, setHover] = React.useState(false);
    const base: React.CSSProperties = {
      padding: '8px 14px',
      borderRadius: 12,
      background: '#bfeaf0', // slightly darker than header '#caf2f7ff'
      color: '#123244',
      textDecoration: 'none',
      border: '1px solid rgba(18,50,68,0.06)',
      transition: 'box-shadow 140ms ease, transform 140ms ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600,
    };
    const hoverStyle: React.CSSProperties = hover
      ? { boxShadow: '0 8px 20px rgba(17, 51, 68, 0.12)', transform: 'translateY(-2px)' }
      : {};

    if (href) {
      return (
        <Link
          href={href}
          style={{ ...base, ...hoverStyle }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        style={{ ...base, ...hoverStyle, border: 'none', background: '#bfeaf0' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </button>
    );
  }

  const dashboardHref = role === 'interviewer' ? '/interviewer/dashboard' : '/candidate/dashboard';
  const profileHref = role === 'interviewer' ? '/interviewer/dashboard' : '/candidate/profile';

  return (
    <nav style={{ display: 'flex', gap: 12, fontSize: 14, alignItems: 'center' }}>
      {user ? (
        <>
          <StyledAction href={dashboardHref}>My Dashboard</StyledAction>
          <StyledAction href="/download-extension">Download Extension</StyledAction>
          <StyledAction href={profileHref}>Profile</StyledAction>
          <StyledAction onClick={handleLogout}>Log Out</StyledAction>
        </>
      ) : (
        <>
          <StyledAction href="/download-extension">Download Extension</StyledAction>
          <StyledAction href="/auth/login">Log In</StyledAction>
          <StyledAction href="/auth/signup">Sign Up</StyledAction>
        </>
      )}
    </nav>
  );
}
