"use client";
import React from 'react';
import { Overlay } from '@quietspace/shared-ui';

export default function DemoPage() {
  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>CapyConnect Demo — Fake Zoom</h1>
          <p style={{ color: '#9ca3af' }}>This page renders a fake interview stage; the overlay UI below is the shared component used by the extension.</p>

          <div style={{ marginTop: 28, display: 'flex', gap: 24 }}>
            <div style={{ flex: 1, background: '#0b1220', borderRadius: 12, padding: 16 }}>
              <div style={{ height: 320, background: '#0b1b2b', borderRadius: 8 }}>
                {/* Fake video stage */}
              </div>
            </div>

            <div style={{ width: 320 }}>
              {/* Place overlay root — overlay mounts itself as fixed elements, but importing the component
                  here ensures hydration and shared code usage in the demo environment. */}
              <Overlay />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
