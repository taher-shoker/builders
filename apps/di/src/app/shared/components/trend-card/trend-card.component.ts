/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LabelLine, DonutChartData, LineChartData } from '@stc-apps/shared-ui';
import { TrendCard } from '../../models/http-response.model';
import { OnInit } from '@angular/core';
import { NumberToMonthNamePipe } from '../../pipes/number-to-month-name.pipe';
import { AbsPipe } from '../../pipes/operators-remover.pipe';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'stc-apps-trend-card',
  templateUrl: './trend-card.component.html',
  styleUrls: ['./trend-card.component.scss'],
})
export class TrendCardComponent implements OnInit {
  @Input() hideDetailsBtn: boolean = false;
  @Input({ required: true }) trendCard!: TrendCard;

  router = inject(Router);
  _dataService = inject(DataService);

  //Should hold the dimensions of the donut
  donutDimensions: DonutChartData[] = [];

  //Hold the line of the data
  lineChartData: LineChartData[] = [];

  //Hold the line of the target
  lineChartTarget: LineChartData[] = [];

  //Hold the line of the Baseline
  lineChartBaseline: LineChartData[] = [];

  //Use this to control the colors of the line chart
  lineChartColors = ['#45006F', '#FF6A39'];

  donutLabels: LabelLine[] = [];

  //Use this to control the colors of the donut
  donutColors = ['#ff6a39', '#ffdd40', '#1cced8'];

  caption!: string;
  overallAboveTarget!: number;
  score: number = 1;
  target: number = 0;
  delta: number = 0;

  ngOnInit(): void {
    this.populateDonut(this.trendCard);
    this.populateTrend(this.trendCard);
  }

  populateDonut(trendCard: TrendCard) {
    //Bind the 3 colored dimensions of the donut

    for (let i = 0; i < trendCard.scores.length; i++) {
      if (i === 0) {
        //Bind the caption
        this.caption = trendCard.scores[i].unitSector;
        this.overallAboveTarget = trendCard.scores[i].aboveTarget;

        //Bind the overall data in the middle of the donut
        this.score = trendCard.scores[i].score;
        this.target = trendCard.scores[i].target;
        this.delta = trendCard.scores[i].monthDiff;
      } else {

        this.donutDimensions.push({
          value: trendCard.scores[i].score,
          category: trendCard.scores[i].dimension,
        });
      }
    }

    const upArrow: string = `<i style="font-size: 14px" class="fas fa-solid fa-arrow-up achieved"></i>`
    const downArrow: string = `<i style="font-size: 14px" class="fas fa-solid fa-arrow-down not-achieved"></i>`
    const temp = [
      {
        html: `<p style="color:#00c48c; font-weight:bold; font-size: 13px">${this.score}%<span style="font-weight:normal; color:black; margin-left:6px">/${this.target}%</span></p>`,
        centerY: 60,
      },
      {
        html: `<p> ${trendCard.scores[0].achievedFlag === '0' ? downArrow : upArrow} ${new AbsPipe().transform(this.delta)}%</p>`,
        centerY: 30,
      },
      { html: `<p style="font-size: 10px">From last month</p>`, centerY: 0 },
    ];
    this.donutLabels = [...temp];
  }

  populateTrend(trendCard: TrendCard) {
    for (let i = 0; i < trendCard.trends.length; i++) {
      // Push an object into each of the 3 arrays , data - target - baseline :

      this.lineChartData.push({
        category: this._dataService.formatDate(
          trendCard.trends[i].frequencyNum,
          trendCard.trends[i].yearNum
        ),
        value: trendCard.trends[i].score,
      });
      this.lineChartTarget.push({
        category: this._dataService.formatDate(
          trendCard.trends[i].frequencyNum,
          trendCard.trends[i].yearNum
        ),
        value: trendCard.trends[i].target,
      });
      this.lineChartBaseline.push({
        category: this._dataService.formatDate(
          trendCard.trends[i].frequencyNum,
          trendCard.trends[i].yearNum
        ),
        value: trendCard.trends[i].baseline,
      });
    }
  }

  navToKpiDetails() {
    this.router.navigate(['/performance', this.trendCard.scores[0].unitSector]);
  }
}
