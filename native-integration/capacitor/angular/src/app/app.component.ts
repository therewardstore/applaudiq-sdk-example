// App shell — just hosts the router outlet. Real pages live in home/ and embed/ (named routes).
// Shares the brand theme (theme.css, wired via angular.json styles) with the iOS / Android / Flutter examples.
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
