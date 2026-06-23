import type { Routes } from '@angular/router';

// Real routed pages (named routes), mirroring the react-native-expo Home→Embed stack and the
// web-integration manual/auto pages — not just show/hide on one component.
//   ''        → Home   (choose a login mode)
//   'embed'   → Embed  (full-screen embed; ?mode=manual|auto)
export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
  {
    path: 'embed',
    loadComponent: () => import('./embed/embed.component').then((m) => m.EmbedComponent),
  },
  { path: '**', redirectTo: '' },
];
