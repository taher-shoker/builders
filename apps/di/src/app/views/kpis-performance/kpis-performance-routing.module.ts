import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KpisPerformanceComponent } from './kpis-performance';

export const routes: Routes = [
  {
    path: '',
    component: KpisPerformanceComponent,
    data: { breadcrumb: '' },
  },
];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class KpisPerformanceRoutingModule {}
