import { CommonModule } from '@angular/common';
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
import { CassesSettingRoutingModule } from './casses-setting-routing.module';
import { CassesSettingComponent } from './casses-setting.component';
import { AddMilestoneComponent } from './components/add-milestone/add-milestone.component';
import { CasseDetailsComponent } from './components/casse-details/casse-details.component';
import { CassesComponent } from './components/casses/casses.component';
import { EditMilestineComponent } from './components/edit-milestone/edit-milestone.component';
import { MilestoneFormComponent } from './components/milestone-form/milestone-form.component';

@NgModule({
  declarations: [
    CassesSettingComponent,
    CassesComponent,
    MilestoneFormComponent,
    AddMilestoneComponent,
    EditMilestineComponent,
    CasseDetailsComponent,
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
    CassesSettingRoutingModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSortModule,
    MatTabsModule,
  ],
  exports: [],
  providers: [],
})
export class CassesSettingModule {}
