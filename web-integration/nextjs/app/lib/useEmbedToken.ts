'use client';

import { useEffect, useState } from 'react';

export type EmbedTokenState =
  | { status: 'loading' }
  | { status: 'ready'; token: string }
  | { status: 'needs-server'; error?: string };

// Auto-login: your SERVER mints a one-time token (it holds the aiq_embed_ secret).
// Here that server is the Next.js route at app/api/mint/route.ts. See MINTING.md.
async function getEmbedToken(): Promise<string> {
  const res = await fetch('/api/mint', { method: 'POST' });
  if (!res.ok) throw new Error('mint failed (' + res.status + ')');
  const { embedToken } = (await res.json()) as { embedToken: string };
  return embedToken;
}

/** Mints the one-time auto-login token on mount; exposes loading | ready | needs-server. */
export function useEmbedToken(): EmbedTokenState {
  const [state, setState] = useState<EmbedTokenState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getEmbedToken()
      .then((token) => active && setState({ status: 'ready', token }))
      .catch((err) => active && setState({ status: 'needs-server', error: err?.message }));
    return () => {
      active = false;
    };
  }, []);

  return state;
}
