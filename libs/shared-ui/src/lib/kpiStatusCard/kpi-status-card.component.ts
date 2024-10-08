import { Component, input, InputSignal } from '@angular/core';
@Component({
  selector: 'stc-apps-kpi-status-card',
  standalone: false,
  templateUrl: './kpi-status-card.component.html',
  styleUrl: './kpi-status-card.component.scss',
})
export class KpiStatusCardComponent{
  kpiStatus:InputSignal<number | string | boolean> = input.required<number | string | boolean>();
  kpiType:InputSignal<string> = input.required<string>();
  domainIndicator:InputSignal<string> = input<string>('');
  domainIndicatorColor:InputSignal<string> = input<string>('');
}
