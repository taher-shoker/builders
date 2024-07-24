import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { DetailsComponent } from './views/details/details.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./views/home/home.module').then((m) => m.HomeModule),
      },
    ],
  },
  {
    path: 'details/:kpiName',
    component: DetailsComponent,
    children: [
      {
        path: 'details/:kpiName',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
      },
    ],
  },
];
