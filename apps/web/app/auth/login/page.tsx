'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasValidSupabaseConfig = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('localhost:3000') &&
    !supabaseAnonKey.includes('placeholder')
  );

  const supabase = hasValidSupabaseConfig
    ? createBrowserClient(supabaseUrl!, supabaseAnonKey!)
    : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!supabase) {
      setError('Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

  // Redirect to dashboard after login
  router.push('/candidate/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '60px auto', padding: '32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Log In</h1>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 14,
              border: '1px solid #d1d5db',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 14,
              border: '1px solid #d1d5db',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: 12,
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 16px',
            backgroundColor: '#2a2d33',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14, textAlign: 'center', color: '#6b7280' }}>
        Don't have an account?{' '}
        <Link
          href="/auth/signup"
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Sign up
        </Link>
      </p>
    </main>
  );
}
