// OWNER: Person 4 (Design system)
// Surface: SHARED — web + extension
// Do not edit without coordinating in group chat.

import * as React from 'react';
import { tokens } from '../tokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
}

export function Card({ padding = 'md', elevated = false, style, children, ...rest }: CardProps) {
  const pad = padding === 'sm' ? tokens.spacing.md : padding === 'lg' ? tokens.spacing.xl : tokens.spacing.lg;
  const merged: React.CSSProperties = {
    background: tokens.color.surface,
    border: `1px solid ${tokens.color.border}`,
    borderRadius: tokens.radius.lg,
    padding: pad,
    boxShadow: elevated ? tokens.shadow.md : tokens.shadow.sm,
    ...style,
  };
  return (
    <div {...rest} style={merged}>
      {children}
    </div>
  );
}

export default Card;
