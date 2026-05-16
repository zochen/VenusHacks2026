// OWNER: Person 4 (Marketing) — root layout is shared infra; coordinate before changing
// Surface: web
// Do not edit without coordinating in group chat.

import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

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
            background: '#ffffff',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, color: '#123244' }}>
            <span style={{ fontSize: 22 }}>🪼</span>
            <span style={{ marginLeft: 6 }}>CapyConnect</span>
          </Link>

          <nav style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <a href="/download-extension" style={{ fontSize: 14, color: '#123244', textDecoration: 'none' }}>Download extension</a>
            <Link href="/onboarding" style={{ fontSize: 14, color: '#123244', textDecoration: 'none' }}>Sign up</Link>
            <Link href="/" style={{ fontSize: 14, color: '#123244', textDecoration: 'none' }}>About</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
