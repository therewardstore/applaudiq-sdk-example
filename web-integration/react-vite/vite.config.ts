import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// DEMO/TEST ONLY. The dev server proxies /api/mint → the gateway's mint endpoint and
// injects your aiq_embed_ SECRET here (server-side — it never reaches the browser bundle).
// This lets you test auto-login locally with no backend. In PRODUCTION your own backend
// mints the token (see the nextjs example's app/api/mint/route.ts). Put the secret in a
// gitignored .env.local: APPLAUDIQ_SECRET=aiq_embed_… , APPLAUDIQ_API_BASE=http://localhost:8000
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_BASE = env.APPLAUDIQ_API_BASE;
  const SECRET = env.APPLAUDIQ_SECRET || '';
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/mint': {
          target: API_BASE,
          changeOrigin: true,
          rewrite: () => '/api/v1/embed/sessions',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (SECRET) proxyReq.setHeader('authorization', `Bearer ${SECRET}`);
            });
          },
        },
      },
    },
  };
});
