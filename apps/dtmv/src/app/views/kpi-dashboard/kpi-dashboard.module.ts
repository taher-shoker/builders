import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiDashboardRoutingModule } from './kpi-dashboard-routing.module';
import { KpiDashboardComponent } from './kpi-dashboard.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ActualProgressComponent } from './components/actual-progress/actual-progress.component';

@NgModule({
  declarations: [KpiDashboardComponent, ActualProgressComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule,
    KpiDashboardRoutingModule,
    MatTooltipModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatRadioModule,
    FormsModule,
  ],
})
export class KpiDashboardModule {}
