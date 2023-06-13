import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

// Import Containers

const routes: Routes = [
  { path: '', redirectTo: '/casses-setting', pathMatch: 'full' },
  {
    path: 'casses-setting',
    children: [
      {
        path: '',
        data: { breadcrumb: 'casses setting' },
        loadChildren: () =>
          import('./views/casses-setting/casses-setting-routing.module').then(
            (m) => m.CassesSettingRoutingModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
