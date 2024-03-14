import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';
import { reportingGuard } from '../../services/guards/reporting.guard';
import { AddMilestoneComponent } from './components/add-milestone/add-milestone.component';
import { EditMilestineComponent } from './components/edit-milestone/edit-milestone.component';
import { MilestoneDetailsComponent } from './components/milestone-details/milestone-details.component';
import { MilestonesComponent } from './components/milestones/milestones.component';
import { MilestonesSettingComponent } from './milestones-setting.component';

const routes: Routes = [
  {
    path: '',
    component: MilestonesSettingComponent,
    data: { breadcrumb: '' },

    children: [
      {
        path: '',
        component: MilestonesComponent,
      },
      {
        path: 'add_milestone',
        component: AddMilestoneComponent,
        data: { breadcrumb: 'Add new Milestones' },
        // canActivate: [AuthGuard, reportingGuard],
      },
      {
        path: 'edit_milestone/:id',
        component: EditMilestineComponent,
        data: { breadcrumb: `Edit Milestone` },
      },
      {
        path: 'milestone_details/:id',
        component: MilestoneDetailsComponent,
        canActivate: [AuthGuard, reportingGuard],
        data: { breadcrumb: `milestone-details` },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiltestonesSettingRoutingModule {}
