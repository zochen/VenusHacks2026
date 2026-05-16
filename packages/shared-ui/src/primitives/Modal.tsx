// OWNER: Person 4 (Design system)
// Surface: SHARED — web + extension
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 4): focus trap + ESC to close
// TODO(Person 4): portal target (document.body on web; shadow root on extension)
// TODO(Person 4): backdrop click behavior + scroll lock
// TODO(Person 4): announce open/close via aria-live

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function Modal({ open, children }: ModalProps) {
  if (!open) return null;
  return <div role="dialog" aria-modal="true">{children}</div>;
}

export default Modal;
