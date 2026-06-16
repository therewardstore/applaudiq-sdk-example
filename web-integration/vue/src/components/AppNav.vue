<script setup lang="ts">
// Sticky top nav. vue-router toggles router-link-active / router-link-exact-active,
// but we pass active-class/exact-active-class="active" so the shared `.active` CSS applies.
</script>

<template>
  <nav class="aiq-nav">
    <span class="aiq-brand"> ApplaudIQ <span class="dot">·</span> Vue </span>
    <div class="aiq-links">
      <RouterLink to="/" exact-active-class="active">Home</RouterLink>
      <RouterLink to="/auto" active-class="active">Auto-login</RouterLink>
      <RouterLink to="/manual" active-class="active">Manual login</RouterLink>
    </div>
  </nav>
</template>
