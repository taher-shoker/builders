import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../../services/auth.guard';
import { ProcessAdminGuard } from '../../services/process-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: '' },

    children: [
      {
        path: 'home',
        data: { breadcrumb: 'home' },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../dy-reports/dy-reports.module').then(
            (m) => m.DyReportsModule
          ),
      },
      {
        path: 'category',
        data: { breadcrumb: 'category' },
        canActivate: [ProcessAdminGuard], // Apply ProcessAdminGuard here
        loadChildren: () =>
          import('../../views/category/category.module').then(
            (m) => m.CategoryModule
          ),
      },
      {
        path: 'dashboard',
        data: { breadcrumb: 'dashboard' },
        canActivate: [ProcessAdminGuard], // Apply ProcessAdminGuard here
        loadChildren: () =>
          import('../../views/dashboard/dy-dashboard.module').then(
            (m) => m.DyDashboardModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
