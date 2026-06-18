import { Component } from '@angular/core';

import { DEMO_EMAIL } from './config';
import { EmbedViewComponent } from './embed-view.component';

// Auto-login: mint a one-time token, then hand it to the SDK. That's the only client
// responsibility — if the mint fails (e.g. the employee isn't set up), the embedded
// Applaud IQ portal shows the error itself; this app renders no error UI.
//
// ⚠️ DEMO/TEST ONLY. For local testing the Angular dev server proxies /api/mint → the
//    gateway and injects your aiq_embed_ secret (see proxy.conf.js), so the secret never
//    reaches the browser. The Angular CLI does NOT auto-load .env, so run the dev server
//    with the secret on the command line:
//      APPLAUDIQ_SECRET=aiq_embed_… APPLAUDIQ_API_BASE=http://localhost:8000 npm start
//    In PRODUCTION your BACKEND must call POST /api/v1/embed/sessions with the secret and
//    derive the employee from its OWN session — never the browser, never a client-supplied
//    identity. See the nextjs example's app/api/mint/route.ts for the real backend pattern.
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
@Component({
  selector: 'app-auto-login',
  standalone: true,
  imports: [EmbedViewComponent],
  template: `
    <app-embed-view
      title="Auto-login"
      what="Signed in silently with a server-minted token."
      mode="auto"
      [getToken]="getToken"
    />
  `,
})
export class AutoLoginComponent {
  /** Hand the SDK the fetcher; it mints and relays any error into the portal. */
  getToken = getEmbedToken;
}
