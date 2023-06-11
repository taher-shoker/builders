import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

// Import Containers
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    data: { breadcrumb: 'home' },
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'users-settings',
        loadChildren: () =>
          import('./views/users-settings/users-settings.module').then(
            (m) => m.UsersSettingsModule
          ),
        data: { breadcrumb: 'users settings' },
      },
    ],
  },
  { path: 'login', component: LoginComponent },
];
@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
