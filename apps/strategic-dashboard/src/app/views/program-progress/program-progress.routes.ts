import { Route } from '@angular/router';
import { ProgramProgressComponent } from './program-progress.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';
import { AllProgramsComponent } from './components/all-programs/all-programs.component';
import { KpiDetailsComponent } from './components/kpi-details/kpi-details.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'allPrograms',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ProgramProgressComponent,
    children: [
      {
        path: '',
        redirectTo: 'allPrograms',
        pathMatch: 'full',
      },
      {
        path: 'allPrograms',
        component: AllProgramsComponent,
      },
      {
        path: 'program-details',
        component: ProgramDetailsComponent,
      },
      {
        path: 'kpi-details/:kpiCode',
        component: KpiDetailsComponent,
      },
    ],
  },
];
