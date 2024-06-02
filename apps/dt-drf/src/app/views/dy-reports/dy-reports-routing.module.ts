import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';

import { DyReportsComponent } from './dy-reports.component';
import { AddDyReportComponent } from './components/add-dy-report/add-dy-report.component';
import { EditDyReportComponent } from './components/edit-dy-report/edit-dy-report.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DyReportDetailsComponent } from './components/dy-report-details/dy-report-details.component';

const routes: Routes = [
  {
    path: '',
    component: DyReportsComponent,
    data: { breadcrumb: '' },

    children: [
      {
        path: '',
        component: ReportsComponent,
      },
      {
        path: 'add_report',
        component: AddDyReportComponent,
        data: { breadcrumb: 'Add new Report' },
        canActivate: [AuthGuard],
      },
      {
        path: 'edit_report/:id',
        component: EditDyReportComponent,
        data: { breadcrumb: `Edit Report` },
      },
      {
        path: 'report_details/:id',
        component: DyReportDetailsComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: `milestone-details` },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DyReportsRoutingModule {}
