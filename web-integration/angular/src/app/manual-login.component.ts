import { Component } from '@angular/core';

import { EmbedViewComponent } from './embed-view.component';

/** Manual login route — publishable key only; the embed shows the portal's own login. */
@Component({
  selector: 'app-manual-login',
  standalone: true,
  imports: [EmbedViewComponent],
  template: `
    <app-embed-view
      title="Manual login"
      what="The embed shows Applaud IQ's own login (email / SSO). No server, no token."
      mode="manual"
    />
  `,
})
export class ManualLoginComponent {}
