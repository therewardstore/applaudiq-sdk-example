<script setup lang="ts">
import EmbedView from '../components/EmbedView.vue';
</script>

<template>
  <!-- Manual login route — publishable key only; the embed shows the portal's own login. -->
  <EmbedView
    title="Manual login"
    what="The embed shows Applaud IQ's own login (email / SSO). No server, no token."
    mode="manual"
  />
</template>
