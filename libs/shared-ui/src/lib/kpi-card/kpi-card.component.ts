import { Component, input, InputSignal, ViewChild } from '@angular/core';
import { KpiModel } from './kpi.model';
import { OverlayPanel } from 'primeng/overlaypanel';
// import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'stc-apps-kpi-card',
  standalone: false,
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  // @Input({required:true}) costData!:CostModel;
  kpiData:InputSignal<KpiModel> = input.required<KpiModel>({alias : 'kpi'});
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
}
