import { Route } from '@angular/router';
import { WelcomePageComponent } from './views/welcome-page/welcome-page.component';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./views/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'details/:kpiCode',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
      },
    ],
  },
  {
    path: 'welcome',
    component: WelcomePageComponent,
  },
];
