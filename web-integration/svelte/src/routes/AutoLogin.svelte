<script lang="ts">
  import EmbedLoading from '../components/EmbedLoading.svelte';
  import EmbedView from '../components/EmbedView.svelte';
  import NeedsServerNotice from '../components/NeedsServerNotice.svelte';
  import { embedToken } from '../lib/useEmbedToken';

  // Mints a token first (see lib/useEmbedToken.ts), then renders the embed signed in.
  const token = embedToken();
</script>

<!-- Auto-login route — switch over the token state. -->
{#if $token.status === 'needs-server'}
  <NeedsServerNotice />
{:else if $token.status === 'loading'}
  <EmbedLoading title="Auto-login" what="Minting a one-time token…" />
{:else}
  <EmbedView
    title="Auto-login"
    what="Signed in silently with a server-minted token."
    mode="auto"
    token={$token.token}
  />
{/if}
