import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { UnauthorizedPageComponent } from './views/unauthorized-page/unauthorized-page.component';

// Import Containers

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
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
];
@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {}
}
