import { onMounted, onUnmounted, ref, type Ref } from 'vue';

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
export function useEmbedToken(): Ref<EmbedTokenState> {
  const state = ref<EmbedTokenState>({ status: 'loading' });
  let active = true;

  onMounted(async () => {
    try {
      const token = await getEmbedToken();
      if (active) state.value = { status: 'ready', token };
    } catch (e) {
      if (active) {
        state.value = { status: 'needs-server', error: e instanceof Error ? e.message : undefined };
      }
    }
  });

  onUnmounted(() => {
    active = false;
  });

  return state;
}
