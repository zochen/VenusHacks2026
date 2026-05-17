'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      // Redirect to login with success message
      router.push('/auth/login?success=signup');
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '60px auto', padding: '32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Create Account</h1>

      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            Password (minimum 8 characters)
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

        <div>
          <label
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14, textAlign: 'center', color: '#6b7280' }}>
        Already have an account?{' '}
        <Link
          href="/auth/login"
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Log in
        </Link>
      </p>
    </main>
  );
}
