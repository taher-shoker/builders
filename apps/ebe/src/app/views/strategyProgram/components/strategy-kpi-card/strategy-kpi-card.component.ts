import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyProgramKpiModel } from '../../../../models/strategy-program.model';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-strategy-kpi-card',
  standalone: true,
  imports: [CommonModule, SharedUiModule , RouterModule],
  templateUrl: './strategy-kpi-card.component.html',
  styleUrl: './strategy-kpi-card.component.scss',
})
export class StrategyKpiCardComponent {
  strategyKpiCard:InputSignal<StrategyProgramKpiModel> = input.required<StrategyProgramKpiModel>()
}
