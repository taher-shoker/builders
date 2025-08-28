import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ArchituralBacklog,
  STATUS_STYLE_MAP,
  TechnicalDebtDashboardModel,
  TechnicalDebtDataModel,
  WorkstreamStatus,
} from '../../../models/digital-transformation';
import { StatusCardComponent } from '../status-card/status-card.component';
import { SidebarModule } from 'primeng/sidebar';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-technical-debt-card',
  standalone: true,
  imports: [CommonModule, StatusCardComponent, SidebarModule, SharedUiModule],
  templateUrl: './technical-debt-card.component.html',
  styleUrl: './technical-debt-card.component.scss',
})
export class TechnicalDebtCardComponent implements OnInit, OnChanges {
  showSidebar = false;
  cardData: InputSignal<TechnicalDebtDashboardModel> =
    input.required<TechnicalDebtDashboardModel>();
  currTap = input.required<number>();
  technicalDebtChart!: TechnicalDebtDataModel;
  archituralBacklogChart?: ArchituralBacklog;
  ngOnInit() {
    this.technicalDebtChart = this.cardData().data.technicalDebt;
    this.archituralBacklogChart = this.cardData().data.archituralBacklog;
  }
  ngOnChanges() {
    this.technicalDebtChart = this.cardData().data.technicalDebt;
    this.archituralBacklogChart = this.cardData().data.archituralBacklog;
  }
  getStatusStyle(status: string) {
    const normalized = status.toLowerCase();
    const matchedStatus = Object.values(WorkstreamStatus).find(
      (s) => s === normalized
    ) as WorkstreamStatus;
    return (
      STATUS_STYLE_MAP[matchedStatus] ||
      STATUS_STYLE_MAP[WorkstreamStatus.Complete]
    );
  }
}
