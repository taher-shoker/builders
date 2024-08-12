import {
  AfterViewChecked,
  ChangeDetectorRef,
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
  KpiDetailsResponse,
  KpiDTO,
  KpiDTOMap,
  SectorKpisDetailsParams,
} from '../../../models/SectorKpisDetails.model';
import { SharedFormService } from '../../services/shared-form.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'stc-apps-score-card-tabs',
  templateUrl: './score-card-tabs.component.html',
  styleUrls: ['./score-card-tabs.component.scss'],
})
export class ScoreCardTabsComponent implements OnInit, AfterViewChecked {
  selectedTab: WritableSignal<string> = signal('');
  scoreCardName: InputSignal<string> = input('');

  scores: OverallScore[] = [];
  selectedTabChanged = '';
  kpiDTOMap: KpiDTOMap = {};
  categoryKpiLists: { [key: string]: KpiDTO[] } = {};

  constructor(
    private overallScoreService: OverallScoreService,
    private dashboardService: DashboardService,
    private sharedFormService: SharedFormService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getOverallScore();
    this.getSectorKpisDetails();
  }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  handleChangeTab(value: any) {
    console.log('handle change tab', value);
    this.selectedTab.set(value);
    this.selectedTabChanged = value;
    this.getSectorKpisDetails();
  }

  getOverallScore() {
    this.overallScoreService.overallScore$.subscribe((result) => {
      if (result) {
        this.scores = result.filter(
          (item) => item.scorecardTitle !== 'Overall'
        );
        // if (this.scores.length > 0) {
        // this.selectedTab.set(this.scores[0].scorecardTitle);
        // }
      }
    });
  }

  getSectorKpisDetails() {
    if (this.selectedTab() !== '') {
      const params: SectorKpisDetailsParams = {
        ...this.sharedFormService.getForm().value,
        scorecardTitle: this.selectedTab(),
      };

      this.dashboardService
        .getSectorKpisDetails(params)
        .subscribe((result: KpiDetailsResponse) => {
          if (result) {
            this.kpiDTOMap = result.kpiDTOMap;
            Object.keys(this.kpiDTOMap).forEach((category) => {
              this.categoryKpiLists[category] = this.kpiDTOMap[category];
            });
          }
        });
    }
  }
}
