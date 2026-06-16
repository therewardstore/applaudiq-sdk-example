<script setup lang="ts">
import EmbedLoading from '../components/EmbedLoading.vue';
import EmbedView from '../components/EmbedView.vue';
import NeedsServerNotice from '../components/NeedsServerNotice.vue';
import { useEmbedToken } from '../useEmbedToken';

// Auto-login route — mints a token first (see useEmbedToken), then renders the embed signed in.
const token = useEmbedToken();
</script>

<template>
  <NeedsServerNotice v-if="token.status === 'needs-server'" />

  <EmbedLoading v-else-if="token.status === 'loading'" title="Auto-login" what="Minting a one-time token…" />

  <EmbedView
    v-else
    title="Auto-login"
    what="Signed in silently with a server-minted token."
    mode="auto"
    :token="token.token"
  />
</template>
