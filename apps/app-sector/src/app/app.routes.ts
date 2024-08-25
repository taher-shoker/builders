import { Route } from '@angular/router';
import { WelcomePageComponent } from './views/welcome-page/welcome-page.component';
import { LayoutComponent } from './layout/layout.component';
import { sectorGuard } from './services/guards/sector.guard';

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
        canActivate: [sectorGuard],
      },
      {
        path: 'details/:kpiName',
        loadChildren: () =>
          import('./views/details/details.module').then((m) => m.DetailsModule),
        canActivate: [sectorGuard],
      },
    ],
  },
  {
    path: 'welcome',
    component: WelcomePageComponent,
  },
];
