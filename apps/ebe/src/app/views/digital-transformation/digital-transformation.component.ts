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
  DigitalTransformationTapModel,
  QAComplianceModel,
} from '../../models/digital-transformation';
import { ExecutiveSummaryComponent } from './executive-summary/executive-summary.component';
import { QaCompilanceCardComponent } from './qa-compilance-card/qa-compilance-card.component';
@Component({
  selector: 'stc-apps-digital-transformation',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    ExecutiveSummaryComponent,
    QaCompilanceCardComponent,
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
  scorecardService = inject(ScorecardService);
  qAComplianceData: QAComplianceModel[] = [];
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
          underValidationPercent: 1,
          totalTD: 59,
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
    } else if (tap.id === 5) {
      this.tabTitle = 'Capabilities Handover';
    } else if (tap.id === 6) {
      this.tabTitle = 'Disaster Recovery';
    } else if (tap.id === 7) {
      this.tabTitle = 'Key Challenges/Support Needed';
    }
  }
}
