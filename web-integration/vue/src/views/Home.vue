<script setup lang="ts">
import { keyIsPlaceholder } from '../config';
</script>

<template>
  <!-- Landing page: explains the two login modes and links into each. -->
  <div class="aiq-home">
    <div class="aiq-hero">
      <h1>Embed recognition in your Vue app</h1>
      <p>Drop the Applaud IQ recognition portal into your app. Pick how employees sign in:</p>
    </div>

    <div class="aiq-cards">
      <article class="aiq-card">
        <span class="icon">🔁</span>
        <h3>Auto-login</h3>
        <p class="desc">Your server mints a one-time token and the employee is signed in silently.</p>
        <p class="when">Use when your app already authenticated the employee (needs a server).</p>
        <RouterLink class="cta" to="/auto">Open auto-login →</RouterLink>
      </article>

      <article class="aiq-card">
        <span class="icon">🔑</span>
        <h3>Manual login</h3>
        <p class="desc">The embed shows Applaud IQ's own login (email / SSO) — no server, no secret.</p>
        <p class="when">Use to try it in minutes, or when you have no backend.</p>
        <RouterLink class="cta" to="/manual">Open manual login →</RouterLink>
      </article>
    </div>

    <p v-if="keyIsPlaceholder" class="aiq-note">
      👉 Set your publishable key and portal URL in <code>src/config.ts</code> before the embed will load.
    </p>
  </div>
</template>
