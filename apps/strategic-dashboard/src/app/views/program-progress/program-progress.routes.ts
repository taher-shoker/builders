import { Route } from '@angular/router';
import { ProgramProgressComponent } from './program-progress.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';
import { AllProgramsComponent } from './components/all-programs/all-programs.component';
import { KpiDetailsComponent } from './components/kpi-details/kpi-details.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ProgramProgressComponent,
    children: [
      {
        path: '',
        component: AllProgramsComponent,
      },
      {
        path: ':programName',
        component: ProgramDetailsComponent,
      },
      {
        path: ':programName/:kpiCode',
        component: KpiDetailsComponent,
      },
    ],
  },
];
