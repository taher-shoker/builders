import { Route } from '@angular/router';
import { ProgramProgressComponent } from './program-progress.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';

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
];
