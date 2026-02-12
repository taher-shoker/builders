import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { KPI } from '../../models/kpi.model';

@Component({
  selector: 'stc-apps-kpi-actions',
  templateUrl: './kpi-actions.component.html',
  styleUrls: ['./kpi-actions.component.scss'],
})
export class KpiActionsComponent {
  kpi = input.required<KPI>();

  @Output() activityLog = new EventEmitter<KPI>();
  @Output() updateValue = new EventEmitter<KPI>();
  @Output() linkedMilestone = new EventEmitter<KPI>();
  @Output() viewList = new EventEmitter<KPI>();
  @Output() edit = new EventEmitter<KPI>();
  @Output() delete = new EventEmitter<KPI>();
  @Input() permissionRole: 'viewer' | 'editor' = 'viewer';

  onActivityLog(): void {
    this.activityLog.emit(this.kpi());
  }

  onUpdateValue(): void {
    this.updateValue.emit(this.kpi());
  }

  onLinkedMilestone(): void {
    this.linkedMilestone.emit(this.kpi());
  }

  onViewList(): void {
    this.viewList.emit(this.kpi());
  }

  onEdit(): void {
    this.edit.emit(this.kpi());
  }

  onDelete(): void {
    this.delete.emit(this.kpi());
  }
}
