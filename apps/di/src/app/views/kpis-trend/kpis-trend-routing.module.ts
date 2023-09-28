import { Routes } from '@angular/router';
import { KpisTrendComponent } from './kpis-trend/kpis-trend.component';

export const routes: Routes = [
  {path: "", component: KpisTrendComponent}
];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class KpisTrendRoutingModule { }
