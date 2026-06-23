import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Named routed views (driven by <ion-router-outlet> for native Ionic transitions):
//   '/'        → Home   (choose a login mode)
//   '/embed'   → Embed  (full-screen embed; ?mode=manual|auto)
const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/embed', component: () => import('./pages/Embed.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
