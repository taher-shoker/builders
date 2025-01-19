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
        path: 'api-standard-list',
        loadComponent: () =>
          import(
            './features/api-standards/api-standard-list/api-standard-list.component'
          ).then((m) => m.ApiStandardListComponent),
      },
      ...[
        'api-standard-list/edit-standard',
        'api-standard-list/add-standard',
      ].map((path) => ({
        path,
        loadComponent: () =>
          import(
            './features/api-standards/api-standard-form/api-standard-form.component'
          ).then((m) => m.ApiStandardFormComponent),
      })),
      {
        path: 'api-standard-list/view-standard',
        loadComponent: () =>
          import(
            './features/api-standards/api-standard-details/api-standard-details.component'
          ).then((m) => m.ApiStandardDetailsComponent),
      },
      {
        path: 'activity-monitoring',
        loadComponent: () =>
          import(
            './features/activity-monitoring/activity-monitoring-list/activity-monitoring.component'
          ).then((m) => m.ActivityMonitoringComponent),
      },
    ],
  },
];
