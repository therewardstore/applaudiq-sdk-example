import { IonicVue } from '@ionic/vue';
import { createApp } from 'vue';

import App from './App.vue';
import { router } from './router';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import './theme.css';

// IonicVue + the @ionic/vue-router router drive the <ion-router-outlet> in App.vue — native page
// transitions (Home → Embed) and the iOS swipe-back gesture.
createApp(App).use(IonicVue).use(router).mount('#app');
