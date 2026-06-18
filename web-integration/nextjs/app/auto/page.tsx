'use client';

import { EmbedView } from '../components/EmbedView';

// Auto-login: your SERVER mints a one-time token (it holds the aiq_embed_ secret).
// Here that server is the Next.js route at app/api/mint/route.ts. Hand the SDK a
// fetcher — that's all the client does. If the mint fails (e.g. the employee isn't
// set up), the embedded Applaud IQ portal shows the error itself; the client renders
// no error UI.
async function getEmbedToken(): Promise<string> {
  const res = await fetch('/api/mint', { method: 'POST' });
  if (!res.ok) throw new Error('mint failed (' + res.status + ')');
  const { embedToken } = (await res.json()) as { embedToken: string };
  return embedToken;
}

/** Auto-login route — the SDK mints via getToken, then renders the embed signed in. */
export default function AutoLogin() {
  return (
    <EmbedView
      title="Auto-login"
      what="Signed in silently with a server-minted token."
      mode="auto"
      getToken={getEmbedToken}
    />
  );
}
