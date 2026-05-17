'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';

export function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="capy-page-fade">
      {children}
    </div>
  );
}
