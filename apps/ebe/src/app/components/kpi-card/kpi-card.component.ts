import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { KpiModel } from '../../models/scorecard.model';
// import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'stc-apps-cost-card',
  standalone: true,
  imports : [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  // @Input({required:true}) costData!:CostModel;
  kpiData:InputSignal<KpiModel> = input.required<KpiModel>({alias : 'kpi'});
}
