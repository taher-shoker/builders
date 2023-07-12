import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

// Import Containers

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    children: [
      {
        path: '',
        data: { breadcrumb: 'home' },
        loadChildren: () =>
          import('./views/casses-setting/casses-setting-routing.module').then(
            (m) => m.CassesSettingRoutingModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
