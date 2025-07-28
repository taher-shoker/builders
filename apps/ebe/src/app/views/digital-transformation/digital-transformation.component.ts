import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { UserModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { DigitalTransformationService } from '../../services/digital-transformation.service';
import {
  AddKeyChallengeDataModel,
  AddWorkstreamFormModel,
  CreateWorkStreamModel,
  DigitalTransformationTapModel,
  IDigitalTransformationTap,
  pageDetailsModel,
  TechnicalDebtDashboardModel,
} from '../../models/digital-transformation';
import { ExecutiveSummaryComponent } from './executive-summary/executive-summary.component';
import { QaCompilanceCardComponent } from './qa-compilance-card/qa-compilance-card.component';
import { SidebarModule } from 'primeng/sidebar';
import { AddWorkstreamFormComponent } from './add-workstream-form/add-workstream-form.component';
import { Subject, takeUntil } from 'rxjs';
import { KeyChallengesTableComponent } from './key-challenges-table/key-challenges-table.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'stc-apps-digital-transformation',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    ExecutiveSummaryComponent,
    QaCompilanceCardComponent,
    KeyChallengesTableComponent,
    SidebarModule,
    AddWorkstreamFormComponent,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './digital-transformation.component.html',
  styleUrl: './digital-transformation.component.scss',
})
export class DigitalTransformationComponent implements OnInit, OnDestroy {
  userData!: UserModel;
  tabTitle = '';
  toastr = inject(ToastrService);
  currTap = signal<DigitalTransformationTapModel>(
    {} as DigitalTransformationTapModel
  );
  datePipe = inject(DatePipe);
  technicalDebtDashboardModel: TechnicalDebtDashboardModel[] = [];
  scorecardService = inject(ScorecardService);
  // qAComplianceData: QAComplianceModel[] = [];
  showAddWorkstreamSidebar = false;
  isWorkstreamSidebarVisible!: boolean;
  isEdit = false;
  confirmationService = inject(ConfirmationService);
  // capabilitiesHandoverData: CapabilitiesHandoverDataModel[] = [];
  digitalTransformationService = inject(DigitalTransformationService);
  digitalTransformationTaps = signal<DigitalTransformationTapModel[]>([]);
  tapsDetailsData: pageDetailsModel[] = [];
  endSubs$: Subject<any> = new Subject();
  firstTapTitles: string[] = [];
  showChallengesSidebar = false;
  private getDigitalTransformationData() {
    this.digitalTransformationService
      .getDigitalTransformationData()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: IDigitalTransformationTap[]) => {
          const taps: DigitalTransformationTapModel[] = [];
          res.forEach((tap) => {
            taps.push({
              id: tap.id,
              name: tap.pageName,
              value: tap.subpageName,
            });
            if (tap.id === 1 || tap.id === 2) {
              this.firstTapTitles.push(tap.subpageName);
            }
          });
          const uniqueArray = taps.filter(
            (obj, index, self) =>
              index === self.findIndex((t) => t.name === obj.name)
          );
          this.digitalTransformationTaps.set(uniqueArray);
          this.currTap.set(this.digitalTransformationTaps()[0]);
          // this.getDigitalTransformationDetailsData(this.currTap().id);
          console.log(this.firstTapTitles);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  private getDigitalTransformationDetailsData(pageId: number) {
    // this.tapsDetailsData = [];
    this.digitalTransformationService
      .getDigitalTransformationDetailsData(pageId)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: pageDetailsModel[]) => {
          this.tapsDetailsData = res;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  ngOnInit(): void {
    if (this.scorecardService.getUserGroups()) {
      this.userData = JSON.parse(
        decodeURIComponent(this.scorecardService.getUserGroups())
      );
    }
    this.getDigitalTransformationData();
  }
  getClickedTap(tap: DigitalTransformationTapModel): void {
    console.log('Clicked tab:', tap);
    if (this.currTap() && this.currTap().id === tap.id) {
      return; // Exit early
    }
    // this.qAComplianceData = [];
    // this.technicalDebtDashboardModel = [];
    this.currTap.set(tap);
    if (
      this.currTap().id !== 1 &&
      this.currTap().id !== 8 &&
      this.currTap().id !== 9
    ) {
      this.getDigitalTransformationDetailsData(this.currTap().id);
    }
  }
  hideAddWorkstreamSidebar() {
    this.isWorkstreamSidebarVisible = false;
  }
  editedData: pageDetailsModel | null = null;
  showWorkStreamSidebar(data: pageDetailsModel) {
    if (data) {
      this.editedData = { ...data };
    }
    this.showAddWorkstreamSidebar = true;
  }
  convertHeighlights(heighlights: string): string {
    // const lines = heighlights.split('\n');
    const lines = heighlights.split(' ');
    const result = lines.map((line, index) => {
      const parts = line.split(':');
      const title = parts[0].trim();
      const value = parts.length > 1 ? parts[1].trim() : '';
      if (!line.includes(':')) {
        return {
          id: index + 1,
          value: title,
        };
      }
      return {
        id: index + 1,
        title,
        value,
      };
    });
    return JSON.stringify(result);
  }
  addWorkStream(workStreamData: AddWorkstreamFormModel) {
    let metricsArr = [];
    if (this.currTap().id === 3) {
      metricsArr = [
        {
          name: 'Requested artifacts',
          value: workStreamData.requestedArtifact ?? 0,
        },
        {
          name: 'completed',
          value: workStreamData.completed ?? 0,
        },
        {
          name: 'missing artifacts',
          value: workStreamData.missingArtifacts ?? 0,
        },
      ];
    } else {
      metricsArr = [
        {
          name: 'actual',
          value: workStreamData.actual ?? 0,
        },
        {
          name: 'planned',
          value: workStreamData.planned ?? 0,
        },
      ];
    }
    const data: CreateWorkStreamModel = {
      pageId: this.currTap().id,
      businessUnit: workStreamData.title,
      projects:
        this.currTap().id !== 5 &&
        this.currTap().id !== 6 &&
        this.currTap().id !== 7
          ? [
              {
                projectStatus: workStreamData.status,
                metrics: metricsArr,
                projectHighlights: workStreamData.heighlights
                  ? this.convertHeighlights(workStreamData.heighlights)
                  : workStreamData.highlights
                  ? this.convertHeighlights(workStreamData.highlights)
                  : null,
              },
            ]
          : this.currTap().id === 5
          ? [
              {
                projectStatus: workStreamData.status,
                projectName: 'Technical Dept',
                metrics: [
                  {
                    name: 'closed',
                    value: workStreamData.technicalDebt?.closed ?? 0,
                  },
                  {
                    name: 'open',
                    value: workStreamData.technicalDebt?.open ?? 0,
                  },
                  {
                    name: 'delayed',
                    value: workStreamData.technicalDebt?.delayed ?? 0,
                  },
                  {
                    name: 'under verfication',
                    value: workStreamData.technicalDebt?.underVerification ?? 0,
                  },
                  {
                    name: 'total TD',
                    value: workStreamData.technicalDebt?.totalTD ?? 0,
                  },
                ],
                // totalTD: workStreamData.technicalDebt?.totalTD,
                projectHighlights: workStreamData.heighlights
                  ? this.convertHeighlights(workStreamData.heighlights)
                  : workStreamData.highlights
                  ? this.convertHeighlights(workStreamData.highlights)
                  : null,
              },
              {
                projectStatus: workStreamData.status,
                projectName: 'Architectual Backlog',
                metrics: [
                  {
                    name: 'closed',
                    value: workStreamData.architecturalBacklog?.closed ?? 0,
                  },
                  {
                    name: 'open',
                    value: workStreamData.architecturalBacklog?.open ?? 0,
                  },
                  {
                    name: 'delayed',
                    value: workStreamData.architecturalBacklog?.delayed ?? 0,
                  },
                  {
                    name: 'under verfication',
                    value:
                      workStreamData.architecturalBacklog?.underVerification ??
                      0,
                  },
                  {
                    name: 'total ABL',
                    value: workStreamData.architecturalBacklog?.totalTD ?? 0,
                  },
                ],
                // totalTD: workStreamData.architecturalBacklog?.totalTD,
                projectHighlights: workStreamData.heighlights
                  ? this.convertHeighlights(workStreamData.heighlights)
                  : workStreamData.highlights
                  ? this.convertHeighlights(workStreamData.highlights)
                  : null,
              },
            ]
          : [
              {
                projectStatus: workStreamData.status,
                metrics: [
                  {
                    name: 'completed',
                    value: workStreamData.technicalDebt?.closed ?? 0,
                  },
                  {
                    name: this.currTap().id !== 7 ? 'open' : 'on track',
                    value: workStreamData.technicalDebt?.open ?? 0,
                  },
                  {
                    name: 'delayed',
                    value: workStreamData.technicalDebt?.delayed ?? 0,
                  },
                  {
                    name: 'on hold',
                    value: workStreamData.technicalDebt?.underVerification ?? 0,
                  },
                  {
                    name: 'total capabilities',
                    value: workStreamData.technicalDebt?.totalTD ?? 0,
                  },
                ],
                projectHighlights: workStreamData.heighlights
                  ? this.convertHeighlights(workStreamData.heighlights)
                  : workStreamData.highlights
                  ? this.convertHeighlights(workStreamData.highlights)
                  : null,
              },
            ],
    };
    console.log(data);
    console.log('workStreamData => ', workStreamData);
    this.digitalTransformationService.createNewWorkStream(data).subscribe({
      next: (res) => {
        this.getDigitalTransformationDetailsData(this.currTap().id);
        this.toastr.success('The workstream is added successfully');
        this.showAddWorkstreamSidebar = false;
      },
    });
  }
  challengeFormData!: AddKeyChallengeDataModel;
  isChallengeAdded = false;
  addChallengeData(workStreamData: any) {
    const formatted = this.datePipe.transform(
      workStreamData.dateRaised,
      'MM/dd/yyyy'
    );
    workStreamData.dateRaised = formatted;
    this.challengeFormData = {
      description: workStreamData.description,
      raisedBy: workStreamData.raisedBy,
      owner: workStreamData.owner,
      dateRaised: workStreamData.dateRaised,
      impact: workStreamData.impact,
      supportNeeded: workStreamData.supportNeeded,
    };
    this.digitalTransformationService
      .addKeyChallengrsData(this.challengeFormData)
      .subscribe({
        next: () => {
          this.showChallengesSidebar = false;
          this.isChallengeAdded = true;
          this.toastr.success('The Challenge is added successfully');
        },
        error: () => {
          this.isChallengeAdded = false;
        },
      });
  }
  deletedItem: any;
  showDeleteDialog(data: any) {
    this.confirmationService.confirm({});
    this.deletedItem = data;
  }
  deleteChallenge() {
    console.log(this.deletedItem);
  }
  closeDialog() {
    this.confirmationService.close();
  }
}
