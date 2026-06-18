<script setup lang="ts">
import { computed, ref } from 'vue';

import type { ApplaudIQOpenOptions } from '../applaudiq.d';
import { useApplaudIQ } from '../useApplaudIQ';

const CONTAINER = 'applaudiq-recognition';

type StatusKind = 'ready' | 'pending' | 'error';
type Status = { text: string; kind?: StatusKind };

const props = defineProps<{
  title: string;
  what: string;
  mode: 'auto' | 'manual';
  token?: string;
  getToken?: () => Promise<string>;
}>();

const status = ref<Status>({ text: 'opening…' });

const options = computed<ApplaudIQOpenOptions>(() => ({
  mode: props.mode,
  token: props.token,
  getToken: props.getToken,
  onReady: () => (status.value = { text: 'signed in', kind: 'ready' }),
  onAuthPending: () => (status.value = { text: 'waiting for HR approval', kind: 'pending' }),
  onError: (e) => (status.value = { text: e.message, kind: 'error' }),
}));

useApplaudIQ(CONTAINER, options);
</script>

<template>
  <section class="aiq-mode">
    <div class="aiq-subhead">
      <h2>{{ props.title }}</h2>
      <span class="what">{{ props.what }}</span>
      <span :class="['pill', 'pill-right', status.kind]">{{ status.text }}</span>
    </div>
    <div v-if="status.kind === 'pending'" class="aiq-banner pending">
      ⏳ Waiting for HR approval — you'll get access once an admin approves you.
    </div>
    <div :id="CONTAINER" class="aiq-embed" />
  </section>
</template>
