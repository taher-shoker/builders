import { Route } from '@angular/router';
import { WelcomePageComponent } from './welcome-page.component';

export const appRoutes: Route[] = [
  {
    path: 'welcome',
    component: WelcomePageComponent,
  },
];
