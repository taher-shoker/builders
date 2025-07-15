import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';
import { HomeComponent } from './home.component';
import { VpViewerGuard } from '../../services/guards/vp-viewer.guard';

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
          import('../milestones-setting/milestones-setting.module').then(
            (m) => m.MilestonesSettingModule
          ),
      },
      {
        path: 'archived-milestones',
        canActivate: [AuthGuard],
        data: { state: 'archive', breadcrumb: 'archive' },
        loadChildren: () =>
          import('../milestones-setting/milestones-setting.module').then(
            (m) => m.MilestonesSettingModule
          ),
      },
      {
        path: 'vp-report',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../vp-report/vp-report.module').then((m) => m.VpReportModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
