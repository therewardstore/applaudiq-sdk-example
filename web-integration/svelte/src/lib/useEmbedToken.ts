import { readable } from 'svelte/store';

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

/**
 * A store that starts 'loading', mints a one-time embed token, then resolves to
 * 'ready' (with the token) or 'needs-server' if no backend is wired yet.
 */
export function embedToken() {
  return readable<EmbedTokenState>({ status: 'loading' }, (set) => {
    let active = true;
    getEmbedToken()
      .then((token) => active && set({ status: 'ready', token }))
      .catch(
        (e) =>
          active &&
          set({ status: 'needs-server', error: e instanceof Error ? e.message : undefined }),
      );
    return () => {
      active = false;
    };
  });
}
