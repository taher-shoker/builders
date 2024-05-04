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
import { VpReportRoutingModule } from './vp-report-routing.module';
import { VpReportComponent } from './vp-report.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedUiModule } from '@stc-apps/shared-ui';

@NgModule({
  declarations: [VpReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedUiModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSortModule,
    VpReportRoutingModule,
  ],
  exports: [],
  providers: [],
})
export class VpReportModule {}
