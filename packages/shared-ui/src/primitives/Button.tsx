// OWNER: Person 4 (Design system)
// Surface: SHARED — web + extension
// Do not edit without coordinating in group chat.

import * as React from 'react';
import { tokens } from '../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 13 },
  md: { padding: '10px 18px', fontSize: 15 },
  lg: { padding: '14px 24px', fontSize: 17 },
};

function variantStyles(variant: NonNullable<ButtonProps['variant']>): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return { background: tokens.color.accent, color: '#fff', border: `1px solid ${tokens.color.accent}` };
    case 'secondary':
      return { background: tokens.color.surface, color: tokens.color.text, border: `1px solid ${tokens.color.border}` };
    case 'ghost':
      return { background: 'transparent', color: tokens.color.text, border: '1px solid transparent' };
    case 'danger':
      return { background: tokens.color.danger, color: '#fff', border: `1px solid ${tokens.color.danger}` };
  }
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  children,
  ...rest
}: ButtonProps) {
  const merged: React.CSSProperties = {
    ...sizeStyles[size],
    ...variantStyles(variant),
    borderRadius: tokens.radius.md,
    fontFamily: tokens.font.sans,
    fontWeight: 500,
    cursor: 'pointer',
    width: fullWidth ? '100%' : undefined,
    transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...style,
  };
  return (
    <button {...rest} style={merged}>
      {children}
    </button>
  );
}

export default Button;
