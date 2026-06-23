// App shell — the Ionic root + router outlet. Real pages live in home/ and embed/ (named routes).
// <ion-router-outlet> gives native page transitions + the iOS swipe-back gesture between pages.
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {}
