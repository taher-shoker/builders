import { Component, OnInit } from '@angular/core';
import { kpiCard, kpiDetailsParams } from './models/kpiDetailsModel';

import { kpiInfoService } from '../../services/kpi-info.service';
import { KpiDTOMap } from '../models/SectorKpisDetails.model';
import { KpiDTO } from '../../views/models/SectorKpisDetails.model';
@Component({
  selector: 'stc-apps-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  currentDate = new Date();
  kpiCode = window.history.state.kpiCode;
  cards: kpiCard[] = [];
  kpiDTOMap: KpiDTOMap = {};
  categoryKpiLists: { [key: string]: KpiDTO[] } = {};

  constructor(private kpiDetailsService: kpiInfoService) {}

  ngOnInit(): void {
    this.getKpiDetails();
  }
  getKpiDetails() {
    const params: kpiDetailsParams = {
      year: '2023',
      quarter: '1',
      sectorName: 'Group Business Unit',
      scorecardTitle: 'Group Business Unit',
      kpiCode: 'GBU-13',
    };
    this.kpiDetailsService.getKpiDetails(params).subscribe((result: any) => {
      this.kpiDTOMap = result.kpiDTOMap;
      Object.keys(this.kpiDTOMap).forEach((category) => {
        this.categoryKpiLists[category] = this.kpiDTOMap[category];
        this.addingCardsDescriptions(this.categoryKpiLists[category][0]);
      });
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
        description: '85%',
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

// {
//   text: 'Measures the STC KSA Earning before Interest and Taxes (EBIT) as reported in stc consolidated financial statements. The FY target is based on the latest budget approved by the BOD',
//   list: [
//     'A = B - C - D',
//     'Where,',
//     'A = STC KSA EBIT',
//     'B = STC KSA Revenues',
//     'C = STC KSA Cost of Goods Sold',
//   ],
//   notes: [
//     'Finance team shall communicate the validated and approved figures for COM official reference.',
//     'CPM shall not consider any target or actual received from sources other than the KPI custodian officially assigned by the finance team.',
//     'KPI Target is subject to further revision based on the official input received from the finance team aligned with the approved budget.',
//   ],
// },
