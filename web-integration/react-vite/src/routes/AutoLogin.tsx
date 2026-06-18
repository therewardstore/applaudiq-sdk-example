import { DEMO_EMAIL } from '../config';
import { EmbedView } from '../components/EmbedView';

// Auto-login: mint a one-time token, then hand it to the SDK. That's the only client
// responsibility — if the mint fails (e.g. the employee isn't set up), the embedded
// Applaud IQ portal shows the error itself; this app renders no error UI.
//
// ⚠️ DEMO/TEST ONLY. For local testing the Vite dev server proxies /api/mint → the
//    gateway and injects your aiq_embed_ secret (see vite.config.ts), so the secret
//    never reaches the browser. In PRODUCTION your BACKEND must call
//    POST /api/v1/embed/sessions with the secret and derive the employee from its OWN
//    session — never the browser, never a client-supplied identity. See the nextjs
//    example's app/api/mint/route.ts for the real backend pattern.
async function getEmbedToken(): Promise<string> {
  const res = await fetch('/api/mint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employee: { email: DEMO_EMAIL }, autoProvision: true }),
  });
  if (!res.ok) throw new Error('mint failed (' + res.status + ')');
  const body = (await res.json()) as { data?: { embedToken: string }; embedToken?: string };
  const embedToken = body.data?.embedToken ?? body.embedToken; // gateway wraps in { data }
  if (!embedToken) throw new Error('mint returned no token');
  return embedToken;
}

/** Auto-login route — the SDK mints via getToken, then renders the embed signed in. */
export function AutoLogin() {
  return (
    <EmbedView
      title="Auto-login"
      what="Signed in silently with a server-minted token."
      mode="auto"
      getToken={getEmbedToken}
    />
  );
}
