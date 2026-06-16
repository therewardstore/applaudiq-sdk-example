import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { EmbedLoadingComponent } from './embed-loading.component';
import { EmbedTokenService, type EmbedTokenState } from './embed-token.service';
import { EmbedViewComponent } from './embed-view.component';
import { NeedsServerNoticeComponent } from './needs-server-notice.component';

/** Auto-login route — mints a token first (see EmbedTokenService), then renders the embed signed in. */
@Component({
  selector: 'app-auto-login',
  standalone: true,
  imports: [EmbedViewComponent, EmbedLoadingComponent, NeedsServerNoticeComponent],
  template: `
    @if (state.status === 'needs-server') {
      <app-needs-server-notice />
    } @else if (state.status === 'loading') {
      <app-embed-loading title="Auto-login" what="Minting a one-time token…" />
    } @else {
      <app-embed-view
        title="Auto-login"
        what="Signed in silently with a server-minted token."
        mode="auto"
        [token]="token"
      />
    }
  `,
})
export class AutoLoginComponent implements OnInit, OnDestroy {
  private tokens = inject(EmbedTokenService);
  private destroyed = false;
  state: EmbedTokenState = { status: 'loading' };

  /** The minted token, available once `state.status === 'ready'`. */
  get token(): string | undefined {
    return this.state.status === 'ready' ? this.state.token : undefined;
  }

  ngOnInit(): void {
    this.tokens.mint().then((next) => {
      if (!this.destroyed) this.state = next;
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }
}
