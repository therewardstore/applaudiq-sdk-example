import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import AutoLogin from './views/AutoLogin.vue';
import Home from './views/Home.vue';
import ManualLogin from './views/ManualLogin.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/auto', name: 'auto', component: AutoLogin },
  { path: '/manual', name: 'manual', component: ManualLogin },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
