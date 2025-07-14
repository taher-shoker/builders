import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  QAComplianceModel,
  STATUS_STYLE_MAP,
  WorkstreamStatus,
} from '../../../models/digital-transformation';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { StatusCardComponent } from '../status-card/status-card.component';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'stc-apps-qa-compilance-card',
  standalone: true,
  imports: [CommonModule, SharedUiModule, StatusCardComponent, SidebarModule],
  templateUrl: './qa-compilance-card.component.html',
  styleUrl: './qa-compilance-card.component.scss',
})
export class QaCompilanceCardComponent {
  showSidebar = false;
  QAComplianceCardData = input.required<QAComplianceModel>();
  @Output() sidebarOpened = new EventEmitter();
  getStatusStyle(status: string) {
    const normalized = status?.toLowerCase();
    const matchedStatus = Object.values(WorkstreamStatus).find(
      (s) => s === normalized
    ) as WorkstreamStatus;

    return (
      STATUS_STYLE_MAP[matchedStatus] ||
      STATUS_STYLE_MAP[WorkstreamStatus.Complete]
    );
  }
  openSidebar() {
    this.sidebarOpened.emit();
  }
}
