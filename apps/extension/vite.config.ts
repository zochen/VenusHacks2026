// OWNER: Person 3 (Backend / Integrations) — build infra; coordinate before changing
// Surface: extension
// Do not edit without coordinating in group chat.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json' with { type: 'json' };

export default defineConfig({
  plugins: [react(), crx({ manifest: manifest as any })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
