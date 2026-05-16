// OWNER: Person 4 (Marketing) — root layout is shared infra; coordinate before changing
// Surface: web
// Do not edit without coordinating in group chat.

import './globals.css';
import type { Metadata } from 'next';

// TODO(Person 4): real metadata + OG image
// TODO(Person 4): theme provider (light/dark + reduced motion)

export const metadata: Metadata = {
  title: 'QuietSpace',
  description: 'Accessibility platform for technical interviews.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
