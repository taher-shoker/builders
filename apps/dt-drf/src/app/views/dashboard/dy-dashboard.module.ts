import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { DyDashboardComponent } from './dy-dashboard.component';
import { DyDashboardRoutingModule } from './dy-dashboard-routing.module';

@NgModule({
  declarations: [DyDashboardComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    DyDashboardRoutingModule,
  ],
  exports: [],
  providers: [],
})
export class DyDashboardModule {}
