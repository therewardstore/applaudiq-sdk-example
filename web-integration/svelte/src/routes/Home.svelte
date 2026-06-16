<script lang="ts">
  import { Link } from 'svelte-routing';

  import { keyIsPlaceholder } from '../lib/config';
</script>

<!-- Landing page: explains the two login modes and links into each. -->
<div class="aiq-home">
  <div class="aiq-hero">
    <h1>Embed recognition in your Svelte app</h1>
    <p>Drop the Applaud IQ recognition portal into your app. Pick how employees sign in:</p>
  </div>

  <div class="aiq-cards">
    <article class="aiq-card">
      <span class="icon">🔁</span>
      <h3>Auto-login</h3>
      <p class="desc">Your server mints a one-time token and the employee is signed in silently.</p>
      <p class="when">Use when your app already authenticated the employee (needs a server).</p>
      <Link class="cta" to="/auto">Open auto-login →</Link>
    </article>

    <article class="aiq-card">
      <span class="icon">🔑</span>
      <h3>Manual login</h3>
      <p class="desc">The embed shows Applaud IQ's own login (email / SSO) — no server, no secret.</p>
      <p class="when">Use to try it in minutes, or when you have no backend.</p>
      <Link class="cta" to="/manual">Open manual login →</Link>
    </article>
  </div>

  {#if keyIsPlaceholder}
    <p class="aiq-note">
      👉 Set your publishable key and portal URL in <code>src/lib/config.ts</code> before the embed will load.
    </p>
  {/if}
</div>
