import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/** App shell: sticky top nav + the active route below. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="aiq-app">
      <nav class="aiq-nav">
        <span class="aiq-brand">ApplaudIQ <span class="dot">·</span> Angular</span>
        <div class="aiq-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/auto" routerLinkActive="active">Auto-login</a>
          <a routerLink="/manual" routerLinkActive="active">Manual login</a>
        </div>
      </nav>
      <main class="aiq-main">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
