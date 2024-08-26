import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  kpiCard,
  KpiDetailsResponse,
  KpiDTOMap,
  SectorKpisDetailsParams,
} from '../models/SectorKpisDetails.model';
import { KpiDTO } from '../../views/models/SectorKpisDetails.model';
import { SharedFormService } from '../home/services/shared-form.service';
import { DashboardService } from '../home/services/dashboard.service';
import { commentsService } from './services/comments.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-sector/src/environments/environment';
import { CookieService } from 'ngx-cookie';
import { sectorUsersParams, user } from './models/commentsModel';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'stc-apps-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  kpiObjectSignal: WritableSignal<KpiDTO | undefined> = signal(undefined);
  sectorUsersSignal: WritableSignal<user[] | undefined> = signal(undefined);
  currentDate = new Date();
  kpiCode = window.history.state.kpiCode;
  selectedTab = window.history.state.selectedTab;
  kpiName = window.history.state.kpiName;
  cards: kpiCard[] = [];
  kpiDTOMap: KpiDTOMap = {};
  pathKpiCode: string | null = '';
  loggedUserID = 0;
  categoryKpiLists: { [key: string]: { [kpiName: string]: KpiDTO[] } } = {};
  baseUrl = environment.apiUrl;
  constructor(
    private sharedFormService: SharedFormService,
    private dashboardService: DashboardService,
    private commentService: commentsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.pathKpiCode = paramMap.get('KPICode');
    });
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (
        params['kpiCode'] &&
        params['year'] &&
        params['quarter'] &&
        params['sectorName'] &&
        params['scorecardTitle']
      ) {
        console.log('params');
        const paramsAPI: SectorKpisDetailsParams = {
          year: params['year'],
          quarter: params['quarter'],
          sectorName: params['sectorName'],
          scorecardTitle: params['scorecardTitle'],
          kpiCode: params['kpiCode'],
        };
        this.getKpiDetails(paramsAPI);
        const paramsUsers: sectorUsersParams = {
          system: 'Score_Card_Report_DB',
          team: params['sectorName'],
        };
        this.getSectorUsers(paramsUsers);
      } else {
        const selectedTab = this.cookieService.get('selectedTab');
        const params: SectorKpisDetailsParams = {
          ...this.sharedFormService.getForm().value,
          scorecardTitle: selectedTab,
          kpiCode: this.pathKpiCode,
        };
        this.getKpiDetails(params);
        const paramsUsers: sectorUsersParams = {
          system: 'Score_Card_Report_DB',
          team: this.sharedFormService.getForm().value.sectorName,
        };
        this.getSectorUsers(paramsUsers);
      }
    });

    // console.log(this.kpiName);

    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.authService.getUserData();
      this.authService.loggedUserStream.subscribe((res) => {
        this.loggedUserID = res?.id || 0;
      });
    }
  }
  getSectorUsers(params: sectorUsersParams) {
    this.notificationService.getSectorUsers(params).subscribe({
      next: (result: user[]) => {
        result = result.filter((mention) => mention.id !== this.loggedUserID);
        this.sectorUsersSignal.set(result);

        this.notificationService.mentionsList.next(result);
      },
    });
  }
  getKpiDetails(params: SectorKpisDetailsParams) {
    this.dashboardService
      .getSectorKpisDetails(params)
      .subscribe((result: KpiDetailsResponse) => {
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
              this.dashboardService.kpiNameSubject.next(
                kpiArray[kpiDTO][0].kpiName
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
