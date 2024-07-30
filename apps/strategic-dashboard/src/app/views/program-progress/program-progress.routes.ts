import { Route } from '@angular/router';
import { ProgramProgressComponent } from './program-progress.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';
import { AllProgramsComponent } from './all-programs/all-programs.component';
import { KpiDetailsComponent } from './kpi-details/kpi-details.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ProgramProgressComponent,
    children: [
      {
        path: 'program-details',
        component: ProgramDetailsComponent,
      },
    ],
  },
  {
    path: 'kpi-details/:kpiCode',
    component: KpiDetailsComponent,
  },
];
