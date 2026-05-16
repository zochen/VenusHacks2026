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
            borderBottom: '1px solid #e1e5dd',
            background: '#ffffff',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, color: '#2a2d33' }}>
            <span style={{ fontSize: 22 }}>🌿</span> CapyConnect
          </Link>
          <nav style={{ display: 'flex', gap: 24, fontSize: 14 }}>
            <Link href="/onboarding" style={{ color: '#2a2d33' }}>Onboarding</Link>
            <Link href="/candidate/dashboard" style={{ color: '#2a2d33' }}>My dashboard</Link>
            <Link href="/candidate/interview" style={{ color: '#2a2d33' }}>Simulator</Link>
            <Link href="/interviewer/dashboard" style={{ color: '#2a2d33' }}>Interviewer</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
