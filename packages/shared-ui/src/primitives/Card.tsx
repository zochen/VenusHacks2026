// OWNER: Person 4 (Design system)
// Surface: SHARED — web + extension
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 4): padding scale + optional title slot
// TODO(Person 4): elevated vs flat variants
// TODO(Person 4): make sure it composes inside the extension overlay panel

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ children, ...rest }: CardProps) {
  return <div {...rest}>{children}</div>;
}

export default Card;
