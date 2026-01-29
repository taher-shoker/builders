import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCardComponent } from '../../status-card/status-card.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { pageDetailsProjectModel } from '../../../../models/digital-transformation';
import {
  STATUS_STYLE_MAP,
  WorkstreamStatus,
} from '../../../../models/digital-transformation';
export interface ProgressInfo {
  prefixText: string;
  prefixValue: number | string;
  suffixText: string;
  suffixValue: number | string;
  progressValue: number;
  indexes?: Index[];
  barColor?: string;
  bgBarColor?: string;
  unit?: string;
}
interface Index {
  caption: string;
  value: number;
  progressValue?: number;
  // position?: 'up' | 'down';
  position?: 'up' | 'down';
  actualBarColor?: string;
}
@Component({
  selector: 'stc-apps-executive-summary-card',
  standalone: true,
  imports: [
    CommonModule,
    StatusCardComponent,
    SharedUiModule,
    OverlayPanelModule,
  ],
  templateUrl: './executive-summary-card.component.html',
  styleUrl: './executive-summary-card.component.scss',
})
export class ExecutiveSummaryCardComponent implements OnInit, OnChanges {
  executiveCard: InputSignal<pageDetailsProjectModel> =
    input.required<pageDetailsProjectModel>();
  vactual!: number;
  vplanned!: number;
  difference!: number;
  isPMO = input<boolean>();
  isViewer = input<boolean>();
  isMobile = input<boolean>(false);
  @ViewChild('overlayPanel2') overlayPanel2?: OverlayPanel;
  data!: ProgressInfo;
  @Output() openProjSidebar = new EventEmitter<pageDetailsProjectModel>();
  ngOnInit() {
    this.updateChartData();
  }
  ngOnChanges(): void {
    this.updateChartData();
  }
  updateChartData() {
    this.vactual = this.executiveCard().metrics.filter(
      (val) => val.name === 'actual'
    )[0].value;
    this.vplanned = this.executiveCard().metrics.filter(
      (val) => val.name === 'planned'
    )[0].value;
    this.difference = Math.abs(this.vplanned - this.vactual);
    this.data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: this.vactual,
      barColor:
        this.executiveCard()?.projectStatus?.toLowerCase() === 'at risk'
          ? '#EAB308'
          : this.executiveCard()?.projectStatus?.toLowerCase() === 'on track'
          ? '#22C55E'
          : this.executiveCard()?.projectStatus?.toLowerCase() === 'delayed'
          ? '#EF4444'
          : this.executiveCard()?.projectStatus?.toLowerCase() === 'complete' ||
            this.executiveCard()?.projectStatus?.toLowerCase() === 'completed'
          ? '#06B6D4'
          : '#6B7280',
      bgBarColor:
        this.executiveCard()?.projectStatus?.toLowerCase() === 'at risk'
          ? '#FEF9C3'
          : this.executiveCard()?.projectStatus?.toLowerCase() === 'on track'
          ? '#dcfce7'
          : this.executiveCard()?.projectStatus?.toLowerCase() === 'delayed'
          ? '#FEF2F2'
          : this.executiveCard()?.projectStatus?.toLowerCase() === 'complete' ||
            this.executiveCard()?.projectStatus?.toLowerCase() === 'completed'
          ? '#CFFAFE'
          : '#F3F4F6',
      indexes: [
        {
          caption: 'Actual',
          value: this.vactual,
          position: 'up',
          actualBarColor:
            this.executiveCard()?.projectStatus?.toLowerCase() === 'at risk'
              ? '#EAB308'
              : this.executiveCard()?.projectStatus?.toLowerCase() ===
                'on track'
              ? '#22C55E'
              : this.executiveCard()?.projectStatus?.toLowerCase() === 'delayed'
              ? '#EF4444'
              : this.executiveCard()?.projectStatus?.toLowerCase() ===
                  'complete' ||
                this.executiveCard()?.projectStatus?.toLowerCase() ===
                  'completed'
              ? '#06B6D4'
              : '#6B7280',
        },
        {
          caption: `Planned`,
          value: this.vplanned,
          position: 'down',
          actualBarColor: '#000000',
        },
      ],
    };
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
  openAddWorkstreamSidebar() {
    this.openProjSidebar.emit(this.executiveCard());
  }
}
