import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5175,
    // Demo only: forward auto-login mints to the shared dev mint server (tools/mint-server.mjs).
    proxy: { '/api/mint': { target: 'http://localhost:8787', changeOrigin: true, rewrite: () => '/mint' } },
  },
});
