import { Route } from '@angular/router';
import { DetailsComponent } from './details.component';

export const appRoutes: Route[] = [
  // { path: '', redirectTo: 'details/:kpiCode', pathMatch: 'full' },
  {
    path: '',
    component: DetailsComponent,
  },
];
