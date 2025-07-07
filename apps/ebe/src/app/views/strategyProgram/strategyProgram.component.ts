import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyProgramService } from '../../services/strategy-program.service';
import { StrategyProgramModel } from '../../models/strategy-program.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { StrategyKpiCardComponent } from './components/strategy-kpi-card/strategy-kpi-card.component';
import { ScorecardService } from '../../services/scorecard.service';
// import { EditModeViewComponent } from '../scorecard/components/edit-mode-view/edit-mode-view.component';
import { FileModel, UserModel } from '../../models/scorecard.model';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OverlayPanelModule } from 'primeng/overlaypanel';
// import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { DatePipe } from '@angular/common';
import { ActivityLogData } from '../../models/activity-logs';
import { ActivityLogService } from '../../services/activity-logs.service';
import { ColumnsSchema } from '../../models/table';
@Component({
  selector: 'stc-apps-strategy-program',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    StrategyKpiCardComponent,
    // EditModeViewComponent,
    OverlayPanelModule,
  ],
  templateUrl: './strategyProgram.component.html',
  styleUrl: './strategyProgram.component.scss',
})
export class StrategyProgramComponent implements OnInit, OnDestroy {
  strategyProgramService = inject(StrategyProgramService);
  strategyProgramData!: StrategyProgramModel;
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService);
  activityLogsTableHeader!: ColumnsSchema[];
  activityLogsTableBody = signal<ActivityLogData[]>([]);
  endSubs$: Subject<boolean> = new Subject();
  toastr = inject(ToastrService);
  constructor(private datePipe: DatePipe) {}
  activityLogServices = inject(ActivityLogService);
  userData!: UserModel;
  ngOnInit() {
    if (this.scorecardService.getUserGroups()) {
      this.userData = JSON.parse(
        decodeURIComponent(this.scorecardService.getUserGroups())
      );
    }
    this.scorecardService.toggleSwitchBtn.subscribe({
      next: (res) => {
        this.showActivityLogsPopup = false;
      },
    });
    // this.strategyProgramData = [];
    // console.log("window width => " , window.innerWidth);
    this.getStrategyProgramSummary();
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
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
  isEmptyData!: boolean;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  private getStrategyProgramSummary() {
    this.strategyProgramService
      .getStrategyProgramSummary()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: StrategyProgramModel) => {
          // console.log(res);
          this.strategyProgramData = res;
          if (this.strategyProgramData.cadStrategyProgramDTO.length === 0) {
            this.isEmptyData = true;
          } else {
            this.isEmptyData = false;
          }
        },
      });
  }
  visible!: boolean;
  showDialog() {
    this.visible = true;
  }
  ImportFile(uploadFile: FileModel | null) {
    if (uploadFile) {
      this.strategyProgramService.uploadCadSummaryFile(uploadFile).subscribe({
        next: () => {
          this.getStrategyProgramSummary();
          this.toastr.success('The File is Saved Successfully');
          this.visible = false;
        },
        error: () => {
          this.visible = false;
        },
      });
    }
  }
  downloadTemplate() {
    this.strategyProgramService.downloadStrategyProgram().subscribe({
      next: (response) => {
        this.downloadFile(response, `cad_summary.csv`);
      },
    });
  }
  downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  showActivityLogsPopup = false;
  $endScorecardActivityLogsSub: Subject<any> = new Subject();
  showActivityLogs() {
    // this.activityLogsPanel.toggle(event);
    this.getScorecardActivityLogs('CAD');
    this.showActivityLogsPopup = !this.showActivityLogsPopup;
  }
  popupClosed() {
    this.showActivityLogsPopup = false;
    this.$endScorecardActivityLogsSub.complete();
  }
  private getScorecardActivityLogs(moduleName: string) {
    this.activityLogServices
      .getSpecificActivityLog(moduleName, 'Import,Export')
      .pipe(takeUntil(this.$endScorecardActivityLogsSub))
      .subscribe({
        next: (activityLogs: ActivityLogData[]) => {
          this.activityLogsTableBody.set(activityLogs);
        },
      });
  }
}
