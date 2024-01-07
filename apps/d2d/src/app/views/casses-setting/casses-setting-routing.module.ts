import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CassesComponent } from './components/casses/casses.component';
import { AddCasseComponent } from './components/add-casse/add-casse.component';
import { CasseDetailsComponent } from './components/casse-details/casse-details.component';
import { CassesSettingComponent } from './casses-setting.component';
import { AuthGuard } from '../../services/auth.guard';
import { reportingGuard } from '../../services/guards/reporting.guard';

const routes: Routes = [
  {
    path: '',
    component: CassesSettingComponent,
    data: { breadcrumb: '' },

    children: [
      {
        path: '',
        component: CassesComponent,
      },
      {
        path: 'add_case',
        component: AddCasseComponent,
        data: { breadcrumb: 'Add new Case', permissions: 'CREATORS' },
        canActivate: [AuthGuard, reportingGuard],
      },
      {
        path: 'case_details/:id',
        component: CasseDetailsComponent,
        canActivate: [AuthGuard, reportingGuard],
        data: { breadcrumb: `case-details` },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CassesSettingRoutingModule {}
