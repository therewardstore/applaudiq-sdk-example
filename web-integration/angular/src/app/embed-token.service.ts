import { Injectable } from '@angular/core';

/** Auto-login token state: minting → ready, or needs-server if no backend is wired. */
export type EmbedTokenState =
  | { status: 'loading' }
  | { status: 'ready'; token: string }
  | { status: 'needs-server'; error?: string };

// Auto-login: your SERVER mints a one-time token (it holds the aiq_embed_ secret).
// See MINTING.md. Wire this to YOUR backend mint endpoint.
async function getEmbedToken(): Promise<string> {
  // Demo: /api/mint is proxied to the dev mint server (web-integration/tools/mint-server.mjs).
  const res = await fetch('/api/mint', { method: 'POST' });
  if (!res.ok) throw new Error('mint failed (' + res.status + ')');
  const { embedToken } = (await res.json()) as { embedToken: string };
  return embedToken;
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
