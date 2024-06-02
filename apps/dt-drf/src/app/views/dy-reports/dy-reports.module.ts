/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { CustomTemplateDirective } from 'libs/shared-ui/src/lib/custom-table/custom-template.directive';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DyReportFormComponent } from './components/dy-report-form/dy-report-form.component';
import { DyReportsRoutingModule } from './dy-reports-routing.module';
import { AddDyReportComponent } from './components/add-dy-report/add-dy-report.component';
import { EditDyReportComponent } from './components/edit-dy-report/edit-dy-report.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DyReportsComponent } from './dy-reports.component';
import { DyReportDetailsComponent } from './components/dy-report-details/dy-report-details.component';

@NgModule({
  declarations: [
    ReportsComponent,
    DyReportsComponent,
    DyReportFormComponent,
    AddDyReportComponent,
    EditDyReportComponent,
    DyReportDetailsComponent,
    CustomTemplateDirective,
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
    MatExpansionModule,
    MatProgressBarModule,
    MatSortModule,
    MatTabsModule,
    MatInputModule,
    NgxSpinnerModule,
    DyReportsRoutingModule,
  ],
  exports: [],
  providers: [DatePipe],
})
export class DyReportsModule {}
