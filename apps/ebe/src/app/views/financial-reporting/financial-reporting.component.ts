import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule, SharedService } from '@stc-apps/shared-ui';
import { FileModel, UserModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { FinancialReportingService } from '../../services/financial-reporting.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  CapexModel,
  CapexOpexModel,
  TenderingModel,
} from '../../models/financial.mode';
import { ToastrService } from 'ngx-toastr';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
// import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { DatePipe } from '@angular/common';
import { ActivityLog, ActivityLogData } from '../../models/activity-logs';
import { ActivityLogService } from '../../services/activity-logs.service';
import { DeviceService } from '../../services/device.service';
import { MobileViewHeaderComponent } from '../../components/mobile-view-header/mobile-view-header.component';
import { ColumnsSchema } from '../../models/table';
// import { TenderingStatusChartComponent } from '../../components/tendering-status-chart/tendering-status-chart.component';
@Component({
  selector: 'stc-apps-financial-reporting',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    OverlayPanelModule,
    MobileViewHeaderComponent,
  ],
  templateUrl: './financial-reporting.component.html',
  styleUrl: './financial-reporting.component.scss',
})
export class FinancialReportingComponent implements OnInit, OnDestroy {
  currentMode!: 'editMode' | 'viewMode';
  @ViewChild('capexOverlay') capexOverlay!: OverlayPanel;
  @ViewChild('opexOverlay') opexOverlay!: OverlayPanel;
  scorecardService = inject(ScorecardService);
  financialReportingService = inject(FinancialReportingService);
  visible = false;
  colors: string[] = ['#61CBD6', '#00c48c'];
  endSubs$: Subject<boolean> = new Subject();
  capexOpexData!: CapexOpexModel;
  sharedService = inject(SharedService);
  toastr = inject(ToastrService);
  activityLogsTableHeader!: ColumnsSchema[];
  activityLogsTableBody = signal<ActivityLogData[]>([]);
  activityLogService = inject(ActivityLogService);
  chartColors = ['#B999D1', '#61CBD6', '#00C48C', '#4F008C', '#000'];
  isMobile = signal<boolean>(false);
  deviceService = inject(DeviceService);
  selectedTap = 'capex';
  selectTap(tap: string) {
    this.selectedTap = tap;
  }
  opexTenderingChart: {
    title: string;
    value: number;
    color: string;
  }[] = [
    {
      title: 'Awarded',
      value: 40,
      color: '#00C48C',
    },
    {
      title: 'Saved/dropped',
      value: 20,
      color: '#8E9AA0',
    },
    {
      title: 'in progress',
      value: 40,
      color: '#4F008C',
    },
  ];
  capexTenderingChart: {
    title: string;
    value: number;
    color: string;
  }[] = [];
  spendingTargetChart: {
    name: string;
    value: number;
    color?: string;
  }[] = [];
  gepTargetChart: {
    name: string;
    value: number;
    color?: string;
  }[] = [];
  capexChartData: {
    title: string;
    value1: number;
    value2: number;
    color: string;
  }[] = [];
  capexTenderingData!: TenderingModel;
  opexTenderingData!: TenderingModel;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  constructor(private datePipe: DatePipe) {}
  userData!: UserModel;
  ngOnInit() {
    if (this.scorecardService.getUserGroups()) {
      this.userData = JSON.parse(
        decodeURIComponent(this.scorecardService.getUserGroups())
      );
    }
    this.isMobile.set(this.deviceService.isMobile());
    this.scorecardService.toggleSwitchBtn.subscribe({
      next: (res) => {
        this.showActivityLogsPopup = false;
      },
    });
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.getFinancialReportingData();
    this.activityLogsTableHeader = [
      {
        key: 'username',
        type: 'text',
        label: 'User Name',
      },
      {
        key: 'type',
        type: 'text',
        label: 'Activity Type',
      },
      // {
      //   key : "details",
      //   type : "text",
      //   label : "Activity Details"
      // },
      {
        key: 'time',
        type: 'text',
        label: 'Time Stamp',
      },
    ];
  }
  showActivityLogsPopup = false;
  showActivityLogs() {
    // this.activityLogsPanel.toggle(event);
    this.getScorecardActivityLogs('Financial');
    this.showActivityLogsPopup = !this.showActivityLogsPopup;
  }
  $endScorecardActivityLogsSub: Subject<any> = new Subject();
  private getScorecardActivityLogs(moduleName: string) {
    this.activityLogService
      .getSpecificActivityLog(moduleName, 'Import,Export')
      .pipe(takeUntil(this.$endScorecardActivityLogsSub))
      .subscribe({
        next: (activityLogs: ActivityLogData[]) => {
          // console.log(activityLogs);
          this.activityLogsTableBody.set(activityLogs);
        },
      });
  }
  popupClosed() {
    this.showActivityLogsPopup = false;
    this.$endScorecardActivityLogsSub.complete();
  }
  private getFinancialReportingData() {
    // this.capexOpexData = {"opex":[],"capex":[],"tendering":[]};
    this.financialReportingService
      .getFinancialReportingData()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: CapexOpexModel) => {
          // console.log(res);
          this.capexOpexData = res;
          this.capexTenderingData = this.capexOpexData.tendering.filter(
            (d) => d.expenditureType.toLowerCase() === 'capex'
          )[0];
          this.opexTenderingData = this.capexOpexData.tendering.filter(
            (d) => d.expenditureType.toLowerCase() === 'opex'
          )[0];
          const chartData: {
            title: string;
            value1: number;
            value2: number;
            color: string;
          }[] = [];
          this.capexOpexData.capex.forEach(
            (data2: CapexModel, index: number) => {
              chartData.push({
                title: data2.expenditureSubtype,
                value1: +data2.spendPercentage,
                value2: +data2.accrualPercentage,
                color: this.chartColors[index],
              });
            }
          );
          this.capexChartData = [...chartData];
          // this.capexChartData = [
          //   {
          //     title: 'AA',
          //     value1: 70,
          //     value2: 99,
          //     color: '#B999D1',
          //   },
          //   {
          //     title: 'DG',
          //     value1: 1.8,
          //     value2: 65.67,
          //     color: '#61CBD6',
          //   },
          //   {
          //     title: 'SA',
          //     value1: 22,
          //     value2: 22,
          //     color: '#00C48C',
          //   },
          //   {
          //     title: 'SA2',
          //     value1: 22,
          //     value2: 22,
          //     color: '#00C48C',
          //   },
          //   {
          //     title: 'SA3',
          //     value1: 22,
          //     value2: 22,
          //     color: '#00C48C',
          //   },
          //   {
          //     title: 'SA4',
          //     value1: 22,
          //     value2: 22,
          //     color: '#00C48C',
          //   },
          // ];
          if (this.capexTenderingData) {
            this.capexTenderingChart = [
              {
                title: 'Awarded',
                value: +this.capexTenderingData.awardedProjects,
                color: '#00C48C',
              },
              {
                title: 'Saved/dropped',
                value: +this.capexTenderingData.savedDroppedProjects,
                color: '#8E9AA0',
              },
              {
                title: 'in progress',
                value: +this.capexTenderingData.inProgressProjects,
                color: '#4F008C',
              },
            ];
          }
          if (this.opexTenderingData) {
            this.opexTenderingChart = [
              {
                title: 'Awarded',
                value: +this.opexTenderingData.awardedProjects,
                color: '#00C48C',
              },
              {
                title: 'Saved/dropped',
                value: +this.opexTenderingData.savedDroppedProjects,
                color: '#8E9AA0',
              },
              {
                title: 'in progress',
                value: +this.opexTenderingData.inProgressProjects,
                color: '#4F008C',
              },
            ];
          }
          // console.log(res);
          // console.log(this.capexTenderingData);
          // console.log(this.opexTenderingData);
          // console.log(this.capexTenderingChart);
          // console.log(this.opexTenderingChart);
          if (
            this.capexOpexData.opex[0] &&
            this.capexOpexData.opex[0].accrualPercentage
          ) {
            this.spendingTargetChart = [
              {
                name: 'Accural',
                value: +this.capexOpexData.opex[0].accrualPercentage,
                color: '#4F008C',
              },
              {
                name: 'Spent',
                value: +this.capexOpexData.opex[0].spendPercentage,
                color: '#00B050',
              },
            ];
          }
          // console.log(this.spendingTargetChart);
          if (
            this.capexOpexData.opex[0] &&
            this.capexOpexData.opex[0].gepTargetPercentage
          ) {
            this.gepTargetChart = [
              {
                name: 'Target',
                value: this.capexOpexData.opex[0].gepTargetPercentage
                  ? this.capexOpexData.opex[0].gepTargetPercentage
                  : 0,
                color: '#4F008C',
              },
              {
                name: 'Achieved',
                value: this.capexOpexData.opex[0].gepAchievedPercentage
                  ? this.capexOpexData.opex[0].gepAchievedPercentage
                  : 0,
                color: '#00B050',
              },
            ];
          }
        },
      });
  }
  showDialog() {
    this.visible = true;
  }
  downloadTemplate() {
    this.financialReportingService.downloadFinancialReportingData();
  }
  importData(file: FileModel) {
    if (file) {
      // console.log(file);
      this.financialReportingService.uploadCadSummaryFile(file).subscribe({
        next: () => {
          this.getFinancialReportingData();
          this.toastr.success('The File is Saved Successfully');
          this.visible = false;
        },
        error: () => {
          this.visible = false;
        },
      });
    }
  }
  onHide() {
    this.visible = false;
  }
}
