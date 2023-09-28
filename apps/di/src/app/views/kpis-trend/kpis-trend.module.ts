import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routes } from './kpis-trend-routing.module';
import { KpisTrendComponent } from './kpis-trend/kpis-trend.component';
import { TrendCardComponent } from '../../shared/components/trend-card/trend-card.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [KpisTrendComponent, TrendCardComponent],
  imports: [CommonModule, SharedUiModule ,RouterModule.forChild(routes)],
})

export class KpisTrendModule {}
