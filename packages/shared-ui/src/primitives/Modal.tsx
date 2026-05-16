// OWNER: Person 4 (Design system)
// Surface: SHARED — web + extension
// Do not edit without coordinating in group chat.

import * as React from 'react';
import { tokens } from '../tokens';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 30, 25, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: tokens.color.surface,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl,
          maxWidth: 480,
          width: '90%',
          boxShadow: tokens.shadow.lg,
        }}
      >
        {title && <h2 style={{ marginTop: 0, color: tokens.color.text }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
