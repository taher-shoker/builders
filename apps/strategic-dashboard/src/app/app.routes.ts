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
        path: 'home/programs',
        loadChildren: () =>
          import('./views/program-progress/program-progress.module').then(
            (m) => m.ProgramProgressModule
          ),
      },
      {
        path: 'home/data-upload',
        loadChildren: () =>
          import('./views/data-upload/data-upload.module').then(
            (m) => m.DataUploadModule
          ),
      },
      {
        path: 'home/:strategicName',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
