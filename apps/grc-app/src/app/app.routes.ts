import { Route } from '@angular/router';
import { KriDashboardComponent } from './views/kri-dashboard/kri-dashboard.component';
import { ComplianceRegisterComponent } from './views/compliance-register/compliance-register.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'kri',
    pathMatch: 'full',
  },
  {
    path: 'kri',
    component: KriDashboardComponent,
  },
  {
    path: 'compliance-reg',
    component: ComplianceRegisterComponent,
  },
];
