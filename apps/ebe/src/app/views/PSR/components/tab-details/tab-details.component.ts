import {
  Component,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRProjectCardComponent } from '../project-card/project-card.component';
import { PSRDataModel } from '../../../../models/psr.model';
import { ScorecardService } from '../../../../services/scorecard.service';
// import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { FileModel, UserGroup } from '../../../../models/scorecard.model';
import { PSRService } from '../../../../services/psr.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { MenuPopupComponent } from '../../../../components/menu-popup/menu-popup.component';
import { ActivityLog, ActivityLogData, ColumnsSchema } from '../../../../models/activity-logs';
import { ActivityLogService } from '../../../../services/activity-logs.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'stc-apps-tab-details',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    PSRProjectCardComponent,
    RouterLink,
    EditModeViewComponent,
    MenuPopupComponent
  ],
  templateUrl: './tab-details.component.html',
  styleUrl: './tab-details.component.scss',
})
export class TabDetailsComponent implements OnInit {
  @Output() getUploadedFile: EventEmitter<FileModel> = new EventEmitter();
  visible = false;
  projects: InputSignal<PSRDataModel[]> = input.required<PSRDataModel[]>();
  @Output() ProgramId: EventEmitter<number> = new EventEmitter();
  isEmpty: InputSignal<boolean> = input.required<boolean>();
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService);
  psrService = inject(PSRService);
  router = inject(Router);
  activityLogsTableHeader!:ColumnsSchema[];
  activityLogsTableBody = signal<ActivityLogData[]>([]);
  projectActivityLogsTableHeader!:ColumnsSchema[];
  projectActivityLogsTableBody!:ActivityLog[];
  activityLogService = inject(ActivityLogService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  datePipe = inject(DatePipe);
  userRoles!: UserGroup;
  isAllowed = false;
  isAdmin = false;
  @ViewChild(MenuPopupComponent) child?: MenuPopupComponent;
  menuItems = [
    {
      label: 'activity log',
      icon: "pi pi-clock"
    },
    {
      label: 'show deleted programs',
      icon: "pi pi-eye"
    }
  ];
  actionButton(label:string)
  {
    if(label === 'activity log')
    {
      this.showActivityLogsPopup = !this.showActivityLogsPopup;
      this.getSpecificActivityLog("PSR_executive" , '' , '' , '' ,  true)
    } else {
      this.router.navigateByUrl("/deleted-projects/programs");
    }
  }
  showActivityLogsPopup = false;
  $endScorecardActivityLogsSub:Subject<any> = new Subject();
  popupClosed()
  {
    this.showActivityLogsPopup = false;
  }
  private getSpecificActivityLog(moduleName:string , subModule?:string , projectName?:string , entity?:string , showParentData?:boolean)
    {
      this.activityLogService.getSpecificActivityLog(moduleName , "Import,Export,Add,Delete" , subModule , projectName , entity , showParentData).pipe(takeUntil(this.$endScorecardActivityLogsSub)).subscribe({
        next : (activityLogs:ActivityLogData[]) => {
          this.activityLogsTableBody.set(activityLogs);
        }
      })
    }
    isPMO = false;
  ngOnInit(): void {
    this.activityLogsTableHeader = [
      {
        key : "username",
        type : "text",
        label : "User Name"
      },
      {
        key : "type",
        type : "text",
        label : "Activity Type"
      },
      {
        key : "details",
        type : "text",
        label : "Activity Details"
      },
      {
        key : "time",
        type : "text",
        label : "Time Stamp"
      },
    ]
    this.projectActivityLogsTableBody = [
      {
        username:"Hamed Rahed1",
        type:"import",
        details:"financial of scorecards",
        time:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        oldValue : "old value old value old value old value old value old value old value old value old value old value old value old value old value old value old value old value",
        newValue : "new value"
      },
      {
        username:"Hamed Rahed2",
        type:"import",
        details:"financial of scorecards",
        time:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        oldValue : "old value",
        newValue : "new value"
      },
      {
        username:"Hamed Rahed3",
        type:"import",
        details:"financial of scorecards",
        time:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        oldValue : "old value",
        newValue : "new value"
      },
      {
        username:"Hamed Rahed4",
        type:"import",
        details:"financial of scorecards",
        time:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!,
        oldValue : "old value",
        newValue : "new value"
      },
    ]
    this.projectActivityLogsTableHeader = [
      {
        key : "username",
        type : "text",
        label : "User Name"
      },
      {
        key : "type",
        type : "text",
        label : "Activity Type"
      },
      {
        key : "details",
        type : "text",
        label : "Activity Details"
      },
      {
        key : "time",
        type : "text",
        label : "Time Stamp"
      },
      {
        key : "oldValue",
        type : "text",
        label : "Old Value"
      },
      {
        key : "newValue",
        type : "text",
        label : "New Value"
      },
    ]
    this.userRoles = this.scorecardService.userRoles;
    this.isAllowed = this.userRoles.roles.some(
      (role) =>
        role.roleName === 'BE_EDITORS' ||
        role.roleName === 'ADMINS' ||
        role.roleName === 'BE_PMO'
    );
    this.isPMO = this.userRoles.roles.some((role) => role.roleName === 'BE_PMO');
    this.isAdmin = this.userRoles.roles.some(
      (role) => role.roleName === 'BE_EDITORS' || role.roleName === 'ADMINS'
    );
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.scorecardService.toggleSwitchBtn.subscribe({
      next : (res) => {
        if(this.child)
        {
          this.child.actionsPanel.hide()
        }
      }
    })
  }
  showDialog() {
    this.visible = true;
  }
  getProgramId(id: number) {
    this.ProgramId.emit(id);
  }
  downloadTemplate() {
    this.psrService.downloadExecutiveViewTemplate().subscribe({
      next: (res) => {
        this.downloadFile(res, `psrProjects.csv`);
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
  importData(file: FileModel | null) {
    if (file) {
      this.getUploadedFile.emit(file);
    }
  }
  onHide() {
    this.visible = false;
  }
  gotoaddForm() {
    // this.router.navigate(['add-project'] , { relativeTo: this.route })
    // this.router.navigate(['/.envpsr/add-project'])
    // this.router.navigateByUrl('/psr/add-project')
  }
}
