<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { openEmbed } from '../lib/openEmbed';
  import type { ApplaudIQHandle, ApplaudIQLoginMode } from '../applaudiq.d';

  export let title: string;
  export let what: string;
  export let mode: ApplaudIQLoginMode;
  export let token: string | undefined = undefined;

  const CONTAINER = 'applaudiq-recognition';

  type Kind = 'ready' | 'pending' | 'error' | '';
  let status = 'opening…';
  let kind: Kind = '';

  let handle: ApplaudIQHandle | undefined;

  onMount(() => {
    handle = openEmbed(`#${CONTAINER}`, {
      mode,
      token,
      onReady: () => ((status = 'signed in'), (kind = 'ready')),
      onAuthPending: () => ((status = 'waiting for HR approval'), (kind = 'pending')),
      onError: (e) => ((status = e.message), (kind = 'error')),
    });
  });

  onDestroy(() => handle?.close());
</script>

<!-- Sub-header (title + status pill) and the inline container the SDK mounts into. -->
<section class="aiq-mode">
  <div class="aiq-subhead">
    <h2>{title}</h2>
    <span class="what">{what}</span>
    <span class="pill pill-right {kind}">{status}</span>
  </div>
  {#if kind === 'pending'}
    <div class="aiq-banner pending">
      ⏳ Waiting for HR approval — you'll get access once an admin approves you.
    </div>
  {/if}
  <div id={CONTAINER} class="aiq-embed"></div>
</section>
