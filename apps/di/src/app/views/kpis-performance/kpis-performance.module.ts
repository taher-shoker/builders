import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routes } from './kpis-performance-routing.module';
import { KpisPerformanceComponent } from './kpis-performance';
import { KpisHolderComponent } from '../../shared/components/kpis-holder/kpis-holder.component';
import { KpisCardComponent } from '../../shared/components/kpis-card/kpis-card.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    KpisPerformanceComponent,
    KpisCardComponent,
    KpisHolderComponent,
  ],
  imports: [CommonModule, SharedUiModule, RouterModule.forChild(routes)],
})
export class KpisPerformanceModule {}
