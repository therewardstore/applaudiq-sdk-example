import { useEffect, useState } from 'react';

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

/** Mints a one-time embed token on mount and tracks loading / ready / needs-server. */
export function useEmbedToken(): EmbedTokenState {
  const [state, setState] = useState<EmbedTokenState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getEmbedToken()
      .then((token) => active && setState({ status: 'ready', token }))
      .catch((e) =>
        active && setState({ status: 'needs-server', error: e instanceof Error ? e.message : undefined }),
      );
    return () => {
      active = false;
    };
  }, []);

  return state;
}
