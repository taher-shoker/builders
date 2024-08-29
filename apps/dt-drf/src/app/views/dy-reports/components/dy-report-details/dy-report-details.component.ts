/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, BannerDataService } from '@stc-apps/shared-ui';
import { AuthService } from 'apps/dt-drf/src/app/services/auth.service';
import saveAs from 'file-saver';
import {
  Actions,
  MilestoneAttachment,
  ReportDetails,
  ReportFlowStatus,
  ReportsService,
  ReportWorkflow,
  ReportWorkflowStep,
  RequestTask,
  RequestTaskAttributes,
} from '../../dy-reports.service';
import { Step } from 'libs/shared-ui/src/lib/actions-stepper/actions-stepper.component';
import { MessageDialogComponent } from 'libs/shared-ui/src/lib/message-dialog/message-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { UpdateReportDialogComponent } from '../update-dy-report-progress-dialog/update-report-dialog.component';
import { ConfigService } from 'apps/dt-drf/src/app/services/config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'stc-apps-dy-report-details',
  templateUrl: './dy-report-details.component.html',
  styleUrl: './dy-report-details.component.scss',
})
export class DyReportDetailsComponent implements OnInit {
  steps: Step[] = [];
  historySteps: Step[] = [];
  reportId!: string;
  reportsDetails!: ReportDetails;
  isLoadingSteps: boolean = false;
  panelOpenState = false;
  openPanel: number | null = null;
  filteredDataHistory!: any;
  historyItemInitialStep: any = {
    status: '',
    overallProgress: '',
    creatorName: '',
    date: '',
    deliverable: '',
  };
  progress!: string | null;
  deliverable!: string | null;
  status!: string | null;
  progressDate!: string;
  progressUpdatedBy!: string;

  deliverableInMaking: string = '';
  overallProgressInMaking: string = '';
  isUpdateProgressOnHold: boolean = false;

  refinedProgressUpdate: {
    workflowId: number | string;
    requestTaskId: number | string;
    deliverableInMaking: string;
    overallProgressInMaking: string;
  } = {
    workflowId: 0,
    requestTaskId: 0,
    deliverableInMaking: '',
    overallProgressInMaking: '',
  };

  needToPushWorkflowAction: boolean = false;
  globalItem!: any;

  slaForm: FormGroup = new FormGroup({
    sla: new FormControl(''),
  });

  isWorkflowComplete: boolean = true;
  loadingSla = false;
  constructor(
    protected dialogService: DialogService,
    private bannerDataService: BannerDataService,
    private route: ActivatedRoute,
    public reportsService: ReportsService,
    public authService: AuthService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private router: Router,
    private configService: ConfigService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // this.reportsService.checkIsAdmin();
    this.route.params.subscribe((params) => {
      this.reportId = params['id'];
      this.getReportDetails();
    });

    // this.watchSlaChanges();
    this.populateCustomSLA();
    this.isUserProcessAdmin();
  }

  addReportSLA(sla: number) {
    this.reportsService
      .addReportSLA(this.reportsDetails.id, sla)
      .subscribe((res) => {
        this.loadingSla = false;
        this.toastr.success('SLA has been updated successfully');
        this.getReportDetails();
      });
  }

  watchSlaChanges(value: number) {
    console.log('VALUE IS:', value);
    this.loadingSla = true;
    this.addReportSLA(value);
  }

  getReportDetails() {
    this.reportsService.getReport(this.reportId).subscribe((res) => {
      // this.reportsService.getRemindersData();
      this.reportsDetails = res;
      this.bannerDataService.updateData({
        title: this.reportsDetails.reportName || '',
        text: '',
      });
      this.slaForm.get('sla')?.setValue(this.reportsDetails.reportSlaDuration);

      if (this.reportsDetails.flowId) {
        this.showReportWorkflow();
      }
    });
  }

  showReportWorkflow() {
    this.isLoadingSteps = true;
    this.steps = [];
    this.reportsService
      .getReportWorkflow(this.reportsDetails.flowId)
      .subscribe((res: ReportWorkflow) => {
        this.isLoadingSteps = false;

        this.steps = this.mergeTwoArraysAndDistinguishPendingObject(
          res,
          this.reportsDetails.requestApprovals
        );
      });
  }

  extractRequestApprovalsSteps(arr: ReportDetails['requestApprovals']) {
    const steps: Step[] = [];

    for (let i = 0; i < arr.length; i++) {
      const step: Step = {
        caption: 'Pending approval',
        state: 'undone',
        extraInfo: [`Pending on : ${arr[i].username}`],
        stepObject: arr[i],
      };
      steps.push(step);
    }
    return steps;
  }

  extractRequestTasksSteps(res: ReportWorkflow): Step[] {
    const steps: Step[] = [];

    res.sort(function (a, b) {
      return b.requestTaskId - a.requestTaskId;
    });

    for (let i = res.length - 1; i >= 0; i--) {
      let notes: string = '';

      const displayDate = res[i].completedDate
        ? res[i].completedDate
        : res[i].createdDate;
      const progressDate: string =
        this.datePipe.transform(displayDate, 'medium') || '';

      let byUser = '';
      const userThatTaskIsPendingOn = res[i].username;
      const actions: Actions[] = [];
      let stepCustomState: 'danger' | 'edit' | '' = '';
      const attachmentsIDs: string[] = [];
      const attachments: MilestoneAttachment[] = [];

      if (res[i].status !== 'pending') {
        byUser = `By ${res[i].username}`;
      }

      if (res[i].status === 'pending') {
        this.isWorkflowComplete = false;
      }

      for (const taskAttribute of res[i].requestTaskAttributes) {
        if (
          taskAttribute.name === 'attachments' ||
          taskAttribute.name === 'creator_attachments'
        ) {
          attachmentsIDs.push(taskAttribute.value);
        }

        if (
          taskAttribute.name === 'comment' ||
          taskAttribute.name === 'creator_description'
        ) {
          notes = taskAttribute.value;
        }

        if (
          taskAttribute.name === 'is_approved_by_initiator' &&
          taskAttribute.value === 'false'
        ) {
          stepCustomState = 'danger';
        }

        if (taskAttribute.name === 'delete') {
          if (taskAttribute.value === 'false') {
            stepCustomState = 'edit';
          } else if (taskAttribute.value === 'true') {
            stepCustomState = 'danger';
          }
        }
      }

      for (const attachmentID of attachmentsIDs) {
        this.reportsService.getAttachment(+attachmentID).subscribe((res) => {
          attachments.push(res);
        });
      }

      if (res[i].status === 'pending' && res[i].params?.length > 0) {
        if (res[i].taskName === 'User Approve SLA') {
          actions.push(Actions.approveSLA);
          actions.push(Actions.rejectSLA);
        }

        if (res[i].taskName === 'User Approve') {
          actions.push(Actions.approve);
          actions.push(Actions.reject);
        }

        if (res[i].taskName === 'Edit or Delete Report Data') {
          actions.push(Actions.editReport);
          actions.push(Actions.deleteReport);
        }

        if (res[i].taskName === 'Initiator Approve') {
          actions.push(Actions.initiatorApprove);
          actions.push(Actions.initiatorReject);
        }

        if (res[i].taskName === 'Add Data') {
          actions.push(Actions.addData);
        }
      }

      const step: Step = {
        caption: this.handleRequestTaskName(
          res[i].taskName,
          res[i].status,
          res[i]
        ),
        state: stepCustomState
          ? stepCustomState
          : this.getStepStatus(res[i].status),
        notes: notes,
        attachments: attachments as any,
        extraInfo: [
          `${progressDate} ${
            byUser || 'Pending on ' + userThatTaskIsPendingOn
          }`,
        ],
        actions: actions,
        stepObject: res[i],
      };
      steps.push(step);
    }

    console.log('Final res:', res);
    return steps;
  }

  handleRequestTaskName(
    taskName: string,
    status: string,
    task: ReportWorkflowStep
  ): string {
    let finalStr = '';

    if (taskName === 'Edit or Delete Report Data' && status !== 'pending') {
      if (task.requestTaskAttributes.length > 0) {
        for (const reqTask of task.requestTaskAttributes) {
          if (reqTask.name === 'delete' && reqTask.value === 'false') {
            finalStr = 'Edited';
            break;
          }

          if (reqTask.name === 'delete' && reqTask.value === 'true') {
            finalStr = 'Deleted';
            break;
          }
        }
      }
    }else if(task.status === 'breached'){
      finalStr = taskName + ' - Breached';

    } else {
      finalStr = taskName;
    }

    return finalStr;
  }

  mergeTwoArraysAndDistinguishPendingObject(
    requestTasks: ReportWorkflow,
    requestApprovals: ReportDetails['requestApprovals']
  ): Step[] {
    let steps: Step[] = [];
    let reqTasksSteps: Step[] = [];
    let reqApprovalSteps: Step[] = [];

    reqTasksSteps = this.extractRequestTasksSteps(requestTasks);
    reqApprovalSteps = this.distinguishRequestApprovalSteps(
      requestApprovals,
      requestTasks
    );
    steps = [...reqTasksSteps, ...reqApprovalSteps];

    return steps;
  }

  distinguishRequestApprovalSteps(
    requestApprovals: ReportDetails['requestApprovals'],
    requestTasks: ReportWorkflow
  ): Step[] {
    const tempArr: any[] = [];

    const taskUsernames = new Set(requestTasks.map((task) => task.username));

    requestApprovals.forEach((approval) => {
      if (!taskUsernames.has(approval.username)) {
        if (!tempArr.some((item) => item.username === approval.username)) {
          tempArr.push(approval);
        }
      }
    });

    const distinguishedElements: Step[] =
      this.extractRequestApprovalsSteps(tempArr);
    console.log('tempArr', tempArr);

    return distinguishedElements;
  }

  customRangeSLA: { name: number; id: number }[] = [];
  processAdminUser: boolean = false;
  isUserProcessAdmin() {
    //  "roleName":"PROCESS_ADMIN",
    //  "groupName":"System_Process_Admin"
    this.processAdminUser = this.reportsService.userInGroup(
      'System_Process_Admin'
    );
  }

  private populateCustomSLA() {
    const { min, max } = this.configService.getConfig().rangeForSLA;
    this.customRangeSLA = Array.from({ length: max - min + 1 }, (_, i) => ({
      name: min + i,
      id: min + i,
    }));
  }

  getStepStatus(
    status: ReportFlowStatus
  ): 'warning' | 'done' | 'undone' | 'edit' | 'danger' {
    const statusMap: {
      [key in ReportFlowStatus]:
        | 'warning'
        | 'done'
        | 'undone'
        | 'edit'
        | 'danger';
    } = {
      breached: 'warning',
      rejected: 'warning',
      completed: 'done',
      pending: 'undone',
    };
    return statusMap[status];
  }

  doStepAction(action: { actionObj: Actions | string; item: any }) {
    if (
      typeof action.actionObj !== 'string' &&
      'uniqueTitle' in action.actionObj
    ) {
      this.globalItem = action.item;
      this.handleStepperAction(action.actionObj.uniqueTitle, action.item);
    } else if (
      typeof action.actionObj === 'string' &&
      action.actionObj === 'download'
    ) {
      this.downloadFile(action.item.id, action.item.label);
    }
  }

  handleStepperAction(action: string, item: RequestTask) {
    if (action === 'Approve' || action === 'Approve SLA') {
      this.approveStep(item);
    }

    if (action === 'Reject' || action === 'Reject SLA') {
      this.rejectStep(item);
    }

    if (action === 'Edit Report') {
      this.router.navigate(['home/edit_report', this.reportsDetails.id], {
        queryParams: {
          mode: 'edit_report_step',
          id: this.reportsDetails.id,
          flowId: this.reportsDetails.flowId,
          requestTaskId: this.globalItem.requestTaskId,
        },
      });
    }

    if (action === 'Delete Report') {
      const msg = `You're about to delete the report flow,  Kindly note you can't roll back this action. Are you sure?`;
      this.confirmAction(msg).subscribe((res) => {
        if (!res) {
          return;
        }

        this.deleteFlowStep(item);
      });
    }

    if (action === 'Add Data') {
      this.addDataStep(item);
    }

    if (action === 'Initiator Approve') {
      // this.approveInitiatorStep(item);
      this.approveStep(item, true);
    }

    if (action === 'Initiator Reject') {
      // this.rejectInitiatorStep(item);
      this.rejectStep(item, true);
    }
  }

  // approveInitiatorStep(item: RequestTask) {
  //   const msg = `Are you sure to approve current state?`;
  //   this.confirmAction(msg).subscribe((res) => {
  //     if (!res) {
  //       return;
  //     }

  //     this.approveInitiator(item);
  //   });
  // }

  // rejectInitiatorStep(item: RequestTask) {
  //   const msg = `Are you sure to reject current state?`;
  //   this.confirmAction(msg).subscribe((res) => {
  //     if (!res) {
  //       return;
  //     }

  //     this.rejectInitiator(item);
  //   });
  // }

  // rejectInitiator(item: RequestTask) {
  //   const params: RequestTaskAttributes = {
  //     requestParams: [{ name: 'is_approved_by_initiator', value: false }],
  //   };

  //   this.reportsService
  //     .completePendingTask(
  //       this.reportsDetails.flowId,
  //       item.requestTaskId,
  //       params
  //     )
  //     .subscribe((res) => {
  //       console.log('The res of complete task:', res);
  //       this.isLoadingSteps = false;
  //       this.getReportDetails();
  //     });
  // }

  // approveInitiator(item: RequestTask) {
  //   const params: RequestTaskAttributes = {
  //     requestParams: [{ name: 'is_approved_by_initiator', value: true }],
  //   };

  //   this.isLoadingSteps = true;
  //   this.reportsService
  //     .completePendingTask(
  //       this.reportsDetails.flowId,
  //       item.requestTaskId,
  //       params
  //     )
  //     .subscribe((res) => {
  //       console.log('The res of complete task:', res);
  //       this.isLoadingSteps = false;
  //       this.getReportDetails();
  //     });
  // }

  addDataStep(item: RequestTask) {
    const params: RequestTaskAttributes = {
      requestParams: [],
    };

    this.openAddDataForReportModal(item).subscribe(
      (res: { comment: string; attachments: string }) => {
        if (!res) {
          return;
        }

        this.isLoadingSteps = true;

        if (res.comment) {
          params.requestParams.push({
            name: 'creator_description',
            value: res.comment,
          });
        }

        if (res.attachments) {
          params.requestParams.push({
            name: 'creator_attachments',
            value: res.attachments,
          });
        }

        this.reportsService
          .completePendingTask(
            this.reportsDetails.flowId,
            item.requestTaskId,
            params
          )
          .subscribe((res) => {
            console.log('The res of complete task:', res);
            this.getReportDetails();
          });
      }
    );
  }

  confirmAction(msg: string) {
    const dialogRef = this.matDialog.open(MessageDialogComponent, {
      width: '800px',
      data: {
        msg,
      },
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }

  approveStep(item: RequestTask, isInitiator: boolean = false) {
    const params: RequestTaskAttributes = isInitiator
      ? {
          requestParams: [{ name: 'is_approved_by_initiator', value: true }],
        }
      : {
          requestParams: [{ name: 'isApproved', value: true }],
        };

    this.openReportStepApprovalModal(item, true).subscribe(
      (res: { comment: string; attachments: string }) => {
        console.log('The res of dialog:', res);
        if (!res) {
          return;
        }

        this.isLoadingSteps = true;

        if (res.comment) {
          params.requestParams.push({ name: 'comment', value: res.comment });
        }

        if (res.attachments) {
          params.requestParams.push({
            name: 'attachments',
            value: res.attachments,
          });
        }

        this.reportsService
          .completePendingTask(
            this.reportsDetails.flowId,
            item.requestTaskId,
            params
          )
          .subscribe((res) => {
            console.log('The res of complete task:', res);
            this.isLoadingSteps = false;
            this.getReportDetails();
          });
      }
    );
  }

  rejectStep(item: RequestTask, isInitiator: boolean = false) {
    const params: RequestTaskAttributes = isInitiator
      ? {
          requestParams: [{ name: 'is_approved_by_initiator', value: false }],
        }
      : {
          requestParams: [{ name: 'isApproved', value: false }],
        };

    this.openReportStepApprovalModal(item, false).subscribe(
      (res: { comment: any; attachments: any }) => {
        console.log('The res of dialog:', res);
        if (!res) {
          return;
        }

        this.isLoadingSteps = true;

        if (res.comment) {
          params.requestParams.push({ name: 'comment', value: res.comment });
        }

        if (res.attachments) {
          params.requestParams.push({
            name: 'attachments',
            value: res.attachments,
          });
        }
        this.reportsService
          .completePendingTask(
            this.reportsDetails.flowId,
            item.requestTaskId,
            params
          )
          .subscribe((res) => {
            console.log('The res of complete task:', res);
            this.getReportDetails();
          });
      }
    );
  }

  deleteFlowStep(item: RequestTask) {
    const params: RequestTaskAttributes = {
      requestParams: [{ name: 'delete', value: true }],
    };

    this.isLoadingSteps = true;
    this.reportsService
      .completePendingTask(
        this.reportsDetails.flowId,
        item.requestTaskId,
        params
      )
      .subscribe((res) => {
        console.log('The res of complete task:', res);
        this.isLoadingSteps = false;
        this.getReportDetails();
      });
  }

  openReportStepApprovalModal(item: RequestTask, isApprove: boolean) {
    const dialogRef = this.matDialog.open(UpdateReportDialogComponent, {
      width: '800px',
      data: {
        item,
        report: this.reportsDetails,
        showAttachment: false,
        approvalState: isApprove ? 'approval' : 'rejection', // Please leave it strings, not boolean, since client changes his mind frequently
      },
    });

    return dialogRef.afterClosed();
  }

  openAddDataForReportModal(item: RequestTask) {
    const dialogRef = this.matDialog.open(UpdateReportDialogComponent, {
      width: '800px',
      data: {
        item,
        report: this.reportsDetails,
        showAttachment: true,
        approvalState: 'Add Data', // Please leave it strings, not boolean, since client changes his mind frequently
      },
    });

    return dialogRef.afterClosed();
  }

  downloadFile(id: number, name: string = 'untitled.txt') {
    this.reportsService.downloadAttachment(id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer]);
      // you may improve this code to customize the name
      // of the export based on date or some other factors
      saveAs(data, name);
    });
  }

  makeSureToApprove(name: string, reasonMsg: string = 'approve Milestone') {
    {
      const dialogRef = this.matDialog.open(MessageDialogComponent, {
        width: '800px',
        data: {
          msg: `You're about to ${reasonMsg} "${name}" Kindly note you can't roll back this action. Are you sure?`,
        },
        disableClose: true,
      });
      return dialogRef.afterClosed();
    }
  }
}
