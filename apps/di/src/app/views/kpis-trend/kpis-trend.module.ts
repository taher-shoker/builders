import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routes } from './kpis-trend-routing.module';
import { KpisTrendComponent } from './kpis-trend/kpis-trend.component';
import { TrendCardComponent } from '../../shared/components/trend-card/trend-card.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { RouterModule } from '@angular/router';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { AbsPipe } from "../../shared/pipes/operators-remover.pipe";
import { NumberToMonthNamePipe } from "../../shared/pipes/number-to-month-name.pipe";

@NgModule({
    declarations: [KpisTrendComponent, TrendCardComponent, HasRoleDirective],
    imports: [CommonModule, SharedUiModule, RouterModule.forChild(routes), AbsPipe, NumberToMonthNamePipe]
})

export class KpisTrendModule {}
