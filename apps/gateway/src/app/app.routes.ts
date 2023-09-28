import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

// Import Containers
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminAuthGuard } from './shared/guards/admin.auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/apps', pathMatch: 'full' },
  {
    path: 'apps',
    data: { breadcrumb: 'apps' },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  {
    path: 'users-setting',
    canActivate: [AdminAuthGuard],
    loadChildren: () =>
      import('./views/users-settings/users-settings.module').then(
        (m) => m.UsersSettingsModule
      ),
    data: { breadcrumb: 'users setting' },
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [LoggedInAuthGuard],
  },
];
@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
