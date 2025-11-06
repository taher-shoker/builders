import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'stc-apps-kpi-list-header',
  templateUrl: './kpi-list-header.component.html',
  styleUrls: ['./kpi-list-header.component.scss'],
})
export class KpiListHeaderComponent {
  @Output() addKpi = new EventEmitter<void>();
  @Input() permissionRole: 'viewer' | 'editor' = 'viewer';

  onAddKpi(): void {
    this.addKpi.emit();
  }
}
