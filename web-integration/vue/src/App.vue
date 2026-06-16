<script setup lang="ts">
import AppNav from './components/AppNav.vue';
</script>

<template>
  <!-- App shell: sticky top nav + the active route below. -->
  <div class="aiq-app">
    <AppNav />
    <main class="aiq-main">
      <RouterView />
    </main>
  </div>
</template>
