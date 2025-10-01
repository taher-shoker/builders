import { Component, signal } from '@angular/core';
import { KPI } from '../../models/kpi.model';

@Component({
  selector: 'stc-apps-kpi-list-section',
  templateUrl: './kpi-list-section.component.html',
  styleUrls: ['./kpi-list-section.component.scss']
})
export class KpiListSectionComponent {
  selectedKpi = signal<KPI | null>(null);

  onKpiSelected(kpi: KPI): void {
    this.selectedKpi.set(kpi);
  }
}
