import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { keyIsPlaceholder } from './config';

/** Landing page: explains the two login modes and links into each. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="aiq-home">
      <div class="aiq-hero">
        <h1>Embed recognition in your Angular app</h1>
        <p>Drop the Applaud IQ recognition portal into your app. Pick how employees sign in:</p>
      </div>

      <div class="aiq-cards">
        <article class="aiq-card">
          <span class="icon">🔁</span>
          <h3>Auto-login</h3>
          <p class="desc">Your server mints a one-time token and the employee is signed in silently.</p>
          <p class="when">Use when your app already authenticated the employee (needs a server).</p>
          <a class="cta" routerLink="/auto">Open auto-login →</a>
        </article>

        <article class="aiq-card">
          <span class="icon">🔑</span>
          <h3>Manual login</h3>
          <p class="desc">The embed shows Applaud IQ's own login (email / SSO) — no server, no secret.</p>
          <p class="when">Use to try it in minutes, or when you have no backend.</p>
          <a class="cta" routerLink="/manual">Open manual login →</a>
        </article>
      </div>

      <p class="aiq-note" *ngIf="keyIsPlaceholder">
        👉 Set your publishable key and portal URL in <code>src/app/config.ts</code> before the embed will load.
      </p>
    </div>
  `,
})
export class HomeComponent {
  keyIsPlaceholder = keyIsPlaceholder;
}
