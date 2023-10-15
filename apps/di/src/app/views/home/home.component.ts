/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, inject } from '@angular/core';
import {
  DonutChartData,
  LabelLine,
  ProgressCircleData,
} from '@stc-apps/shared-ui';
import { DataService } from '../../shared/services/data.service';
import { LevelZeroResponse } from './../../shared/models/http-response.model';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dataService = inject(DataService);
  authService = inject(AuthService);
  router = inject(Router);

  username: string = "";

  data: ProgressCircleData[] = [
    { category: 'TECHNOLOGY DI ', value: 20 },
    { category: 'FU DI', value: 50 },
    { category: 'CLUSTER DI', value: 90 },
  ];

  overallScore: number = 0;
  overallTarget: number = 0;
  overallDelta: number = 0;

  progressCircleLabels: LabelLine[] = [
    // {
    //   html: `<p><img style="margin-bottom: 8px;width:40px;" src="assets/images/stc-logo1.png"> <span style="font-weight:bold;">DI</span></p>`,
    //   centerY: 17,
    // },
    // {
    //   html: `<p style="color:#00c48c; font-weight:bold">${this.overallScore}%<span style="font-weight:normal; color:black; margin-left:6px">/${this.overallTarget}%</span></p>`,
    //   centerY: -30,
    // },
    // {
    //   html: `<p><i style="color:#00c48c;font-size: 14px" class="fas fa-solid fa-arrow-up"></i> ${this.overallDelta}%</p>`,
    //   centerY: -70,
    // },
    // { html: `<p>From last month</p>`, centerY: -100 },
  ];

  busData: DonutChartData[] = [
    { category: 'Digital Experience & Impact', value: 0 },
    { category: 'Capability Utilization', value: 0 },
    { category: 'Capability Building', value: 0 },
  ];

  fusData: DonutChartData[] = [
    { category: 'Digital Experience & Impact', value: 0 },
    { category: 'Capability Utilization', value: 0 },
    { category: 'Capability Building', value: 0 },
  ];

  techData: DonutChartData[] = [
    { category: 'Digital Experience & Impact', value: 0 },
    { category: 'Capability Utilization', value: 0 },
    { category: 'Capability Building', value: 0 },
  ];

  busLabels: LabelLine[] = [
    { value: 'BUs DI', styles: '[bold]', centerY: 90, fontSize: 12 },
    { value: '0', styles: '[#00c48c][bold]', centerY: 27, fontSize: 22 },
  ];

  fusLabels: LabelLine[] = [
    { value: 'FUs DI', styles: '[bold]', centerY: 90, fontSize: 12 },
    { value: '0', styles: '[#bb2222][bold]', centerY: 27, fontSize: 22 }, // red-Color-dark #bb2222
  ];

  techLabels: LabelLine[] = [
    { value: 'Technology DI', styles: '[bold]', centerY: 90, fontSize: 12 },
    { value: '0', styles: '[#00c48c][bold]', centerY: 27, fontSize: 22 }, // Oasis green color #00c48c
  ];

  buDeltaAchieved!: boolean;
  fuDeltaAchieved!: boolean;
  techDeltaAchieved!: boolean;

  // Scores :
  buScore!: number;
  fuScore!: number;
  techScore!: number;

  // Targets :
  buTarget!: number;
  fuTarget!: number;
  techTarget!: number;

  // Deltas :
  buDelta!: number;
  fuDelta!: number;
  techDelta!: number;

  progressColors = ['#1cced8', '#a54ee1', '#45006F']; // Big STC Circle colors
  donutColors = ['#1cced8', '#ffdd40', '#ff6a39']; // Donuts colors

  ngOnInit(): void {

    this.authService.displayName

    this.authService.displayName.subscribe(res => {
      this.username = res
    })
    this.dataService.getLevelZeroData().subscribe((res: LevelZeroResponse) => {
      console.log('Home res', res);

      const config = [
        {
          bName: 'busLabels',
          propOfDataResponse: 'BUs',
          bNameData: 'busData',
          bNameScore: 'buScore',
          bNameTarget: 'buTarget',
          bNameDelta: 'buDelta',
        },
        {
          bName: 'fusLabels',
          propOfDataResponse: 'FUs',
          bNameData: 'fusData',
          bNameScore: 'fuScore',
          bNameTarget: 'fuTarget',
          bNameDelta: 'fuDelta',
        },
        {
          bName: 'techLabels',
          propOfDataResponse: 'Technology',
          bNameData: 'techData',
          bNameScore: 'techScore',
          bNameTarget: 'techTarget',
          bNameDelta: 'techDelta',
        },
      ];

      for (const configElement of config) {
        this.distributeBusinessNameOverall(
          res,
          configElement.bName,
          configElement.propOfDataResponse
        );
        this.distributeBusinessNameData(
          res,
          configElement.bNameData,
          configElement.propOfDataResponse
        );
        this.populateScores(
          res,
          configElement.bNameScore,
          configElement.propOfDataResponse
        );
        this.populateTargets(
          res,
          configElement.bNameTarget,
          configElement.propOfDataResponse
        );
        this.populateDeltas(
          res,
          configElement.bNameDelta,
          configElement.propOfDataResponse
        );
      }
      this.populateSTCOverall(res);

      this.buDeltaAchieved =
        res.data.BUs[0].achievedFlag === '0' ? false : true;
      this.fuDeltaAchieved =
        res.data.FUs[0].achievedFlag === '0' ? false : true;
      this.techDeltaAchieved =
        res.data.Technology[0].achievedFlag === '0' ? false : true;
    });
  }

  populateSTCOverall(data: LevelZeroResponse) {
    this.overallScore = data.data.Overall[0].score;
    this.overallTarget = data.data.Overall[0].target;
    this.overallDelta = data.data.Overall[0].monthDiff;

    const temp = [
      {
        html: `<p><img style="margin-bottom: 8px;width:40px;" src="assets/images/stc-logo1.png"> <span style="font-weight:bold;">DI</span></p>`,
        centerY: 17,
      },
      {
        html: `<p style="color:#00c48c; font-weight:bold">${this.overallScore}%<span style="font-weight:normal; color:black; margin-left:6px">/${this.overallTarget}%</span></p>`,
        centerY: -30,
      },
      {
        html: `<p><i style="color:#00c48c;font-size: 14px" class="fas fa-solid fa-arrow-up"></i> ${this.overallDelta}%</p>`,
        centerY: -70,
      },
      { html: `<p>From last month</p>`, centerY: -100 },
    ];
    this.progressCircleLabels = [...temp];
  }

  distributeBusinessNameOverall(
    data: LevelZeroResponse,
    businessName: string,
    lookUpPropName: string
  ) {
    this[businessName][1].value = data.data[lookUpPropName][0].score + '%';
    const temp = { [businessName]: this[businessName] };
    this[businessName] = [...temp[businessName]];

    if (businessName === 'busLabels') {
      this.data[0].value = data.data[lookUpPropName][0].score;
    } else if (businessName === 'fusLabels') {
      this.data[1].value = data.data[lookUpPropName][0].score;
    } else {
      this.data[2].value = data.data[lookUpPropName][0].score;
    }

    const dataTemp = this.data;
    this.data = [...dataTemp];
  }

  populateScores(
    data: LevelZeroResponse,
    businessName: string,
    lookUpPropName: string
  ) {
    this[businessName] = data.data[lookUpPropName][0].score + '%';
  }

  populateTargets(
    data: LevelZeroResponse,
    businessName: string,
    lookUpPropName: string
  ) {
    this[businessName] = data.data[lookUpPropName][0].target + '%';
  }

  populateDeltas(
    data: LevelZeroResponse,
    businessName: string,
    lookUpPropName: string
  ) {
    this[businessName] = data.data[lookUpPropName][0].monthDiff + '%';
  }

  distributeBusinessNameData(
    data: LevelZeroResponse,
    businessName: string,
    lookUpPropName: string
  ) {
    for (let i = 1; i < 4; i++) {
      this[businessName][i - 1].value = data.data[lookUpPropName][i].score;
      this[businessName][i - 1].category = data.data[lookUpPropName][i].dimension;
      const temp = { [businessName]: this[businessName] };
      this[businessName] = [...temp[businessName]];
    }
  }

  navToTrend(buName: string){
    console.log()
    this.router.navigate(['/trend'])
  }
}
