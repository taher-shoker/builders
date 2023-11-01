import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../../services/auth.guard';
import { UnauthorizedPageComponent } from '../unauthorized-page/unauthorized-page.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { reportingGuard } from '../../services/guards/reporting.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: '' },

    children: [
      {
        path: 'home',
        data: { breadcrumb: 'home' },
        canActivate: [AuthGuard, reportingGuard],
        loadChildren: () =>
          import('../casses-setting/casses-setting.module').then(
            (m) => m.CassesSettingModule
          ),
      },
      // {
      //   path: 'users-setting',
      //   data: { breadcrumb: 'users_setting' },
      //   // canActivate: [AuthGuard],
      //   loadChildren: () =>
      //     import('../users-settings/users-settings.module').then(
      //       (m) => m.UsersSettingsModule
      //     ),
      // },
      {
        path: 'dashboard',
        data: { breadcrumb: 'dashboard' },
        canActivate: [AuthGuard, reportingGuard],
        component: DashboardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
