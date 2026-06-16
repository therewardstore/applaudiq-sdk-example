import { Injectable } from '@angular/core';

/** Auto-login token state: minting → ready, or needs-server if no backend is wired. */
export type EmbedTokenState =
  | { status: 'loading' }
  | { status: 'ready'; token: string }
  | { status: 'needs-server'; error?: string };

// Auto-login: your SERVER mints a one-time token (it holds the aiq_embed_ secret).
// See MINTING.md. Wire this to YOUR backend mint endpoint.
async function getEmbedToken(): Promise<string> {
  // TODO: replace with a call to your backend, e.g.:
  //   const res = await fetch('/api/mint', { method: 'POST' });
  //   const { embedToken } = await res.json();
  //   return embedToken;
  throw new Error('Wire getEmbedToken() to your /api/mint endpoint (see MINTING.md)');
}

/** Mints a one-time embed token and resolves to a loading/ready/needs-server state. */
@Injectable({ providedIn: 'root' })
export class EmbedTokenService {
  async mint(): Promise<EmbedTokenState> {
    try {
      const token = await getEmbedToken();
      return { status: 'ready', token };
    } catch (e) {
      return { status: 'needs-server', error: e instanceof Error ? e.message : undefined };
    }
  }
}
