import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from '../../services/admin.auth.guard';
import { AuthGuard } from '../../services/auth.guard';
import { HomeComponent } from './home.component';

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
      {
        path: 'feedback-issue-logs',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../feedback-issue/feedback-issue.module').then(
            (m) => m.FeedBackIssueModule
          ),
      },
      {
        path: 'kpi-dashboard',
        canActivate: [AuthGuard],
        data: { state: 'kpi', breadcrumb: 'DI KPI Integration' },
        loadChildren: () =>
          import('../kpi-dashboard/kpi-dashboard.module').then(
            (m) => m.KpiDashboardModule
          ),
      },
      {
        path: 'action-log',
        canActivate: [AdminAuthGuard],
        data: { breadcrumb: 'Action Log' },
        loadChildren: () =>
          import('../action-log/action-log.module').then(
            (m) => m.ActionLogModule
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
