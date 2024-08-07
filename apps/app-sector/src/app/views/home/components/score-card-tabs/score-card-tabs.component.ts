import {
  Component,
  InputSignal,
  OnInit,
  WritableSignal,
  input,
  signal,
} from '@angular/core';
import { OverallScore } from '../../../models/overallScore.model';
import { OverallScoreService } from '../../services/overall-score.service';
import {
  kpiDetailsResponse,
  KpiDTO,
  SectorKpisDetailsParams,
} from '../../../models/SectorKpisDetails.model';
import { SharedFormService } from '../../services/shared-form.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'stc-apps-score-card-tabs',
  templateUrl: './score-card-tabs.component.html',
  styleUrls: ['./score-card-tabs.component.scss'],
})
export class ScoreCardTabsComponent implements OnInit {
  selectedTab: WritableSignal<string> = signal('Corporate Priorities');
  scoreCardName: InputSignal<string> = input('');
  scores: OverallScore[] = [];
  kpiDTOList: KpiDTO[] = [];

  constructor(
    private overallScoreService: OverallScoreService,
    private dashboardService: DashboardService,
    private sharedFormService: SharedFormService
  ) {}

  ngOnInit(): void {
    this.getOverallScore();
  }

  handleChangeTab(value: any) {
    this.selectedTab.set(value);
  }

  getOverallScore() {
    this.overallScoreService.overallScore$.subscribe((result) => {
      if (result) {
        this.scores = result.filter(
          (item) => item.scorecardTitle !== 'Overall'
        );
        if (this.scores.length > 0) {
          this.selectedTab.set(this.scores[0].scorecardTitle);
        }
      }
    });
  }

  getSectorKpisDetails() {
    const params: SectorKpisDetailsParams = {
      ...this.sharedFormService.getForm().value,
      scorecardTitle: this.selectedTab(),
    };

    this.dashboardService
      .getSectorKpisDetails(params)
      .subscribe((result: kpiDetailsResponse) => {
        console.log(result);
        if (result) {
          this.kpiDTOList = result.kpiDTOList;
        }
      });
  }
}
