import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { DyDashboardComponent } from './dy-dashboard.component';
import { DyDashboardRoutingModule } from './dy-dashboard-routing.module';
import { ReportsChartComponent } from './components/reports-chart/reports-chart.component';
import { ReportsSlaChartComponent } from './components/reports-sla-chart/reports-sla-chart.component';
import { ReportTypesChartComponent } from './components/report-types-chart/report-types-chart.component';
import { AvgResponseChartComponent } from './components/avg-response-chart/avg-response-chart.component';

@NgModule({
  declarations: [
    DyDashboardComponent,
    ReportsChartComponent,
    ReportsSlaChartComponent,
    ReportTypesChartComponent,
    AvgResponseChartComponent,
  ],

  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    DyDashboardRoutingModule,
  ],
  exports: [
    ReportsChartComponent,
    ReportsSlaChartComponent,
    ReportTypesChartComponent,
    AvgResponseChartComponent,
  ],
  providers: [],
})
export class DyDashboardModule {}
