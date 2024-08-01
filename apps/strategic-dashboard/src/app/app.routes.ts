import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadChildren: () =>
          import('./views/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'details',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
      },
      {
        path: 'programs',
        loadChildren: () =>
          import('./views/program-progress/program-progress.module').then(
            (m) => m.ProgramProgressModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
