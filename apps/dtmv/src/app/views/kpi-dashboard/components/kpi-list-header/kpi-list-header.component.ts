import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'stc-apps-kpi-list-header',
  templateUrl: './kpi-list-header.component.html',
  styleUrls: ['./kpi-list-header.component.scss'],
})
export class KpiListHeaderComponent {
  @Output() addKpi = new EventEmitter<void>();
  @Input() permissionRole: 'viewer' | 'editor' = 'viewer';
  @Output() exportKPIs = new EventEmitter<void>();
  @Input() showExportButton = true;

  onAddKpi(): void {
    this.addKpi.emit();
  }

  onExportKPIs(): void {
    this.exportKPIs.emit();
  }
}
