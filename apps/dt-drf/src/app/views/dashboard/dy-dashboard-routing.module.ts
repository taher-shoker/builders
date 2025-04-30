import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DyDashboardComponent } from './dy-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DyDashboardComponent,
    data: { breadcrumb: '' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DyDashboardRoutingModule {}
