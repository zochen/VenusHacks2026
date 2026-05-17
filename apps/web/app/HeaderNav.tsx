'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

  React.useEffect(() => {
    const loadRole = async () => {
      if (!user || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return;
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!error && (data?.role === 'candidate' || data?.role === 'interviewer')) {
        setRole(data.role);
        try {
          localStorage.setItem('capyconnect.role', data.role);
        } catch {}
      }
    };

    void loadRole();
  }, [user]);

  // read pathname so we can prefer the dashboard context when deciding
  // which profile link to show (this ensures the header on each dashboard
  // points to its matching profile page even if localStorage role is unset)
  const pathname = usePathname();

  const inferredRoleFromPath = React.useMemo(() => {
    try {
      if (!pathname) return null;
      if (pathname.startsWith('/interviewer')) return 'interviewer';
      if (pathname.startsWith('/candidate')) return 'candidate';
      return null;
    } catch {
      return null;
    }
  }, [pathname]);

  // Listen for profile editing events from profile pages so the header can
  // switch the Profile button into a Save button that triggers the form.
  const [profileIsEditing, setProfileIsEditing] = React.useState(false);

  React.useEffect(() => {
    function onEditing(e: Event) {
      try {
        // custom event with detail { isEditing: boolean }
        const ev = e as CustomEvent<{ isEditing: boolean }>;
        setProfileIsEditing(Boolean(ev.detail?.isEditing));
      } catch {
        setProfileIsEditing(false);
      }
    }
    window.addEventListener('capy:profileEditing', onEditing as EventListener);
    return () => {
      window.removeEventListener('capy:profileEditing', onEditing as EventListener);
    };
  }, []);

  const handleLogout = async () => {
    // try client-side sign out first to update local session immediately
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
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

  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('capy.theme');
      const initial: 'light' | 'dark' = saved === 'dark' ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    } catch {}
  }, []);

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
          className="capy-btn"
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
        className="capy-btn"
        onClick={onClick}
        style={{ ...base, ...hoverStyle, border: 'none', background: '#bfeaf0' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </button>
    );
  }

  const effectiveRole = inferredRoleFromPath ?? role ?? 'candidate';
  const dashboardHref = effectiveRole === 'interviewer' ? '/interviewer/dashboard' : '/candidate/dashboard';
  const profileHref = effectiveRole === 'interviewer' ? '/interviewer/profile' : '/candidate/profile';

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('capy.theme', next); } catch {}
  };

  return (
    <nav style={{ display: 'flex', gap: 12, fontSize: 14, alignItems: 'center' }}>
      <StyledAction onClick={toggleTheme}>{theme === 'dark' ? '☀ Light' : '🌙 Dark'}</StyledAction>
      {user ? (
        <>
          <StyledAction href={dashboardHref}>My Dashboard</StyledAction>
          <StyledAction href="/download-extension">Download Extension</StyledAction>
          {profileIsEditing ? (
            <StyledAction
              onClick={() => {
                try {
                  // call global save handler registered by the profile page
                  (window as any).capyProfileSave?.();
                } catch {
                  // fall back to navigating to profile
                  window.location.href = profileHref;
                }
              }}
            >
              Save
            </StyledAction>
          ) : (
            <StyledAction href={profileHref}>Profile</StyledAction>
          )}
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
