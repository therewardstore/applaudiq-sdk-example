import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Named routed views:
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
