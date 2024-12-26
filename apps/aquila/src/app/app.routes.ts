import { Route } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'api-test',
      },
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
      {
        path: 'api-standard-list',
        loadComponent: () =>
          import(
            './features/api-standard-list/api-standard-list.component'
          ).then((m) => m.ApiStandardListComponent),
      },
      ...['api-standard-list/:action'].map((path) => ({
        path,
        loadComponent: () =>
          import(
            './features/api-standard-form/api-standard-form.component'
          ).then((m) => m.ApiStandardFormComponent),
      })),
    ],
  },
];
