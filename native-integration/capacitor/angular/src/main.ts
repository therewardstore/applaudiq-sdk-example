import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Path-location routing (default). Navigation is client-side (Home → Embed), so the static WebView
// server is never asked for a deep path. The hash is left free for the web SSO return (`#aiq_sso=…`,
// read in HomeComponent before any routing).
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
