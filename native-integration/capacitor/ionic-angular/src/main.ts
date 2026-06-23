import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Idiomatic Ionic routing: IonicRouteStrategy + provideRouter drive the <ion-router-outlet> in
// AppComponent, giving native page transitions (Home → Embed) and the iOS swipe-back gesture.
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
