import { Component, input, InputSignal, OnInit } from '@angular/core';
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
        (this.difference >= 0 && this.difference <= 5) ||
        this.vactual > this.vplanned
          ? '#00C48C'
          : this.difference > 5 && this.difference <= 10
          ? '#EFC500'
          : '#FF1A1A',
      bgBarColor:
        (this.difference >= 0 && this.difference <= 5) ||
        this.vactual > this.vplanned
          ? '#00c48c1a'
          : this.difference > 5 && this.difference <= 10
          ? 'rgba(239, 197, 0, .2)'
          : 'rgba(255, 26, 26, .2)',
      indexes: [
        {
          caption: 'Actual',
          value: this.executiveCard().actual,
          position: 'up',
          actualBarColor:
            (this.difference >= 0 && this.difference <= 5) ||
            this.vactual > this.vplanned
              ? '#009F71'
              : this.difference > 5 && this.difference <= 10
              ? '#D9B301'
              : '#BC0000',
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
}
