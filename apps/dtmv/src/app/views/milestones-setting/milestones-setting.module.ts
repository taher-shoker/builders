/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { AddMilestoneComponent } from './components/add-milestone/add-milestone.component';
import { EditMilestineComponent } from './components/edit-milestone/edit-milestone.component';
import { MilestoneDetailsComponent } from './components/milestone-details/milestone-details.component';
import { MilestoneFormComponent } from './components/milestone-form/milestone-form.component';
import { MilestonesComponent } from './components/milestones/milestones.component';
import { MiltestonesSettingRoutingModule } from './milestones-setting-routing.module';
import { MilestonesSettingComponent } from './milestones-setting.component';
import { UpdateProgressDialogComponent } from './components/updateProgressDialog/updateProgressDialog.component';
import { CustomTemplateDirective } from 'libs/shared-ui/src/lib/custom-table/custom-template.directive';
import { UpdateMilestoneProgressDialogComponent } from './components/update-milestone-progress-dialog/update-milestone-progress-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    MilestonesSettingComponent,
    MilestonesComponent,
    MilestoneFormComponent,
    AddMilestoneComponent,
    EditMilestineComponent,
    MilestoneDetailsComponent,
    UpdateProgressDialogComponent,
    CustomTemplateDirective,
    UpdateMilestoneProgressDialogComponent
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MiltestonesSettingRoutingModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSortModule,
    MatTabsModule,
    MatInputModule,
    NgxSpinnerModule
  ],
  exports: [],
  providers: [DatePipe],
})
export class MilestonesSettingModule {}
