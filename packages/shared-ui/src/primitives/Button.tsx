// OWNER: Person 4 (Design system)
// Surface: SHARED — web + extension
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 4): variants (primary / secondary / ghost / danger)
// TODO(Person 4): size scale (sm / md / lg) aligned with tokens.spacing
// TODO(Person 4): accessible focus ring that works inside the extension shadow DOM
// TODO(Person 4): loading + disabled states

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  return (
    <button data-variant={variant} {...rest}>
      {children}
    </button>
  );
}

export default Button;
