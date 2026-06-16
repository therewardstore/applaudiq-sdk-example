<script setup lang="ts">
// The transient "minting a token…" state shown before the auto-login embed mounts.
defineProps<{
  title: string;
  what: string;
}>();
</script>

<template>
  <section class="aiq-mode">
    <div class="aiq-subhead">
      <h2>{{ title }}</h2>
      <span class="what">{{ what }}</span>
      <span class="pill pill-right">opening…</span>
    </div>
    <div class="aiq-embed" />
  </section>
</template>
