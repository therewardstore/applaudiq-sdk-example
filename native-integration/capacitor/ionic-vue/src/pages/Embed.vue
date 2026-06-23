<!-- Embed view — opens the full-screen embed for the requested mode, then returns to Home when dismissed.
     Reached via /embed?mode=manual|auto (auto carries its minted token in router history state).

     Back chain: hardware Back (Android) / left-edge swipe (iOS) → SDK relays `applaudiq:back` → the portal
     steps back through its own history; at the embed root it replies `close` → the SDK tears the overlay
     down and fires `onClose` → we route back to Home. -->
<script setup lang="ts">
import { ApplaudIQ, type EmbedHandle } from '@applaudiq/embed-capacitor';
import { IonContent, IonPage, onIonViewDidLeave, onIonViewWillEnter } from '@ionic/vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { BASE_URL, PUBLISHABLE_KEY, SSO_CALLBACK } from '../config';
import { getEmbedToken } from '../mint';

type State = 'loading' | 'success' | 'pending' | 'error';
const ICON: Record<State, string> = { loading: '↻', success: '✓', pending: '⏳', error: '⚠' };

const route = useRoute();
const router = useRouter();
const state = ref<State>('loading');
const text = ref('Opening embed…');
let handle: EmbedHandle | null = null;

// Ionic keeps routed pages cached, so open/close on the Ionic view hooks (not onMounted/onUnmounted),
// which fire reliably on enter/leave.
onIonViewWillEnter(async () => {
  const mode = route.query.mode === 'auto' ? 'auto' : 'manual';

  let token: string | undefined;
  if (mode === 'auto') {
    // Prefer the token Home minted (history state); fall back to minting here (e.g. a direct reload).
    token = (history.state?.token as string | undefined) ?? undefined;
    if (!token) {
      state.value = 'loading';
      text.value = 'Minting a one-time token…';
      try {
        token = await getEmbedToken();
      } catch {
        token = undefined;
      }
    }
  }

  handle = ApplaudIQ.init({
    key: PUBLISHABLE_KEY,
    baseUrl: BASE_URL,
    ssoCallback: SSO_CALLBACK,
  }).open({
    mode,
    token,
    render: 'fullscreen',
    onReady: () => set('success', 'Signed in'),
    onAuthPending: () => set('pending', 'Pending HR approval'),
    onError: (m) => set('error', `Error: ${m}`),
    // Dismissed at the embed root (Back / swipe) → return to Home.
    onClose: () => router.replace('/'),
  });
});

onIonViewDidLeave(() => {
  handle?.close();
  handle = null;
});

function set(s: State, t: string) {
  state.value = s;
  text.value = t;
}
</script>

<template>
  <IonPage>
    <IonContent>
      <div class="aiq-app">
        <main class="aiq-content">
          <div class="aiq-status" :class="`is-${state}`">
            <span class="aiq-status-icon">{{ ICON[state] }}</span>
            <span class="aiq-status-text">{{ text }}</span>
          </div>
        </main>
      </div>
    </IonContent>
  </IonPage>
</template>
