// OWNER: Person 4 (Design system / Marketing)
// Surface: SHARED — consumed by Tailwind config (web) and inline styles (extension overlay)
// Do not edit without coordinating in group chat.

export const tokens = {
  color: {
    // Calming blues and beach sand tones
    background: '#f7fbff', // very light blue
    surface: '#ffffff',
    surfaceMuted: '#f1f8ff',
    border: '#e6eef6',
    text: '#123244', // deep blue-gray
    textMuted: '#56778d',
    accent: '#4a90e2', // calm ocean blue
    accentSoft: '#bcdff8',
    accentMuted: '#eaf6ff',
    danger: '#e07a6c',
    warning: '#f0cfae', // sand tone for cautions
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
