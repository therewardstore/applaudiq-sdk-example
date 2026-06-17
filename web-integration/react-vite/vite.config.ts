import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Demo only: forward auto-login mints to the shared dev mint server (tools/mint-server.mjs).
    proxy: { '/api/mint': { target: 'http://localhost:8787', changeOrigin: true, rewrite: () => '/mint' } },
  },
});
