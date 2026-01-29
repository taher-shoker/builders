import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedUiModule } from '@stc-apps/shared-ui';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MilestonesSettingModule } from '../milestones-setting/milestones-setting.module';
import { VpReportModule } from '../vp-report/vp-report.module';
import { FeedBackIssueModule } from '../feedback-issue/feedback-issue.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSortModule,
    MilestonesSettingModule,
    VpReportModule,
    HomeRoutingModule,
    FeedBackIssueModule
  ],
  exports: [],
  providers: [],
})
export class HomeModule {}
