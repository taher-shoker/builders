import { Route } from '@angular/router';
import { WelcomePageComponent } from './views/welcome-page/welcome-page.component';
import { LayoutComponent } from './layout/layout.component';
import { sectorGuard } from './services/guards/sector.guard';
import { authGuard } from './services/guards/auth.guard';
import { dataUploadGuard } from './services/guards/dataUpload.guard';
import { KPIGuard } from './services/guards/KPIG.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'sectors/:sectorName', pathMatch: 'full' },
      {
        path: 'sectors/:sectorName',
        loadChildren: () =>
          import('./views/home/home.module').then((m) => m.HomeModule),
        canActivate: [sectorGuard, authGuard],
      },
      {
        path: 'sectors/:sectorName/KPI',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
        canActivate: [sectorGuard, authGuard, KPIGuard],
      },
      {
        path: 'sectors/:sectorName/KPI/:KPICode',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
        canActivate: [sectorGuard, authGuard],
      },
      {
        path: 'data-upload',
        loadChildren: () =>
          import('./views/data-upload/data-upload.module').then(
            (m) => m.UploadFileModule
          ),
        canActivate: [sectorGuard, authGuard, dataUploadGuard],
      },
    ],
  },
  {
    path: 'sectors',
    component: WelcomePageComponent,
    canActivate: [authGuard],
  },
];
