import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCardComponent } from '../../status-card/status-card.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ExecutiveCardModel } from '../../../../models/digital-transformation';
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
  imports: [CommonModule, StatusCardComponent, SharedUiModule],
  templateUrl: './executive-summary-card.component.html',
  styleUrl: './executive-summary-card.component.scss',
})
export class ExecutiveSummaryCardComponent implements OnInit {
  executiveCard: InputSignal<ExecutiveCardModel> =
    input.required<ExecutiveCardModel>();
  vactual!: number;
  vplanned!: number;
  difference!: number;
  data!: ProgressInfo;
  @Output() openProjSidebar = new EventEmitter<ExecutiveCardModel>();
  ngOnInit() {
    this.vactual = this.executiveCard().actual;
    this.vplanned = this.executiveCard().planned;
    this.difference = Math.abs(this.vplanned - this.vactual);
    this.data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: this.vactual,
      barColor:
        this.executiveCard().status.toLowerCase() === 'at risk'
          ? '#EAB308'
          : this.executiveCard().status.toLowerCase() === 'on track'
          ? '#22C55E'
          : this.executiveCard().status.toLowerCase() === 'delayed'
          ? '#EF4444'
          : this.executiveCard().status.toLowerCase() === 'not started/on hold'
          ? '#6B7280'
          : '#06B6D4',
      bgBarColor:
        this.executiveCard().status.toLowerCase() === 'at risk'
          ? '#FEF9C3'
          : this.executiveCard().status.toLowerCase() === 'on track'
          ? '#dcfce7'
          : this.executiveCard().status.toLowerCase() === 'delayed'
          ? '#FEF2F2'
          : this.executiveCard().status.toLowerCase() === 'not started/on hold'
          ? '#F3F4F6'
          : '#CFFAFE',
      indexes: [
        {
          caption: 'Actual',
          value: this.executiveCard().actual,
          position: 'up',
          actualBarColor:
            this.executiveCard().status.toLowerCase() === 'at risk'
              ? '#EAB308'
              : this.executiveCard().status.toLowerCase() === 'on track'
              ? '#22C55E'
              : this.executiveCard().status.toLowerCase() === 'delayed'
              ? '#EF4444'
              : this.executiveCard().status.toLowerCase() ===
                'not started/on hold'
              ? '#6B7280'
              : '#06B6D4',
        },
        {
          caption: `Planned`,
          value: this.executiveCard().planned,
          position: 'down',
          actualBarColor: '#000000',
        },
      ],
    };
  }
  openAddWorkstreamSidebar() {
    this.openProjSidebar.emit(this.executiveCard());
  }
}
