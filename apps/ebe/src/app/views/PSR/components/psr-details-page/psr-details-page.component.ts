import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRService } from '../../../../services/psr.service';
import {
  AddProjectForm,
  PSRProjectDetailsModel,
} from '../../../../models/psr.model';
import { ProjectDetailsCardComponent } from '../project-details-card/project-details-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { ScorecardService } from '../../../../services/scorecard.service';
import { FileModel, UserGroup } from '../../../../models/scorecard.model';
import { ToastrService } from 'ngx-toastr';
import { MenuPopupComponent } from 'apps/ebe/src/app/components/menu-popup/menu-popup.component';
import { ActivityLog, ActivityLogData, ColumnsSchema } from '../../../../models/activity-logs';
import { ActivityLogService } from '../../../../services/activity-logs.service';
@Component({
  selector: 'stc-apps-psr-details-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SharedUiModule,
    ProjectDetailsCardComponent,
    EditModeViewComponent,
    MenuPopupComponent,
  ],
  templateUrl: './psr-details-page.component.html',
  styleUrl: './psr-details-page.component.scss',
})
export class PsrDetailsPageComponent implements OnInit, OnDestroy {
  @ViewChild(ProjectDetailsCardComponent) child?: ProjectDetailsCardComponent;
  @ViewChild(MenuPopupComponent) child2?: MenuPopupComponent;
  psrServices = inject(PSRService);
  router = inject(ActivatedRoute);
  route = inject(Router);
  PSRDetailsData!: PSRProjectDetailsModel[];
  endSubs$: Subject<PSRProjectDetailsModel[]> = new Subject();
  activityLogsTableHeader!: ColumnsSchema[];
  activityLogsTableBody = signal<ActivityLogData[]>([]);
  projectActivityLogsTableHeader!: ColumnsSchema[];
  projectActivityLogsTableBody!: ActivityLog[];
  toastr = inject(ToastrService);
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService);
  groupName = '';
  username = '';
  userRoles!: UserGroup;
  isAllowed = false;
  datePipe = inject(DatePipe);
  isAdmin = false;
  activityLogService = inject(ActivityLogService);
  menuItems = [
    {
      label: 'activity log',
      icon: 'pi pi-clock',
    },
    {
      label: 'show deleted projects',
      icon: 'pi pi-eye',
    },
  ];
  showActivityLogsPopup = false;
  $endScorecardActivityLogsSub:Subject<any> = new Subject();
  popupClosed() {
    this.showActivityLogsPopup = false;
    this.$endScorecardActivityLogsSub.complete();
  }
  actionButton(label: string) {
    if (label === 'activity log') {
      this.showActivityLogsPopup = !this.showActivityLogsPopup;
      this.getSpecificActivityLog("PSR" , this.groupName);
    } else {
      console.log(this.PSRDetailsData);
      this.route.navigateByUrl(`/deleted-projects/psr-projects/${this.PSRDetailsData[0].gd}`);
    }
  }
  private getSpecificActivityLog(moduleName:string , subModule?:string , projectName?:string)
  {
    this.activityLogService.getSpecificActivityLog(moduleName , "Import,Export,Add,Edit,Delete" , subModule , projectName).pipe(takeUntil(this.$endScorecardActivityLogsSub)).subscribe({
      next : (activityLogs:ActivityLogData[]) => {
        this.activityLogsTableBody.set(activityLogs);
      }
    })
  }
  ngOnInit(): void {
    // this.toastr.success("The File is Saved Successfully");
    this.scorecardService.toggleSwitchBtn.subscribe({
      next : (res) => {
        if(this.child2)
        {
          this.child2.actionsPanel.hide()
        }
      }
    })
    this.username = this.scorecardService.getUsername();
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.userRoles = this.scorecardService.userRoles;
    this.isAllowed = this.userRoles.roles.some(
      (role) =>
        role.roleName === 'BE_EDITORS' ||
        role.roleName === 'ADMINS' ||
        role.roleName === 'BE_PMO'
    );
    this.isAdmin = this.userRoles.roles.some(
      (role) => role.roleName === 'BE_EDITORS' || role.roleName === 'ADMINS'
    );
    console.log(this.userRoles);
    // this.PSRDetailsData = this.psrServices.PSRDetailsData;
    this.router.params.subscribe({
      next: (param) => {
        this.groupName = param['id'];
        if (this.groupName) {
          this.getProjectDetails(this.groupName);
        }
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
      {
        key: 'details',
        type: 'text',
        label: 'Activity Details',
      },
      {
        key: 'time',
        type: 'text',
        label: 'Time Stamp',
      },
      {
        key: 'oldValue',
        type: 'text',
        label: 'Old Value',
      },
      {
        key: 'newValue',
        type: 'text',
        label: 'New Value',
      },
    ];
    this.projectActivityLogsTableHeader = [
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
      {
        key: 'details',
        type: 'text',
        label: 'Activity Details',
      },
      {
        key: 'time',
        type: 'text',
        label: 'Time Stamp',
      },
      {
        key: 'oldValue',
        type: 'text',
        label: 'Old Value',
      },
      {
        key: 'newValue',
        type: 'text',
        label: 'New Value',
      },
    ];
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  isEmpty!: boolean;
  selectedGD: any;
  addChartData(e: boolean) {
    if (e) {
      this.getProjectDetails(this.groupName);
    }
  }
  deleteTableRecord(e: boolean) {
    if (e) {
      this.getProjectDetails(this.groupName);
    }
  }
  private getProjectDetails(group: string) {
    this.psrServices
      .getExecuteProjectDetailsData(group)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: PSRProjectDetailsModel[]) => {
          res.forEach((res2) => {
            res2.chartDetails.forEach((res3) => {
              res3.deleteAction = 'delete';
            });
          });
          // this.PSRDetailsData = res.filter(res2 => res2.gd !== null);
          this.PSRDetailsData = res;
          this.selectedGD = this.PSRDetailsData.filter((d) => d.gd !== null);
          // if(!localStorage.getItem("gd"))
          // {
          //   localStorage.setItem("gd" , this.selectedGD[0].gd)
          // }
          if (this.PSRDetailsData.length === 0) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
        },
      });
  }
  deleteProject(id: number) {
    this.psrServices.deleteProject(id , this.groupName).subscribe({
      next: () => {
        this.toastr.success('The Project is Deleted Successfully');
        this.getProjectDetails(this.groupName);
      },
    });
  }
  gotoAddForm() {
    const program = encodeURIComponent(this.groupName);
    this.route.navigateByUrl(`/psr/add-project/${program}`);
  }
  values: AddProjectForm[] = [];
  addRecordInTable(values: AddProjectForm) {
    this.values.push(values);
    if (this.values.length !== 0) {
      // const clickedProj = this.PSRDetailsData.filter(proj => {
      //   proj.chartDetails.filter(proj2 => proj2.id === values.id)[0]
      // })[0];
      // console.log(values);
      // console.log(this.PSRDetailsData);
      // console.log(clickedProj);
      // clickedProj.chartDetails.push(values);
    }
  }
  removeElementsFromArray(array1: AddProjectForm[], array2: AddProjectForm[]) {
    return array2.filter((item) => !array1.includes(item));
  }
  closePopup(e: number) {
    const clickedProj = this.PSRDetailsData.filter((proj) => proj.id === e)[0];
    const result = this.removeElementsFromArray(
      this.values,
      clickedProj.chartDetails
    );
    clickedProj.chartDetails = result;
  }
  visible = false;
  showDialog() {
    this.visible = true;
  }
  downloadTemplate() {
    // const groupName = this.PSRDetailsData[0].group;
    this.psrServices.downloadProjectDetailsTemplate(this.groupName).subscribe({
      next: (res) => {
        this.downloadFile(res, `${this.groupName}.csv`);
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
    this.psrServices
      .uploadFile('executiveViewData', file, this.groupName)
      .subscribe({
        next: () => {
          this.getProjectDetails(this.groupName);
          this.toastr.success('The File is Saved Successfully');
          this.visible = false;
        },
        error: () => {
          this.visible = false;
        },
      });
  }
  onHide() {
    this.visible = false;
  }
}
