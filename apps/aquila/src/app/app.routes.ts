import { Route } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'api-test',
        loadComponent: () =>
          import('./features/api-test/api-test.component').then(
            (m) => m.ApiTestComponent
          ),
      },
      {
        path: 'test-history',
        loadComponent: () =>
          import('./features/test-history/test-history.component').then(
            (m) => m.TestHistoryComponent
          ),
      },
    ],
  },
];
