import {
  Component,
  inject,
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
  CapabilitiesHandoverDataModel,
  DigitalTransformationTapModel,
  QAComplianceModel,
  TechnicalDebtDashboardModel,
} from '../../models/digital-transformation';
import { ExecutiveSummaryComponent } from './executive-summary/executive-summary.component';
import { QaCompilanceCardComponent } from './qa-compilance-card/qa-compilance-card.component';
import { TechnicalDebtCardComponent } from './technical-debt-card/technical-debt-card.component';
import { SidebarModule } from 'primeng/sidebar';
import { AddWorkstreamFormComponent } from './add-workstream-form/add-workstream-form.component';
@Component({
  selector: 'stc-apps-digital-transformation',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    ExecutiveSummaryComponent,
    QaCompilanceCardComponent,
    TechnicalDebtCardComponent,
    SidebarModule,
    AddWorkstreamFormComponent,
  ],
  templateUrl: './digital-transformation.component.html',
  styleUrl: './digital-transformation.component.scss',
})
export class DigitalTransformationComponent implements OnInit {
  userData!: UserModel;
  tabTitle = '';
  currTap = signal<DigitalTransformationTapModel>(
    {} as DigitalTransformationTapModel
  );
  technicalDebtDashboardModel: TechnicalDebtDashboardModel[] = [];
  scorecardService = inject(ScorecardService);
  qAComplianceData: QAComplianceModel[] = [];
  showAddWorkstreamSidebar = false;
  isWorkstreamSidebarVisible!: boolean;
  isEdit = false;
  capabilitiesHandoverData: CapabilitiesHandoverDataModel[] = [];
  digitalTransformationService = inject(DigitalTransformationService);
  digitalTransformationTaps: WritableSignal<DigitalTransformationTapModel[]> =
    signal<DigitalTransformationTapModel[]>([]);
  ngOnInit(): void {
    if (this.scorecardService.getUserGroups()) {
      this.userData = JSON.parse(
        decodeURIComponent(this.scorecardService.getUserGroups())
      );
    }
    this.digitalTransformationTaps.set(
      this.digitalTransformationService.getDigitalTransformationTaps()
    );
    this.currTap.set(this.digitalTransformationTaps()[0]);
  }
  getClickedTap(tap: DigitalTransformationTapModel): void {
    console.log('Clicked tab:', tap);
    this.qAComplianceData = [];
    this.technicalDebtDashboardModel = [];
    this.currTap.set(tap);
    if (tap.id === 2) {
      this.tabTitle = 'AI&DS QA Compliance';
      this.qAComplianceData = [
        {
          id: 1,
          title: 'B2C',
          status: 'On Track',
          heighlights: 'All artifacts are submitted and reviewed',
          requestedArtifacts: 1831,
          completed: 38,
          missingArtifacts: 228,
          completedPercent: 64.4,
        },
        {
          id: 2,
          title: 'B2B',
          status: 'at risk',
          heighlights: 'All artifacts are submitted and reviewed',
          requestedArtifacts: 1588,
          completed: 942,
          missingArtifacts: 646,
          completedPercent: 20,
        },
        {
          id: 3,
          title: 'WBU',
          status: 'at risk',
          heighlights: 'All artifacts are submitted and reviewed',
          requestedArtifacts: 301,
          completed: 294,
          missingArtifacts: 16,
          completedPercent: 13,
        },
        {
          id: 4,
          title: 'FUs',
          status: 'On Track',
          heighlights: 'All artifacts are submitted and reviewed',
          requestedArtifacts: 357,
          completed: 305,
          missingArtifacts: 32,
          completedPercent: 87,
        },
      ];
    } else if (tap.id === 3) {
      this.tabTitle = 'AI&DS QA Conformance';
      this.qAComplianceData = [
        {
          id: 1,
          title: 'B2C',
          status: 'On Track',
          heighlights: 'All artifacts are submitted and reviewed',
          requestedArtifacts: 2000,
          completed: 1603,
          missingArtifacts: 228,
          completedPercent: 50,
          underValidationPercent: 10,
        },
        {
          id: 2,
          title: 'B2B',
          status: 'delayed',
          heighlights: 'All artifacts are submitted and reviewed11111',
          requestedArtifacts: 3000,
          completed: 942,
          missingArtifacts: 646,
          completedPercent: 10,
        },
      ];
    } else if (tap.id === 4) {
      this.tabTitle = 'TD & ABL Dashboard';
      this.technicalDebtDashboardModel = [
        {
          title: 'B2C',
          id: 1,
          status: 'on track',
          heighlights: 'testtttttttttttttttttt',
          data: {
            technicalDebt: {
              closed: 38,
              closedPercent: 64.4,
              open: 20,
              delayed: 7,
              underValidation: 1,
              totalTD: 59,
            },
            archituralBacklog: {
              closed: 133,
              closedPercent: 61,
              open: 83,
              delayed: 18,
              underValidation: 2,
              totalABL: 218,
            },
          },
        },
        {
          title: 'B2B',
          id: 2,
          status: 'delayed',
          heighlights: 'testtttttttttttttttttt123',
          data: {
            technicalDebt: {
              closed: 39,
              closedPercent: 34,
              open: 74,
              delayed: 64,
              underValidation: 2,
              totalTD: 115,
            },
            archituralBacklog: {
              closed: 8,
              closedPercent: 16,
              open: 41,
              delayed: 1,
              underValidation: 2,
              totalABL: 51,
            },
          },
        },
        {
          title: 'WBU',
          id: 3,
          status: 'at risk',
          heighlights: 'testtttttttttttttttttt123',
          data: {
            technicalDebt: {
              closed: 0,
              closedPercent: 0,
              open: 5,
              delayed: 5,
              underValidation: 1,
              totalTD: 6,
            },
            archituralBacklog: {
              closed: 1,
              closedPercent: 17,
              open: 5,
              delayed: 0,
              underValidation: 0,
              totalABL: 6,
            },
          },
        },
      ];
    } else if (tap.id === 5) {
      this.tabTitle = 'Capabilities Handover';
      this.technicalDebtDashboardModel = [
        {
          title: 'B2C',
          id: 1,
          status: 'completed',
          heighlights: 'testtttttttttttttttttt',
          data: {
            technicalDebt: {
              closed: 9,
              closedPercent: 100,
              open: 0,
              delayed: 0,
              underValidation: 0,
              totalTD: 9,
            },
          },
        },
        {
          title: 'B2B',
          id: 2,
          status: 'delayed',
          heighlights: 'testtttttttttttttttttt123',
          data: {
            technicalDebt: {
              closed: 5,
              closedPercent: 42,
              open: 5,
              delayed: 1,
              underValidation: 1,
              totalTD: 12,
            },
          },
        },
        {
          title: 'WBU',
          id: 3,
          status: 'at risk',
          heighlights: 'testtttttttttttttttttt123',
          data: {
            technicalDebt: {
              closed: 1,
              closedPercent: 100,
              open: 0,
              delayed: 0,
              underValidation: 0,
              totalTD: 1,
            },
          },
        },
      ];
    } else if (tap.id === 6) {
      this.tabTitle = 'Disaster Recovery';
      this.technicalDebtDashboardModel = [
        {
          title: 'B2C',
          id: 1,
          status: 'on track',
          heighlights: 'testtttttttttttttttttt',
          data: {
            technicalDebt: {
              closed: 7,
              closedPercent: 77.87,
              open: 0,
              delayed: 2,
              underValidation: 0,
              totalTD: 9,
            },
          },
        },
        {
          title: 'B2B',
          id: 2,
          status: 'delayed',
          heighlights: 'testtttttttttttttttttt123',
          data: {
            technicalDebt: {
              closed: 8,
              closedPercent: 67,
              open: 3,
              delayed: 1,
              underValidation: 0,
              totalTD: 12,
            },
          },
        },
        {
          title: 'WBU',
          id: 3,
          status: 'at risk',
          heighlights: 'testtttttttttttttttttt123',
          data: {
            technicalDebt: {
              closed: 1,
              closedPercent: 100,
              open: 0,
              delayed: 0,
              underValidation: 0,
              totalTD: 1,
            },
          },
        },
      ];
    } else if (tap.id === 7) {
      this.tabTitle = 'Key Challenges/Support Needed';
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
