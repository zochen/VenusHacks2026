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
        <AuthProvider>
          <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            borderBottom: '1px solid #e6eef6',
            background: '#caf2f7ff',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 0, fontWeight: 700, fontSize: 18, color: '#123244', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: '64px' }}>
              <img className="site-logo-left" src="/capy_connect_capybara.png" alt="Capybara" />
              <img className="site-logo-right" src="/capy_connect_writing.png" alt="Writing capybara" />
            </div>
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>CapyConnect</span>
          </Link>

          <HeaderNav />
        </header>
          <style>{`
          .site-logo-left, .site-logo-right { height: 64px; width: auto; object-fit: cover; display: block; border-radius: 0; margin: 0; }
          /* remove extra spacing so logos fill header height and stay centered */
          header { align-items: center; }
          /* ensure the two images sit flush with no gap */
          .site-logo-left { margin-right: 0; }
          @media (min-width: 1100px) { .site-logo-left, .site-logo-right { height: 96px; } }
          @media (max-width: 900px) { .site-logo-left, .site-logo-right { height: 56px; } }
          @media (max-width: 520px) { .site-logo-left, .site-logo-right { height: 40px; } }
          @media (max-width: 420px) { header { padding: 12px 16px; } }
        `}</style>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
