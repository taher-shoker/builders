import { Route } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { noAuthGuard } from './features/auth/guards/no-auth-guard.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
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
            './features/activity-monitoring/activity-monitoring-list/activity-monitoring-list.component'
          ).then((m) => m.ActivityMonitoringListComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login'
  },
];
