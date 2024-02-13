import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';
import { reportingGuard } from '../../services/guards/reporting.guard';
import { CassesSettingComponent } from './casses-setting.component';
import { AddMilestoneComponent } from './components/add-milestone/add-milestone.component';
import { CasseDetailsComponent } from './components/casse-details/casse-details.component';
import { CassesComponent } from './components/casses/casses.component';

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
        path: 'add_milestone',
        component: AddMilestoneComponent,
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
