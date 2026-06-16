import { Routes } from '@angular/router';

import { AutoLoginComponent } from './auto-login.component';
import { HomeComponent } from './home.component';
import { ManualLoginComponent } from './manual-login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auto', component: AutoLoginComponent },
  { path: 'manual', component: ManualLoginComponent },
  { path: '**', redirectTo: '' },
];
