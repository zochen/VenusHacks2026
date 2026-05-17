'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';

export function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [animKey, setAnimKey] = React.useState(0);
  const previous = React.useRef(pathname);

  // Bump key only AFTER hydration when the route actually changes — never on
  // initial render, so the server-rendered tree matches the first client tree.
  React.useEffect(() => {
    if (previous.current !== pathname) {
      previous.current = pathname;
      setAnimKey((k) => k + 1);
    }
  }, [pathname]);

  return (
    <div className="capy-page-fade" key={animKey}>
      {children}
    </div>
  );
}
