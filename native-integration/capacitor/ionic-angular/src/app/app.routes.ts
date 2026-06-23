import type { Routes } from '@angular/router';

// Named routed pages (driven by <ion-router-outlet> for native Ionic transitions):
//   ''        → Home   (choose a login mode)
//   'embed'   → Embed  (full-screen embed; ?mode=manual|auto)
export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.page').then((m) => m.HomePage) },
  { path: 'embed', loadComponent: () => import('./embed/embed.page').then((m) => m.EmbedPage) },
  { path: '**', redirectTo: '' },
];
