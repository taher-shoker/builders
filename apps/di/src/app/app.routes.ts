import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { authGuard } from './shared/guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'users-setting',
    component: HomeComponent,
  },
  {
    path: 'trend',
    loadChildren: () =>
      import('./views/kpis-trend/kpis-trend.module').then(
        (m) => m.KpisTrendModule
      ),
  },
  {
    path: 'performance',
    loadChildren: () =>
      import('./views/kpis-performance/kpis-performance.module').then(
        (m) => m.KpisPerformanceModule
      ),
  },
];
