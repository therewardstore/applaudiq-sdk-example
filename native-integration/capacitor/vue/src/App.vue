<!-- App shell — just the router view. Real views live in pages/Home.vue + pages/Embed.vue (named routes).
     Plain Vue (no Ionic), so the SDK owns the only back affordance: iOS left-edge swipe + Android Back. -->
<script setup lang="ts"></script>

<template>
  <RouterView />
</template>
