import { Route } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../views/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'details',
        loadChildren: () =>
          import('../views/details/details.module').then((m) => m.DetailsModule),
      },
    ],
  },
];
