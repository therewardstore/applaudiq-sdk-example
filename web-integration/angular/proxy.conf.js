// DEMO/TEST ONLY. The Angular dev server proxies /api/mint → the gateway's mint endpoint
// and injects your aiq_embed_ SECRET here (server-side — it never reaches the browser
// bundle). This lets you test auto-login locally with no backend. In PRODUCTION your own
// backend mints the token (see the nextjs example's app/api/mint/route.ts).
//
// Angular's CLI does NOT auto-load .env files — pass the secret on the dev command:
//   APPLAUDIQ_SECRET=aiq_embed_… APPLAUDIQ_API_BASE=http://localhost:8000 npm start
// (See .env.example for the values; copy it to .env.local for reference — it is gitignored.)
//
// NOTE: Angular's modern `ng serve` (application builder) runs on **Vite**, so the header
// injection uses Vite's `configure(proxy)` hook (NOT http-proxy-middleware's `onProxyReq`,
// which Angular's translation layer drops).
module.exports = {
  '/api/mint': {
    target: process.env.APPLAUDIQ_API_BASE,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/mint/, '/api/v1/embed/sessions'),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        if (process.env.APPLAUDIQ_SECRET) {
          proxyReq.setHeader('authorization', 'Bearer ' + process.env.APPLAUDIQ_SECRET);
        }
      });
    },
  },
};
