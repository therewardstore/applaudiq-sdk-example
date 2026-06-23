// Home page — choose a login mode, then navigate to the Embed route. Keeps the Ionic shell
// (<ion-content>) while rendering the shared brand theme (theme.css) like the other examples.
import { NgClass } from '@angular/common';
import { Component, NgZone, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { getEmbedToken } from '../../mint';

type State = 'idle' | 'loading' | 'error';
const IDLE = 'Choose a login mode to open the embed.';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass, IonContent],
  template: `
    <ion-content>
      <div class="aiq-app">
        <header class="aiq-hero">
          <div class="aiq-badge">✨</div>
          <h1 class="aiq-hero-title">Applaud IQ</h1>
          <p class="aiq-hero-sub">Capacitor · Ionic Angular — embed example</p>
        </header>
        <main class="aiq-content">
          <p class="aiq-section-label">Choose a login mode</p>
          <button
            class="aiq-card"
            [ngClass]="{ 'is-busy': busy === 'manual', 'is-dim': busy && busy !== 'manual' }"
            [disabled]="busy !== null"
            (click)="openManual()"
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
            [ngClass]="{ 'is-busy': busy === 'auto', 'is-dim': busy && busy !== 'auto' }"
            [disabled]="busy !== null"
            (click)="openAuto()"
          >
            <span class="aiq-tile">⚡</span>
            <span class="aiq-card-text">
              <div class="aiq-card-title">Auto-login</div>
              <div class="aiq-card-sub">Silent sign-in with a one-time token minted on your server.</div>
            </span>
            <span class="aiq-chevron">›</span><span class="aiq-spinner"></span>
          </button>
          <div class="aiq-status" [ngClass]="'is-' + state">
            <span class="aiq-status-icon">{{ icon[state] }}</span>
            <span class="aiq-status-text">{{ text }}</span>
          </div>
          <p class="aiq-footer">&#64;applaudiq/embed-capacitor · by Arulraj V</p>
        </main>
      </div>
    </ion-content>
  `,
})
export class HomePage implements OnInit {
  state: State = 'idle';
  text = IDLE;
  busy: 'manual' | 'auto' | null = null;
  icon: Record<State, string> = { idle: 'ℹ', loading: '↻', error: '⚠' };

  constructor(
    private router: Router,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    // Web (non-native) same-page SSO return: the gateway redirected back here with `#aiq_sso=<code>`.
    // Resume by opening the embed route in manual mode — the SDK reads the code and completes sign-in.
    // No-op on native (the deep link drives that flow) and when there's no SSO return.
    if (typeof window !== 'undefined' && window.location.hash.includes('aiq_sso')) {
      void this.router.navigate(['/embed'], { queryParams: { mode: 'manual' } });
    }
  }

  openManual(): void {
    void this.router.navigate(['/embed'], { queryParams: { mode: 'manual' } });
  }

  async openAuto(): Promise<void> {
    this.busy = 'auto';
    this.state = 'loading';
    this.text = 'Minting a one-time token…';
    let token: string | undefined;
    try {
      token = await getEmbedToken();
    } catch {
      token = undefined;
    }
    // Pass the minted token via router state (never a query param — tokens stay out of URLs).
    this.zone.run(() => {
      this.busy = null;
      this.state = 'idle';
      this.text = IDLE;
      void this.router.navigate(['/embed'], { queryParams: { mode: 'auto' }, state: { token } });
    });
  }
}
