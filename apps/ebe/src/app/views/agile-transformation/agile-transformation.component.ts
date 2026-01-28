import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { MobileViewHeaderComponent } from '../../components/mobile-view-header/mobile-view-header.component';
import { DigitalTransformationTapModel } from '../../models/digital-transformation';
import { UserModel } from '../../models/scorecard.model';
import { DeviceService } from '../../services/device.service';
import { ScorecardService } from '../../services/scorecard.service';
import { AgileExecutiveSummaryComponent } from './agile-executive-summary/agile-executive-summary.component';
import { BauDeliveryPerformanceComponent } from './bau-delivery-performance/bau-delivery-performance.component';
import { EstimatedEffortsCalculatorComponent } from './estimated-efforts-calculator/estimated-efforts-calculator.component';
import { QbrStatusComponent } from './qbr-status/qbr-status.component';

@Component({
  selector: 'stc-apps-agile-transformation',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    MobileViewHeaderComponent,
    AgileExecutiveSummaryComponent,
    QbrStatusComponent,
    BauDeliveryPerformanceComponent,
    EstimatedEffortsCalculatorComponent,
  ],
  templateUrl: './agile-transformation.component.html',
  styleUrl: './agile-transformation.component.scss',
})
export class AgileTransformationComponent implements OnInit {
  userData!: UserModel;
  isMobile = signal<boolean>(false);
  deviceService = inject(DeviceService);
  scorecardService = inject(ScorecardService);
  agileTransformationTabs = signal<DigitalTransformationTapModel[]>([
    {
      id: 1,
      name: 'Executive Summary',
      value: 'Executive Summary',
    },
    {
      id: 2,
      name: 'QBR Status',
      value: 'QBR Status',
    },
    {
      id: 3,
      name: 'BAU Delivery Performance',
      value: 'BAU Delivery Performance',
    },
    {
      id: 4,
      name: 'Estimated Efforts Calculator',
      value: 'Estimated Efforts Calculator',
    },
  ]);
  currTap = signal<DigitalTransformationTapModel | null>(null);

  ngOnInit(): void {
    this.isMobile.set(this.deviceService.isMobile());
    const userGroups = this.scorecardService.getUserGroups();
    if (userGroups) {
      this.userData = JSON.parse(decodeURIComponent(userGroups));
    }
    const tabs = this.agileTransformationTabs();
    if (tabs.length) {
      this.currTap.set(tabs[0]);
    }
  }

  getClickedTap(tap: DigitalTransformationTapModel): void {
    this.currTap.set(tap);
  }
}
