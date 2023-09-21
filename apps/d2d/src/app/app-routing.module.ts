import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { AdminAuthGuard } from './services/admin.auth.guard';
import { UnauthorizedPageComponent } from './views/unauthorized-page/unauthorized-page.component';
import { AppRouteReuseStrategy } from './views/users-settings/AppRouteReuseStrategy';

// Import Containers

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'unauthorized-page',
    data: { breadcrumb: '' },
    component: UnauthorizedPageComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'users-setting',
    data: { breadcrumb: 'users_setting' },
    canActivate: [AdminAuthGuard],
    loadChildren: () =>
      import('./views/users-settings/users-settings.module').then(
        (m) => m.UsersSettingsModule
      ),
  },
];
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
  providers: [{ provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy }],
})
export class AppRoutingModule {
  constructor(private router: Router) {}
}
