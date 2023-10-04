import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { authGuard } from './shared/guards/auth.guard';
import { userRolesResolver } from './shared/resolvers/user-roles.resolver';

export const appRoutes: Route[] = [
  {path: "home", component: HomeComponent, canActivate: [authGuard]},
  {path: "trend", loadChildren: () => import('./views/kpis-trend/kpis-trend.module').then(m => m.KpisTrendModule), resolve: {roles: userRolesResolver}},
  {path: "performance/:unit_sector", loadChildren: () => import('./views/kpis-performance/kpis-performance.module').then(m => m.KpisPerformanceModule)},
  {path: "", redirectTo: "/home", pathMatch: "full"},
];
