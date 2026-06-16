import { Component, Input } from '@angular/core';

/** The transient "minting a token…" state shown before the auto-login embed mounts. */
@Component({
  selector: 'app-embed-loading',
  standalone: true,
  template: `
    <section class="aiq-mode">
      <div class="aiq-subhead">
        <h2>{{ title }}</h2>
        <span class="what">{{ what }}</span>
        <span class="pill pill-right">opening…</span>
      </div>
      <div class="aiq-embed"></div>
    </section>
  `,
})
export class EmbedLoadingComponent {
  @Input() title = '';
  @Input() what = '';
}
