// OWNER: Person 4 (Marketing) — root layout is shared infra; coordinate before changing
// Surface: web
// Do not edit without coordinating in group chat.

import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AuthProvider } from '../lib/AuthContext';
import { HeaderNav } from './HeaderNav';

export const metadata: Metadata = {
  title: 'CapyConnect — Accessible technical interviews',
  description: 'Accessibility platform that adapts technical interviews to how candidates communicate best.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            borderBottom: '1px solid #e6eef6',
            background: '#d0ddf0ff',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700, fontSize: 18, color: '#123244', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img className="site-logo" src="/CapyConnect_logo.png" alt="CapyConnect" />
            </div>
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>CapyConnect</span>
          </Link>

          <nav style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <a href="/download-extension" style={{ fontSize: 14, color: '#123244', textDecoration: 'none' }}>Download extension</a>
            <Link href="/onboarding" style={{ fontSize: 14, color: '#123244', textDecoration: 'none' }}>Sign up</Link>
            <Link href="/" style={{ fontSize: 14, color: '#123244', textDecoration: 'none' }}>About</Link>
          </nav>
        </header>
        <style>{`
          .site-logo { width: 96px; height: 96px; object-fit: contain; border-radius: 10px; display: block; }
          @media (max-width: 900px) { .site-logo { width: 72px; height: 72px; } }
          @media (max-width: 480px) { .site-logo { width: 48px; height: 48px; } }
          @media (max-width: 420px) { header { padding: 12px 16px; } }
        `}</style>
        {children}
      </body>
    </html>
  );
}
