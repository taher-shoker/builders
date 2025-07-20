import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { UserModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { DigitalTransformationService } from '../../services/digital-transformation.service';
import {
  AddWorkstreamFormModel,
  DigitalTransformationTapModel,
  IDigitalTransformationTap,
  pageDetailsModel,
  TechnicalDebtDashboardModel,
} from '../../models/digital-transformation';
import { ExecutiveSummaryComponent } from './executive-summary/executive-summary.component';
import { QaCompilanceCardComponent } from './qa-compilance-card/qa-compilance-card.component';
import { TechnicalDebtCardComponent } from './technical-debt-card/technical-debt-card.component';
import { SidebarModule } from 'primeng/sidebar';
import { AddWorkstreamFormComponent } from './add-workstream-form/add-workstream-form.component';
import { Subject, takeUntil } from 'rxjs';
import { KeyChallengesTableComponent } from './key-challenges-table/key-challenges-table.component';
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
  ],
  templateUrl: './digital-transformation.component.html',
  styleUrl: './digital-transformation.component.scss',
})
export class DigitalTransformationComponent implements OnInit, OnDestroy {
  userData!: UserModel;
  tabTitle = '';
  currTap = signal<DigitalTransformationTapModel>(
    {} as DigitalTransformationTapModel
  );
  technicalDebtDashboardModel: TechnicalDebtDashboardModel[] = [];
  scorecardService = inject(ScorecardService);
  // qAComplianceData: QAComplianceModel[] = [];
  showAddWorkstreamSidebar = false;
  isWorkstreamSidebarVisible!: boolean;
  isEdit = false;
  // capabilitiesHandoverData: CapabilitiesHandoverDataModel[] = [];
  digitalTransformationService = inject(DigitalTransformationService);
  digitalTransformationTaps: WritableSignal<DigitalTransformationTapModel[]> =
    signal<DigitalTransformationTapModel[]>([]);
  tapsDetailsData: pageDetailsModel[] = [];
  endSubs$: Subject<any> = new Subject();
  firstTapTitles: string[] = [];
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
    this.tapsDetailsData = [];
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
    if (this.currTap().id !== 1 && this.currTap().id !== 8) {
      this.getDigitalTransformationDetailsData(this.currTap().id);
    }
  }
  hideAddWorkstreamSidebar() {
    this.isWorkstreamSidebarVisible = false;
  }
  showWorkStreamSidebar() {
    this.showAddWorkstreamSidebar = true;
  }
  addWorkStream(workStreamData: AddWorkstreamFormModel) {
    console.log(workStreamData);
  }
}
