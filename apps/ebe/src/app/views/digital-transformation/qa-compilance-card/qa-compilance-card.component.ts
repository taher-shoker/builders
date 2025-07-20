import {
  Component,
  EventEmitter,
  input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  pageDetailsModel,
  pageDetailsProjectModel,
  STATUS_STYLE_MAP,
  WorkstreamStatus,
} from '../../../models/digital-transformation';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { StatusCardComponent } from '../status-card/status-card.component';
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
@Component({
  selector: 'stc-apps-qa-compilance-card',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    StatusCardComponent,
    SidebarModule,
    OverlayPanelModule,
  ],
  templateUrl: './qa-compilance-card.component.html',
  styleUrl: './qa-compilance-card.component.scss',
})
export class QaCompilanceCardComponent {
  showSidebar = false;
  QAComplianceCardData = input.required<pageDetailsModel>();
  @ViewChild('overlayPanel2') overlayPanel2?: OverlayPanel;
  @ViewChild('overlayPanel3') overlayPanel3?: OverlayPanel;
  @Output() sidebarOpened = new EventEmitter();
  underValidationVal = 0;
  highlights: { id: number; title: string; value: string }[] = [];

  secondaryValue(project: pageDetailsProjectModel): number | undefined {
    const result = project.metrics?.find(
      (val) => val.name === 'under verfication'
    );
    return result?.value || undefined;
  }
  closedValue(project: pageDetailsProjectModel): number | undefined {
    const result = project.metrics?.find((val) => val.name === 'closed');
    return result?.value || undefined;
  }

  showSidebarTap() {
    this.showSidebar = true;
    if (this.QAComplianceCardData().businessUnitHighlights) {
      let cleaned = this.QAComplianceCardData().businessUnitHighlights;
      if (cleaned) {
        cleaned = cleaned.replace(/�/g, ' ');
        this.highlights = JSON.parse(cleaned);
      }
    }
  }
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
