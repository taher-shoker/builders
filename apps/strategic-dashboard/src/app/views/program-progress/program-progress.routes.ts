import { Route } from '@angular/router';
import { AllProgramsComponent } from './all-programs/all-programs.component';
import { KpiDetailsComponent } from './kpi-details/kpi-details.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AllProgramsComponent,
  },
  {
    path:'kpi-details/:kpiCode',
    component:KpiDetailsComponent
  }
];
