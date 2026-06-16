import { onMounted, onUnmounted, ref, type Ref } from 'vue';

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
