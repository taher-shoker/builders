import { Component, input, InputSignal } from '@angular/core';
import { KpiStatusModel } from '../kpi-card/kpi.model';

@Component({
  selector: 'stc-apps-kpi-status-card',
  standalone: false,
  templateUrl: './kpi-status-card.component.html',
  styleUrl: './kpi-status-card.component.scss',
})
export class KpiStatusCardComponent {
  kpiStatus:InputSignal<KpiStatusModel> = input.required<KpiStatusModel>();
}
