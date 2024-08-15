import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  kpiCard,
  KpiDTOMap,
  SectorKpisDetailsParams,
} from '../models/SectorKpisDetails.model';
import { KpiDTO } from '../../views/models/SectorKpisDetails.model';
import { SharedFormService } from '../home/services/shared-form.service';
import { DashboardService } from '../home/services/dashboard.service';
import { commentsService } from './services/comments.service';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-sector/src/environments/environment';
import { CookieService } from 'ngx-cookie';
import { LoggedUser } from './models/commentsModel';
@Component({
  selector: 'stc-apps-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  kpiObjectSignal: WritableSignal<KpiDTO | undefined> = signal(undefined);

  currentDate = new Date();
  kpiCode = window.history.state.kpiCode;
  selectedTab = window.history.state.selectedTab;
  cards: kpiCard[] = [];
  kpiDTOMap: KpiDTOMap = {};
  categoryKpiLists: { [key: string]: { [kpiName: string]: KpiDTO[] } } = {};
  baseUrl = environment.apiUrl;
  constructor(
    private sharedFormService: SharedFormService,
    private dashboardService: DashboardService,
    private commentService: commentsService,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getKpiDetails();
    // this.http
    //   .get<LoggedUser>(`${this.baseUrl}users/currentLoggedUser`)
    //   .subscribe(async (res: LoggedUser) => {
    //     // this.cookieService.put('USER_FULLNAME', res.name);
    //     console.log(JSON.stringify(res));

    //     this.cookieService.put('MODERN_SYSTEM_USER', JSON.stringify(res));
    //   });
  }

  getKpiDetails() {
    const params: SectorKpisDetailsParams = {
      ...this.sharedFormService.getForm().value,
      scorecardTitle: this.selectedTab,
      kpiCode: this.kpiCode,
    };
    this.dashboardService
      .getSectorKpisDetails(params)
      .subscribe((result: any) => {
        this.kpiDTOMap = result.kpiDTOMap;
        this.categoryKpiLists = {};
        if (this.kpiDTOMap && typeof this.kpiDTOMap === 'object') {
          Object.keys(this.kpiDTOMap).forEach((kpiSubGrouping) => {
            // Initialize an empty object for each kpiSubGrouping
            this.categoryKpiLists[kpiSubGrouping] = {};

            // Ensure that the value is an array
            const kpiArray = this.kpiDTOMap[kpiSubGrouping];
            // Loop through each KPI within the kpiSubGrouping
            Object.keys(kpiArray).forEach((kpiDTO: any) => {
              this.addingCardsDescriptions(kpiArray[kpiDTO][0]);
              this.commentService.commenstList.next(
                kpiArray[kpiDTO][0].commentList
              );
              this.categoryKpiLists[kpiSubGrouping][kpiDTO.kpiName]?.push(
                kpiDTO
              );
            });
          });
        }
      });
  }

  addingCardsDescriptions(kpiObject: KpiDTO) {
    this.kpiObjectSignal.set(kpiObject);
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
