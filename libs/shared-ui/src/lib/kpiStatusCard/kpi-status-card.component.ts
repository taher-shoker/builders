import { Component, input, InputSignal, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
@Component({
  selector: 'stc-apps-kpi-status-card',
  standalone: false,
  templateUrl: './kpi-status-card.component.html',
  styleUrl: './kpi-status-card.component.scss',
})
export class KpiStatusCardComponent{
  kpiStatus:InputSignal<number | string | boolean> = input.required<number | string | boolean>();
  kpiType:InputSignal<string> = input.required<string>();
  domainIndicator:InputSignal<string | null> = input<string | null>('');
  domainIndicatorColor:InputSignal<string> = input<string>('');
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  @ViewChild('overlayPanel3') overlayPanel3!: OverlayPanel;
  isMobile = input<boolean>(false)
}
