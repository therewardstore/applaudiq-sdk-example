<!-- App shell — the Ionic root + router outlet. Real views live in pages/Home.vue + pages/Embed.vue.
     <ion-router-outlet> gives native page transitions + the iOS swipe-back gesture between pages. -->
<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted, ref } from 'vue';

const outlet = ref<InstanceType<typeof IonRouterOutlet> | null>(null);

onMounted(() => {
  // Disable Ionic's own left-edge swipe-back so it never competes with the SDK's edge-swipe (which steps
  // through the PORTAL's history). It's a 2-page example — Home is the root, and the SDK owns "back" inside
  // the embed — so a blanket disable is simplest. (Multi-page apps would scope this per-page instead.)
  const el = (outlet.value as unknown as { $el?: { swipeGesture?: boolean } })?.$el;
  if (el) el.swipeGesture = false;
});
</script>

<template>
  <IonApp>
    <IonRouterOutlet ref="outlet" />
  </IonApp>
</template>
