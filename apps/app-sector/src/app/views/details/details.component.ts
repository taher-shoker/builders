import { Component, OnInit } from '@angular/core';

import {
  kpiCard,
  KpiDetailsResponse,
  KpiDTOMap,
  SectorKpisDetailsParams,
} from '../models/SectorKpisDetails.model';
import { KpiDTO } from '../../views/models/SectorKpisDetails.model';
import { comment } from './models/commentsModel';
import { SharedFormService } from '../home/services/shared-form.service';
import { DashboardService } from '../home/services/dashboard.service';
import { commentsService } from './services/comments.service';
@Component({
  selector: 'stc-apps-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  currentDate = new Date();
  kpiCode = window.history.state.kpiCode;
  selectedTab = window.history.state.selectedTab;
  cards: kpiCard[] = [];
  kpiDTOMap: KpiDTOMap = {};
  categoryKpiLists: { [key: string]: KpiDTO[] } = {};
  commentsList: comment[] = [];
  constructor(
    private sharedFormService: SharedFormService,
    private dashboardService: DashboardService,
    private commentService: commentsService
  ) {}

  ngOnInit(): void {
    this.getKpiDetails();
  }
  getKpiDetails() {
    const params: SectorKpisDetailsParams = {
      ...this.sharedFormService.getForm().value,
      scorecardTitle: this.selectedTab,
      kpiCode: this.kpiCode,
    };
    this.dashboardService
      .getSectorKpisDetails(params)
      .subscribe((result: KpiDetailsResponse) => {
        if (result) {
          this.kpiDTOMap = result.kpiDTOMap;
          Object.keys(this.kpiDTOMap).forEach((category) => {
            this.categoryKpiLists[category] = this.kpiDTOMap[category];
            this.commentService.commenstList.next(
              this.categoryKpiLists[category][0].commentList
            );

            this.commentsList = this.categoryKpiLists[category][0].commentList;
            console.log('details page', this.commentsList);
            this.addingCardsDescriptions(this.categoryKpiLists[category][0]);
          });
        }
      });
  }
  addingCardsDescriptions(kpiObject: KpiDTO) {
    this.cards = [
      {
        title: 'Definition',
        description: kpiObject.definition,
        class: 'col-12',
      },
      {
        title: 'Objective',
        description: kpiObject.objective,
        class: 'col-lg-4 col-md-6 col-sm-12',
      },
      {
        title: 'Custodian Title',
        description: kpiObject.custodianTitle,
        class: 'col-lg-4 col-md-6 col-sm-12',
      },
      {
        title: 'Validation Authority',
        description: kpiObject.validationAuthority,
        class: 'col-lg-4 col-md-6 col-sm-12',
      },
      {
        title: 'Sub-Scorecard Title',
        description: kpiObject.subscorecardTitle,
        class: 'col-lg-3 col-md-6 col-sm-12',
      },
      {
        title: 'Calculation Function',
        description: kpiObject.calculationFunction,
        class: 'col-lg-3 col-md-6 col-sm-12',
      },
      {
        title: 'Scorecard Title',
        description: kpiObject.scorecardTitle,
        class: 'col-lg-4 col-md-6 col-sm-12',
      },
      {
        title: 'Weight',
        description: kpiObject.weight * 100 + '%',
        class: 'col-lg-2 col-md-6 col-sm-12',
      },
      {
        title: 'Data Source',
        description: kpiObject.dataSource,
        class: 'col-lg-3 col-md-6 col-sm-12',
      },
      {
        title: 'KPI Direction',
        description: kpiObject.direction,
        class: 'col-lg-3 col-md-6 col-sm-12',
      },
      {
        title: 'Custodian Email',
        description: kpiObject.custodianEmail,
        class: 'col-lg-4 col-md-6 col-sm-12',
      },
      {
        title: 'Ceiling',
        description: kpiObject.ceiling + '%',
        class: 'col-lg-2 col-md-6 col-sm-12',
      },
      {
        title: 'Reporting Frequency',
        description: kpiObject.reportingFrequency,
        class: 'col-lg-3 col-md-6 col-sm-12',
      },
      {
        title: 'Reporting Period',
        description: kpiObject.reportingPeriod,
        class: 'col-lg-3 col-md-6 col-sm-12',
      },
      {
        title: 'VTD Calculation',
        description: kpiObject.vtdCalculation,
        class: 'col-lg-4 col-md-6 col-sm-12',
      },
      {
        title: 'Threshold',
        description: Math.floor(kpiObject.target * 100) + '%',
        class: 'col-lg-2 col-md-6 col-sm-12',
      },
      {
        title: 'Formula & Validation Notes',
        description: kpiObject.formula,
        class: 'col-12',
      },
    ];
  }
}
