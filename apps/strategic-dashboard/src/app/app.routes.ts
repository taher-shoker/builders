import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AllProgramsComponent } from './views/program-progress/all-programs/all-programs.component';

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
