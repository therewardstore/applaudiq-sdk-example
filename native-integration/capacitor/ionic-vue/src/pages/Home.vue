<!-- Home view — choose a login mode, then navigate to the Embed route. Keeps the Ionic shell
     (IonPage/IonContent) while rendering the shared brand theme (theme.css). -->
<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getEmbedToken } from '../mint';

type State = 'idle' | 'loading' | 'error';
const ICON: Record<State, string> = { idle: 'ℹ', loading: '↻', error: '⚠' };
const IDLE = 'Choose a login mode to open the embed.';

const router = useRouter();
const state = ref<State>('idle');
const text = ref(IDLE);
const busy = ref<'manual' | 'auto' | null>(null);

onMounted(() => {
  // Web (non-native) same-page SSO return: the gateway redirected back here with `#aiq_sso=<code>`.
  // Resume by opening the embed route in manual mode — the SDK reads the code and completes sign-in.
  if (typeof window !== 'undefined' && window.location.hash.includes('aiq_sso')) {
    router.push('/embed?mode=manual');
  }
});

function openManual() {
  router.push('/embed?mode=manual');
}

async function openAuto() {
  busy.value = 'auto';
  state.value = 'loading';
  text.value = 'Minting a one-time token…';
  let token: string | undefined;
  try {
    token = await getEmbedToken();
  } catch {
    token = undefined;
  }
  // Pass the minted token via router history state (never a query param — tokens stay out of URLs).
  busy.value = null;
  state.value = 'idle';
  text.value = IDLE;
  router.push({ path: '/embed', query: { mode: 'auto' }, state: { token } });
}
</script>

<template>
  <IonPage>
    <IonContent>
      <div class="aiq-app">
        <header class="aiq-hero">
          <div class="aiq-badge">✨</div>
          <h1 class="aiq-hero-title">Applaud IQ</h1>
          <p class="aiq-hero-sub">Capacitor · Ionic Vue — embed example</p>
        </header>
        <main class="aiq-content">
          <p class="aiq-section-label">Choose a login mode</p>
          <button
            class="aiq-card"
            :class="{ 'is-busy': busy === 'manual', 'is-dim': busy && busy !== 'manual' }"
            :disabled="busy !== null"
            @click="openManual"
          >
            <span class="aiq-tile">🔒</span>
            <span class="aiq-card-text">
              <div class="aiq-card-title">Manual login</div>
              <div class="aiq-card-sub">Employees sign in inside the embed (email + SSO). No server needed.</div>
            </span>
            <span class="aiq-chevron">›</span><span class="aiq-spinner"></span>
          </button>
          <button
            class="aiq-card"
            :class="{ 'is-busy': busy === 'auto', 'is-dim': busy && busy !== 'auto' }"
            :disabled="busy !== null"
            @click="openAuto"
          >
            <span class="aiq-tile">⚡</span>
            <span class="aiq-card-text">
              <div class="aiq-card-title">Auto-login</div>
              <div class="aiq-card-sub">Silent sign-in with a one-time token minted on your server.</div>
            </span>
            <span class="aiq-chevron">›</span><span class="aiq-spinner"></span>
          </button>
          <div class="aiq-status" :class="`is-${state}`">
            <span class="aiq-status-icon">{{ ICON[state] }}</span>
            <span class="aiq-status-text">{{ text }}</span>
          </div>
          <p class="aiq-footer">@applaudiq/embed-capacitor · by Arulraj V</p>
        </main>
      </div>
    </IonContent>
  </IonPage>
</template>
