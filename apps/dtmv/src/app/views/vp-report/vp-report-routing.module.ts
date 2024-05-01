import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';
import { VpReportComponent } from './vp-report.component';

const routes: Routes = [
  {
    path: '',
    component: VpReportComponent,
    data: { breadcrumb: '' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VpReportRoutingModule {}
