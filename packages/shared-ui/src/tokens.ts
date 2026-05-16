// OWNER: Person 4 (Design system / Marketing)
// Surface: SHARED — consumed by Tailwind config (web) and inline styles (extension overlay)
// Do not edit without coordinating in group chat.

// TODO(Person 4): finalize the palette with the design lead — these are placeholders
// TODO(Person 4): map these into apps/web/tailwind.config.ts via theme.extend
// TODO(Person 4): decide on type scale + line heights for the 'focus' communication style
// TODO(Person 4): export CSS variable strings for the extension overlay (shadow DOM friendly)

export const tokens = {
  color: {
    background: '#0f1115',
    surface: '#1a1d24',
    surfaceMuted: '#242833',
    text: '#f5f6f8',
    textMuted: '#9aa0ad',
    accent: '#7cc4a0',
    accentMuted: '#3a6d57',
    danger: '#e57373',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '32px',
  },
  font: {
    sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
} as const;

export type Tokens = typeof tokens;
