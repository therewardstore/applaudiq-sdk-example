import { Component, Input, OnInit, inject } from '@angular/core';

import { ApplaudIQService } from './applaudiq.service';

const CONTAINER = 'applaudiq-recognition';

type Status = { text: string; kind?: 'ready' | 'pending' | 'error' };

/**
 * Renders the embed for a single login mode: a sub-header (title + status pill)
 * and the inline container the SDK mounts the portal into.
 */
@Component({
  selector: 'app-embed-view',
  standalone: true,
  template: `
    <section class="aiq-mode">
      <div class="aiq-subhead">
        <h2>{{ title }}</h2>
        <span class="what">{{ what }}</span>
        <span
          class="pill pill-right"
          [class.ready]="status.kind === 'ready'"
          [class.pending]="status.kind === 'pending'"
          [class.error]="status.kind === 'error'"
          >{{ status.text }}</span
        >
      </div>
      @if (status.kind === 'pending') {
        <div class="aiq-banner pending">
          ⏳ Waiting for HR approval — you'll get access once an admin approves you.
        </div>
      }
      <div id="applaudiq-recognition" class="aiq-embed"></div>
    </section>
  `,
})
export class EmbedViewComponent implements OnInit {
  @Input() title = '';
  @Input() what = '';
  @Input() mode: 'auto' | 'manual' = 'manual';
  @Input() token?: string;

  private sdk = inject(ApplaudIQService);
  status: Status = { text: 'opening…' };

  ngOnInit(): void {
    this.sdk.open(CONTAINER, {
      mode: this.mode,
      token: this.token,
      onReady: () => (this.status = { text: 'signed in', kind: 'ready' }),
      onAuthPending: () => (this.status = { text: 'waiting for HR approval', kind: 'pending' }),
      onError: (e) => (this.status = { text: e.message, kind: 'error' }),
    });
  }
}
