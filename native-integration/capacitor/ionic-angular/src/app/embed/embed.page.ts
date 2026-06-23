// Embed page — opens the full-screen embed for the requested mode, then returns to Home when the embed
// is dismissed. Reached via /embed?mode=manual|auto (auto carries its minted token in router state).
//
// Back chain: hardware Back (Android) / left-edge swipe (iOS) → SDK relays `applaudiq:back` → the portal
// steps back through its own history; at the embed root it replies `close` → the SDK tears the overlay
// down and fires `onClose` → we route back to Home.
//
// IONIC NOTE: <ion-router-outlet> has its OWN iOS left-edge swipe-back that would pop Embed→Home. That
// would short-circuit the SDK's edge-swipe (which steps through the PORTAL's history), so we disable the
// Ionic swipe gesture while this page is showing and restore it on leave.
import { NgClass } from '@angular/common';
import { Component, NgZone, Optional, type OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplaudIQ, type EmbedHandle } from '@applaudiq/embed-capacitor';
import { IonContent, IonRouterOutlet } from '@ionic/angular/standalone';

import { BASE_URL, PUBLISHABLE_KEY, SSO_CALLBACK } from '../../config';
import { getEmbedToken } from '../../mint';

type State = 'loading' | 'success' | 'pending' | 'error';

@Component({
  selector: 'app-embed',
  standalone: true,
  imports: [NgClass, IonContent],
  template: `
    <ion-content>
      <div class="aiq-app">
        <main class="aiq-content">
          <div class="aiq-status" [ngClass]="'is-' + state">
            <span class="aiq-status-icon">{{ icon[state] }}</span>
            <span class="aiq-status-text">{{ text }}</span>
          </div>
        </main>
      </div>
    </ion-content>
  `,
})
export class EmbedPage implements OnInit, OnDestroy {
  state: State = 'loading';
  text = 'Opening embed…';
  icon: Record<State, string> = { loading: '↻', success: '✓', pending: '⏳', error: '⚠' };

  private handle: EmbedHandle | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    @Optional() private routerOutlet: IonRouterOutlet | null,
  ) {}

  // Ionic page lifecycle: hand the back gesture to the SDK while the embed is open.
  ionViewWillEnter(): void {
    if (this.routerOutlet) this.routerOutlet.swipeGesture = false;
  }
  ionViewWillLeave(): void {
    if (this.routerOutlet) this.routerOutlet.swipeGesture = true;
  }

  async ngOnInit(): Promise<void> {
    const mode = this.route.snapshot.queryParamMap.get('mode') === 'auto' ? 'auto' : 'manual';

    let token: string | undefined;
    if (mode === 'auto') {
      // Prefer the token Home minted (router state); fall back to minting here (e.g. a direct reload).
      token = (history.state?.token as string | undefined) ?? undefined;
      if (!token) {
        this.text = 'Minting a one-time token…';
        try {
          token = await getEmbedToken();
        } catch {
          token = undefined;
        }
      }
    }

    this.handle = ApplaudIQ.init({
      key: PUBLISHABLE_KEY,
      baseUrl: BASE_URL,
      ssoCallback: SSO_CALLBACK,
    }).open({
      mode,
      token,
      render: 'fullscreen',
      onReady: () => this.set('success', 'Signed in'),
      onAuthPending: () => this.set('pending', 'Pending HR approval'),
      onError: (m) => this.set('error', `Error: ${m}`),
      // Dismissed at the embed root (Back / swipe) → return to Home.
      onClose: () => this.zone.run(() => void this.router.navigate(['/'])),
    });
  }

  ngOnDestroy(): void {
    // Leaving the route by any path tears the embed overlay down.
    this.handle?.close();
    this.handle = null;
  }

  // SDK callbacks fire outside Angular's zone (window message / Capacitor listeners) — re-enter it.
  private set(s: State, t: string) {
    this.zone.run(() => {
      this.state = s;
      this.text = t;
    });
  }
}
