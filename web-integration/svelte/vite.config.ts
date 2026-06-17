import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5177,
    // Demo only: forward auto-login mints to the shared dev mint server (tools/mint-server.mjs).
    proxy: { '/api/mint': { target: 'http://localhost:8787', changeOrigin: true, rewrite: () => '/mint' } },
  },
});
