// OWNER: Person 4 (Design system / Marketing)
// Surface: SHARED — consumed by Tailwind config (web) and inline styles (extension overlay)
// Do not edit without coordinating in group chat.

export const tokens = {
  color: {
    background: '#faf7f2',
    surface: '#ffffff',
    surfaceMuted: '#eef2ed',
    border: '#e1e5dd',
    text: '#2a2d33',
    textMuted: '#6b7280',
    accent: '#5b8b6f',
    accentSoft: '#a6c4b1',
    accentMuted: '#e3efe7',
    danger: '#d97a6c',
    warning: '#e0b072',
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '20px',
    pill: '999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
  },
  font: {
    sans: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  shadow: {
    sm: '0 1px 2px rgba(20, 30, 25, 0.06)',
    md: '0 4px 12px rgba(20, 30, 25, 0.08)',
    lg: '0 12px 32px rgba(20, 30, 25, 0.12)',
  },
} as const;

export type Tokens = typeof tokens;
