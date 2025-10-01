import { Component, EventEmitter, input, Output } from '@angular/core';
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
  @Output() viewList = new EventEmitter<KPI>();

  onActivityLog(): void {
    this.activityLog.emit(this.kpi());
  }

  onUpdateValue(): void {
    this.updateValue.emit(this.kpi());
  }

  onViewList(): void {
    this.viewList.emit(this.kpi());
  }
}
