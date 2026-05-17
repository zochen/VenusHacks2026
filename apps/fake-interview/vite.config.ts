import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: { port: 5174, host: true },
  base: '/demo/',
  build: {
    outDir: path.resolve(__dirname, '../web/public/demo'),
    emptyOutDir: true,
  },
});
