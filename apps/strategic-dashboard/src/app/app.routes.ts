import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { DetailsComponent } from './views/details/details.component';
import { ProgramProgressComponent } from './views/program-progress/program-progress.component';
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
        path: 'details/:kpiName',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
      },
      {
        path: 'allPrograms',
        loadChildren: () =>
          import('./views/program-progress/program-progress.module').then(
            (m) => m.ProgramProgressModule
          ),
      },
    ],
  },
];
