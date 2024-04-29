import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';
import { buSpocGuard } from '../../services/guards/bu-spoc.guard';
import { AddMilestoneComponent } from './components/add-milestone/add-milestone.component';
import { EditMilestineComponent } from './components/edit-milestone/edit-milestone.component';
import { MilestoneDetailsComponent } from './components/milestone-details/milestone-details.component';
import { MilestonesComponent } from './components/milestones/milestones.component';
import { MilestonesSettingComponent } from './milestones-setting.component';
import { dtDirectorGuard } from '../../services/guards/dt-director.guard';

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
        canActivate: [AuthGuard, buSpocGuard, dtDirectorGuard],
      },
      {
        path: 'edit_milestone/:id',
        component: EditMilestineComponent,
        data: { breadcrumb: `Edit Milestone` },
      },
      {
        path: 'milestone_details/:id',
        component: MilestoneDetailsComponent,
        canActivate: [AuthGuard],
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
