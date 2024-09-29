import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './services/guards/auth.guard';
import { dataUploadGuard } from './services/guards/data-upload.guard';

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
        canActivate: [authGuard],
      },
      {
        path: 'home/data-upload',
        loadChildren: () =>
          import('./views/data-upload/data-upload.module').then(
            (m) => m.DataUploadModule
          ),
        canActivate: [authGuard, dataUploadGuard],
      },
      {
        path: 'home/:strategicName',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
        canActivate: [authGuard],
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
