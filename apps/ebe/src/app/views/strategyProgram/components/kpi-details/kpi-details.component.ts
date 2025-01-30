import { StrategyProgramKpiDetailsModel } from '../../../../models/strategy-program.model';
import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { StrategyProgramService } from '../../../../services/strategy-program.service';
import { SharedUiModule } from "@stc-apps/shared-ui";
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { ScorecardService } from '../../../../services/scorecard.service';
import { FileModel, UserGroup } from '../../../../models/scorecard.model';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { DatePipe } from '@angular/common';
import { ActivityLog, ActivityLogData } from '../../../../models/activity-logs';
import { ActivityLogService } from '../../../../services/activity-logs.service';
import { MenuPopupComponent } from 'apps/ebe/src/app/components/menu-popup/menu-popup.component';
export interface KpiProjectsDetailsModel
{
  project:string;
  actual:number;
  planned:number;
}
@Component({
  selector: 'stc-apps-kpi-details.component.ts',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    AccordionModule,
    SharedUiModule,
    ButtonModule,
    RouterModule,
    EditModeViewComponent,
    OverlayPanelModule
  ],
  providers : [ConfirmationService],
  templateUrl: './kpi-details.component.html',
  styleUrl: './kpi-details.component.scss',
})
export class KpiDetailsComponentTsComponent implements OnInit , OnDestroy {
  currentId!:string;
  currentMode!: 'editMode' | 'viewMode';
  @ViewChild('actionsPanel') actionsPanel!: OverlayPanel;
  activatedRoute = inject(ActivatedRoute);
  strategyProgramService = inject(StrategyProgramService);
  StrategyProgramData: StrategyProgramKpiDetailsModel[] = [];
  activityLogsTableHeader!:ColumnsSchema[];
  activityLogsTableHeader2!:ColumnsSchema[];
  activityLogsTableBody = signal<ActivityLogData[]>([]);
  projectActivityLogsTableHeader!:ColumnsSchema[];
  projectActivityLogsTableBody = signal<ActivityLogData[]>([]);
  endSubs$:Subject<any> = new Subject();
  private confirmationService = inject(ConfirmationService);
  private scorecardService = inject(ScorecardService);
  constructor(private router:Router , private datePipe:DatePipe){}
  toastr = inject(ToastrService);
  activityLogService = inject(ActivityLogService)
  @ViewChild(MenuPopupComponent) child?: MenuPopupComponent;
  menuItems:any[] = [];
  isEmpty!:boolean;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  userRoles!:UserGroup;
  isAdmin!:boolean;
  ngOnInit(): void {
    this.scorecardService.toggleSwitchBtn.subscribe({
      next : (res) => {
        this.actionsPanel?.hide();
        this.showActivityLogsPopup = false;
      }
    })
    this.userRoles = this.scorecardService.userRoles;
    this.isAdmin = this.userRoles.roles.some(role => role.roleName === 'BE_EDITORS' || role.roleName === "ADMINS");
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.activatedRoute.params.subscribe({
      next: (param: Params) => {
        this.currentId = param['kpiId'];
        // this.isEmpty = true;
        this.getStrategyProgramDetails(this.currentId);
      },
    });
    this.menuItems = [
      {
        label: 'activity log',
        icon: "pi pi-clock"
      },
      {
        label: 'show deleted projects',
        icon: "pi pi-eye"
      }
    ];
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
      // {
      //   key : "oldValue",
      //   type : "text",
      //   label : "Old Value"
      // },
      // {
      //   key : "newValue",
      //   type : "text",
      //   label : "New Value"
      // },
    ]
    this.activityLogsTableHeader2 = [
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
      // {
      //   key : "details",
      //   type : "text",
      //   label : "Activity Details"
      // },
      {
        key : "time",
        type : "text",
        label : "Time Stamp"
      }
    ]
  }
  showActivityLogsPopup = false;
  showActivityLogsPopup2 = false;
  $endScorecardActivityLogsSub:Subject<any> = new Subject();
  showActivityLogs()
  {
    // this.activityLogsPanel.toggle(event);
    console.log(this.showActivityLogsPopup2);
    this.getSpecificActivityLog("CAD" , "Import,Export" , this.currentId);
    this.showActivityLogsPopup2 = !this.showActivityLogsPopup2;
  }
  showKPIActivityLogs(kpi:StrategyProgramKpiDetailsModel)
  {
    this.getSpecificActivityLog("CAD" , "Add,Delete" , this.currentId , kpi.keyResultNumber.toString());
    this.showActivityLogsPopup = !this.showActivityLogsPopup;
  }
  private getSpecificActivityLog(moduleName:string , activityType:string , subModule:string , projectName?:string , entity?:string)
  {
    this.activityLogService.getSpecificActivityLog(moduleName , activityType , subModule , projectName , entity).pipe(takeUntil(this.$endScorecardActivityLogsSub)).subscribe({
      next : (activityLogs:ActivityLogData[]) => {
        if(entity)
        {
          this.projectActivityLogsTableBody.set(activityLogs);
        } else {
          this.activityLogsTableBody.set(activityLogs);
        }
      }
    })
  }
  popupClosed()
  {
    this.$endScorecardActivityLogsSub.complete();
    this.showActivityLogsPopup = false;
    this.actionsPanel.hide();
  }
  popupClosed2()
  {
    this.$endScorecardActivityLogsSub.complete();
    this.showActivityLogsPopup2 = false;
    this.actionsPanel.hide();
  }
  showProjectLogs(id:number , kpi:StrategyProgramKpiDetailsModel)
  {
    console.log(id);
    this.getSpecificActivityLog("CAD" , "Add,Edit" , this.currentId , kpi.keyResultNumber.toString() , id.toString());
  }
  menuActions(label:string)
  {
    console.log(label);
    if(label === 'activity log')
    {
      this.showActivityLogs();
    } else {
    }
  }
  showDeletedProjects(kpi:StrategyProgramKpiDetailsModel)
  {
    this.router.navigateByUrl(`/deleted-projects/cad-projects/${this.currentId}/${kpi.keyResultNumber}`);
  }
  private getStrategyProgramDetails(strategyName:string)
  {
    this.strategyProgramService.getStrategyProgramDetails(strategyName).pipe(takeUntil(this.endSubs$)).subscribe({
      next : (res:StrategyProgramKpiDetailsModel[]) => {
        this.StrategyProgramData = res;
        if(this.StrategyProgramData.length === 0)
        {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
      }
    })
  }
  isTapOpened!: boolean;
  currentTabIndex!: number;
  getCurrentIndex(index: boolean) {
    // console.log(index);
    this.isTapOpened = index;
    if(this.actionsPanel)
    {
      this.actionsPanel.hide();
    }
  }
  closeAccordion()
  {
    this.actionsPanel.hide();
    this.showActivityLogsPopup = false
  }
  getIndex(index: number | number[]) {
    this.currentTabIndex = typeof index === 'number' ? index : 0;
  }
  showForm(project:StrategyProgramKpiDetailsModel) {
    if(this.isAdmin)
    {
      this.router.navigateByUrl(`/strategy-project-form/${project.strategyProjectName}/${project.keyResultNumber}`);
      this.strategyProgramService.clickedProjects.next(project.projects);
    } else {
      this.router.navigateByUrl(`/strategy-program`);
    }
  }
  // editProject(kpi:KpiProjectsDetailsModel , project:StrategyProgramKpiDetailsModel , singleproject:StrategyProgramKpiProjectsDetailsModel)
  // {
  //   // this.router.navigateByUrl(`/strategy-project-form/${project.project}`);
  //   this.router.navigateByUrl(`/strategy-project-form/${project.strategyProjectName}/${project.objective}`);
  //   this.strategyProgramService.clickedProjects.next(project.projects);
  //   this.strategyProgramService.clickedProject.next(singleproject);
  // }
  deletedProject!:KpiProjectsDetailsModel;
  prevProjects!:KpiProjectsDetailsModel[];
  kpi!:StrategyProgramKpiDetailsModel;
  deleteProject(project:KpiProjectsDetailsModel , projects:KpiProjectsDetailsModel[] , kpi:StrategyProgramKpiDetailsModel)
  {
    this.deletedProject = project;
    this.prevProjects = projects;
    this.kpi = kpi;
    this.confirmationService.confirm({
      key: 'delete-project'
    });
  }
  visible!:boolean;
  close()
  {
    this.confirmationService.close()
  }
  deleteProjectItem()
  {
    const deletedData = this.prevProjects.filter(val => val.project !== this.deletedProject.project);
    this.strategyProgramService.updateProjects(this.kpi.strategyProjectName , this.kpi.keyResultNumber , deletedData).subscribe({
      next : () => {
        this.strategyProgramService.getStrategyProgramDetails(this.currentId).subscribe({
          next : (res:StrategyProgramKpiDetailsModel[]) => {
            this.StrategyProgramData = res;
            this.close();
          }
        })
      }
    })
  }
  showDialog()
  {
    this.visible = true;
  }
  showActionsPopup()
  {
    this.actionsPanel.toggle(event);
    this.showActivityLogsPopup = false;
  }
  downloadTemplate()
  {
    this.strategyProgramService.downloadStrategyProgramDetails(this.currentId).subscribe({
      next : (response) => {
        this.downloadFile(response, `${this.currentId}.csv`);
      }
    })
  }
  capitalizeSentence(sentence:string) {
    return sentence
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  ImportFile(uploadFile:FileModel | null)
  {
    if(uploadFile)
    {
      this.strategyProgramService.uploadCadSummaryDetailsFile(uploadFile , this.currentId).subscribe({
        next : () => {
          this.getStrategyProgramDetails(this.currentId);
          this.visible = false;
          this.toastr.success("The File is Saved Successfully");
        },
        error : () => {
          this.visible = false;
        }
      })
    }
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
}
