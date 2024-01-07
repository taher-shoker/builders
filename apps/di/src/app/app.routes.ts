import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { authGuard } from './shared/guards/auth.guard';
import { userRolesResolver } from './shared/resolvers/user-roles.resolver';
import { reportingGuard } from './shared/guards/reporting.guard';

export const appRoutes: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard, reportingGuard],
  },
  {
    path: 'trend',
    loadChildren: () =>
      import('./views/kpis-trend/kpis-trend.module').then(
        (m) => m.KpisTrendModule
      ),
    resolve: { roles: userRolesResolver },
    canActivate: [reportingGuard],
  },
  {
    path: 'performance/:unit_sector',
    loadChildren: () =>
      import('./views/kpis-performance/kpis-performance.module').then(
        (m) => m.KpisPerformanceModule
      ),
    canActivate: [reportingGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
