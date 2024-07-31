/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import { AuthService } from 'apps/dt-drf/src/app/services/auth.service';
import saveAs from 'file-saver';
import { Step } from 'libs/shared-ui/src/lib/actions-stepper/actions-stepper.component';
import { MessageDialogComponent } from 'libs/shared-ui/src/lib/message-dialog/message-dialog.component';
import {
  Actions,
  MilestoneAttachment,
  ReportDetails,
  ReportFlowStatus,
  ReportsService,
  ReportWorkflow,
  RequestTask,
  RequestTaskAttributes,
} from '../../dy-reports.service';
import { UpdateReportDialogComponent } from '../update-dy-report-progress-dialog/update-report-dialog.component';

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

  constructor(
    protected dialogService: DialogService,
    private bannerDataService: BannerDataService,
    private route: ActivatedRoute,
    public reportsService: ReportsService,
    public authService: AuthService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reportsService.checkIsAdmin();
    this.route.params.subscribe((params) => {
      this.reportId = params['id'];
      this.getReportDetails();
    });
  }

  getReportDetails(params?: Params) {
    this.reportsService.getReport(this.reportId).subscribe((res: any) => {
      // this.reportsService.getRemindersData();
      this.reportsDetails = res;
      this.bannerDataService.updateData({
        title: this.reportsDetails.reportName || '',
        text: '',
      });

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
        console.log('Res is ::', res);
        this.isLoadingSteps = false;

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
          const userThatTaskIsPendingOn = res[i].userDisplayName;
          const actions: Actions[] = [];
          if (res[i].status !== 'pending') {
            byUser = `By ${res[i].completedByName}`;
          }

          for (const taskAttribute of res[i].requestTaskAttributes) {
            if (taskAttribute.name === 'comment') {
              notes = taskAttribute.value;
              break;
            }
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
            caption: res[i].taskName,
            state: this.getStepStatus(res[i].status),
            notes: notes,
            // attachments: attachments,
            extraInfo: [
              `${progressDate} ${
                byUser || 'Pending on ' + userThatTaskIsPendingOn
              }`,
            ],
            actions: actions,
            stepObject: res[i],
          };
          this.steps.push(step);
        }
      });
  }

  getStepStatus(status: ReportFlowStatus): 'warning' | 'done' | 'undone' {
    const statusMap: {
      [key in ReportFlowStatus]: 'warning' | 'done' | 'undone';
    } = {
      breached: 'warning',
      rejected: 'warning',
      completed: 'done',
      pending: 'undone',
    };
    return statusMap[status];
  }

  getHistory(report: ReportDetails) {
    this.reportsService.getMilestonesHistory(report?.id).subscribe((res) => {
      if (res) {
        this.removeParentArrayWithPendingTask(res);
      }
    });
  }

  removeParentArrayWithPendingTask(res: any): void {
    this.filteredDataHistory = res.filter((requestObj: any) =>
      requestObj.requestTasksHistory.every(
        (task: any) => task.status !== 'pending'
      )
    );
  }

  getHistoryTasks(request: any) {
    this.historySteps = [];
    const item = request?.requestTasksHistory;
    this.reportsService
      .getMilestoneProgress(request?.request?.requestParams[1].value)
      .subscribe((res: any) => {
        this.historyItemInitialStep = {
          status: res?.status,
          overallProgress: res?.overallProgress,
          creatorName: res?.updatedBy,
          date: res?.progressUpdateDate,
          deliverable: res?.deliverable,
        };
        const initialStep: Step = {
          caption: `Milestone progress updated (${res?.status})`,
          state: 'done',
          extraInfo: [
            `${
              this.datePipe.transform(res?.progressUpdateDate, 'medium') || ''
            } By ${res?.updatedBy}`,
          ],
          additionalTemp: true,
          captionTemp: true,
        };
        this.historySteps.unshift(initialStep);
      });

    for (let i = 0; i <= item.length - 1; i++) {
      const attachmentsIDs: string[] = [];
      const attachments: MilestoneAttachment[] = [];
      let notes: string = '';

      const displayDate = item[i].completedDate
        ? item[i].completedDate
        : item[i].createdDate;
      const progressDate: string =
        this.datePipe.transform(displayDate, 'medium') || '';

      let byUser = '';
      const actions: Actions[] = [];

      let isWarningState: boolean = false;

      for (const taskAttribute of item[i].requestTaskAttributes) {
        if (item[i].status !== 'pending') {
          byUser = `By ${item[i].completedByName}`;

          if (
            taskAttribute.name.includes('approved') &&
            (taskAttribute.value === 'false' ||
              taskAttribute.value == '0' ||
              taskAttribute.value == '2')
          ) {
            // Means it's approval (review) step and it's rejected.
            isWarningState = true;
          }
        }

        if (
          taskAttribute.name === 'evidence_id' ||
          taskAttribute.name === 'justification_id' ||
          taskAttribute.name === 'remark_id' ||
          taskAttribute.name === 'attachment_id'
        ) {
          attachmentsIDs.push(taskAttribute.value);
        } else if (
          taskAttribute.name === 'notes' ||
          taskAttribute.name === 'reason_of_rejection'
        ) {
          notes = taskAttribute.value;
        }
      }
      if (item[i].status !== 'pending') {
        byUser = `By ${item[i].completedByName}`;
      }
      for (const attachmentID of attachmentsIDs) {
        this.reportsService.getAttachment(+attachmentID).subscribe((res) => {
          attachments.push(res);
        });
      }
      const step: Step = {
        caption:
          item[i].taskName === 'Review Remarks'
            ? 'Review Progress'
            : item[i].taskName + (isWarningState === true ? ' (Returned)' : ''),
        state:
          isWarningState === true
            ? 'warning'
            : item[i].status === 'completed'
            ? 'done'
            : 'undone',
        notes: notes,
        // attachments: attachments,
        extraInfo: [`${progressDate} ${byUser}`],
        actions: actions,
        stepObject: item[i],
      };

      this.historySteps.push(step);
    }
  }

  doStepAction(action: { actionObj: Actions | string; item: any }) {
    if (action) {
      console.log('El ACT:', action);
    }

    if (
      typeof action.actionObj !== 'string' &&
      'uniqueTitle' in action.actionObj
    ) {
      this.handleStepperAction(action.actionObj.uniqueTitle, action.item);
    }

    // if (
    //   typeof action.actionObj !== 'string' &&
    //   'uniqueTitle' in action.actionObj
    // ) {
    //   if (
    //     action.actionObj.uniqueTitle ===
    //     Actions.initiateUpdateProgress.uniqueTitle
    //   ) {
    //     this.openProgressUpdateModal(this.reportsDetails.id || 0);
    //   }
    //   if (action.actionObj.uniqueTitle === Actions.addNewProgress.uniqueTitle) {
    //     this.refinedProgressUpdate.requestTaskId = action.item.requestTaskId;
    //     this.openProgressUpdateModal(this.reportsDetails.id || 0, false);
    //   }
    //   if (action.actionObj.uniqueTitle === Actions.updateDTRecord.uniqueTitle) {
    //     this.isLoadingSteps = true;
    //     this.reportsService
    //       .updateMilestoneRecord(
    //         this.reportsDetails.currentMilestoneProgressUpdateDto
    //           ?.workflowId || '',
    //         action.item.requestTaskId
    //       )
    //       .subscribe(() => {
    //         this.getReportDetails();
    //       });
    //   }
    //   if (
    //     action.actionObj.uniqueTitle === Actions.approveProgress.uniqueTitle ||
    //     action.actionObj.uniqueTitle === Actions.returnProgress.uniqueTitle
    //   ) {
    //     console.warn('EH YO');
    //     const isApprove =
    //       action.actionObj.uniqueTitle === Actions.approveProgress.uniqueTitle
    //         ? true
    //         : false;
    //     const popupMsg =
    //       action.actionObj.uniqueTitle === Actions.approveProgress.uniqueTitle
    //         ? 'approve progress'
    //         : 'return progress';
    //     if (!isApprove) {
    //       this.openMilestoneWorkflowActionsModal(
    //         action.actionObj.uniqueTitle,
    //         action.item,
    //         false,
    //         false
    //       );
    //     } else {
    //       this.makeSureToApprove(
    //         this.reportsDetails.milestoneName || 'unnamed',
    //         popupMsg
    //       ).subscribe((res) => {
    //         if (!res) {
    //           return;
    //         }
    //         this.isLoadingSteps = true;
    //         this.reportsService
    //           .updateMilestoneRecord(
    //             this.reportsDetails.currentMilestoneProgressUpdateDto
    //               ?.workflowId || '',
    //             action.item.requestTaskId,
    //             true,
    //             isApprove
    //           )
    //           .subscribe(() => {
    //             this.getReportDetails();
    //           });
    //       });
    //     }
    //   }
    //   if (
    //     action.actionObj.uniqueTitle === Actions.reviewEvidence.uniqueTitle ||
    //     action.actionObj.uniqueTitle ===
    //       Actions.reviewJustification.uniqueTitle ||
    //     action.actionObj.uniqueTitle === Actions.reviewOnTrack.uniqueTitle
    //   ) {
    //     const params: {
    //       requestParams: { name: string; value: number | string | boolean }[];
    //     } = {
    //       requestParams: [],
    //     };
    //     this.makeSureToApprove(
    //       this.reportsDetails.milestoneName || 'unnamed'
    //     ).subscribe((res) => {
    //       if (!res) {
    //         return;
    //       }
    //       if (action.item.taskName === 'Review Evidence') {
    //         params.requestParams.push({
    //           name: 'is_evidence_approved',
    //           value: 1, // 1 means approved.
    //         });
    //       } else if (action.item.taskName === 'Review Justification') {
    //         params.requestParams.push({
    //           name: 'is_justification_approved',
    //           value: 1, // 1 means approved.
    //         });
    //       } else if (action.item.taskName === 'Review Progress') {
    //         params.requestParams.push({
    //           name: 'is_remark_approved',
    //           value: 1, // 1 means approved.
    //         });
    //       }
    //       this.isLoadingSteps = true;
    //       this.reportsService
    //         .completePendingTask(
    //           this.reportsDetails.currentMilestoneProgressUpdateDto
    //             ?.workflowId || '',
    //           action.item.requestTaskId,
    //           params
    //         )
    //         .subscribe(() => {
    //           this.getReportDetails();
    //         });
    //     });
    //   }
    //   if (
    //     action.actionObj.uniqueTitle === Actions.returnEvidence.uniqueTitle ||
    //     action.actionObj.uniqueTitle ===
    //       Actions.returnJustification.uniqueTitle ||
    //     action.actionObj.uniqueTitle === Actions.returnOnTrack.uniqueTitle ||
    //     action.actionObj.uniqueTitle === Actions.addEvidence.uniqueTitle ||
    //     action.actionObj.uniqueTitle === Actions.addJustification.uniqueTitle ||
    //     action.actionObj.uniqueTitle === Actions.addOnTrack.uniqueTitle
    //   ) {
    //     console.warn('EH');
    //     this.openMilestoneWorkflowActionsModal(
    //       action.actionObj.uniqueTitle,
    //       action.item
    //     );
    //   }
    //   if (action.actionObj.uniqueTitle === Actions.noNeed.uniqueTitle) {
    //     const params: {
    //       requestParams: { name: string; value: number | string | boolean }[];
    //     } = {
    //       requestParams: [],
    //     };
    //     this.isLoadingSteps = true;
    //     this.reportsService
    //       .completePendingTask(
    //         this.reportsDetails.currentMilestoneProgressUpdateDto
    //           ?.workflowId || '',
    //         action.item.requestTaskId,
    //         params
    //       )
    //       .subscribe(() => {
    //         this.getReportDetails();
    //       });
    //   }
    // } else if (
    //   typeof action.actionObj === 'string' &&
    //   action.actionObj === 'download'
    // ) {
    //   this.downloadFile(action.item.id, action.item.label);
    // }
  }

  handleStepperAction(action: string, item: RequestTask) {
    if (action === 'Approve' || action === 'Approve SLA') {
      this.approveStep(item);
    }

    if (action === 'Reject' || action === 'Reject SLA') {
      this.rejectStep(item);
    }

    if (action === 'Edit Report') {
      this.router.navigate(['/home/add_report'], {
        queryParams: { mode: 'edit_report', id: this.reportsDetails.id },
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
      this.approveInitiatorStep(item);
    }

    if (action === 'Initiator Reject') {
      this.rejectInitiatorStep(item);
    }
  }

  approveInitiatorStep(item: RequestTask) {
    const msg = `Are you sure to approve current state?`;
    this.confirmAction(msg).subscribe((res) => {
      if (!res) {
        return;
      }

      this.approveInitiator(item);
    });
  }

  rejectInitiatorStep(item: RequestTask) {
    const msg = `Are you sure to reject current state?`;
    this.confirmAction(msg).subscribe((res) => {
      if (!res) {
        return;
      }

      this.approveInitiator(item);
    });
  }

  rejectInitiator(item: RequestTask) {
    const params: RequestTaskAttributes = {
      requestParams: [{ name: 'is_approved_by_initiator', value: false }],
    };

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

  approveInitiator(item: RequestTask) {
    const params: RequestTaskAttributes = {
      requestParams: [{ name: 'is_approved_by_initiator', value: true }],
    };

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

  addDataStep(item: RequestTask) {
    const params: RequestTaskAttributes = {
      requestParams: [],
    };

    this.openAddDataForReportModal(item).subscribe(
      (res: { comment: string; attachments: string }) => {
        console.log('The res of dialog:', res);
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
            this.isLoadingSteps = false;
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

  approveStep(item: RequestTask) {
    const params: RequestTaskAttributes = {
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

  rejectStep(item: RequestTask) {
    const params: RequestTaskAttributes = {
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
            this.isLoadingSteps = false;
            this.getReportDetails();
          });
      }
    );
  }

  deleteFlowStep(item: RequestTask) {
    const params: RequestTaskAttributes = {
      requestParams: [{ name: 'delete', value: true }],
    };

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

  // isPanelOpen(panelNumber: number): boolean {
  //   return this.openPanel === panelNumber;
  // }

  // panelOpened(panelNumber: number): void {
  //   this.openPanel = panelNumber;
  // }

  downloadFile(id: number, name: string = 'untitled.txt') {
    this.reportsService.downloadAttachment(id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer]);
      // you may improve this code to customize the name
      // of the export based on date or some other factors
      saveAs(data, name);
    });
  }

  // openMilestoneWorkflowActionsModal(
  //   type: string,
  //   item?: RequestTask,
  //   isFirstUpdateProgress: boolean = true,
  //   showAttachment: boolean = true
  // ) {
  //   const dialogRef = this.matDialog.open(
  //     UpdateMilestoneProgressDialogComponent,
  //     {
  //       width: '800px',
  //       data: {
  //         milestoneName: this.reportsDetails.reportName,
  //         type,
  //         reportId: this.reportId,
  //         showAttachment,
  //       },
  //     }
  //   );

  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (!res) {
  //       this.isLoadingSteps = false;
  //       return;
  //     }

  //     const params: {
  //       requestParams: { name: string; value: number | string | boolean }[];
  //     } = {
  //       requestParams: [],
  //     };

  //     if (type === Actions.addEvidence.uniqueTitle) {
  //       if (res.attachments) {
  //         params.requestParams.push({
  //           name: 'evidence_id',
  //           value: res.attachments,
  //         });
  //       }
  //       params.requestParams.push({ name: 'notes', value: res.note });
  //     } else if (type === Actions.addJustification.uniqueTitle) {
  //       if (res.attachments) {
  //         params.requestParams.push({
  //           name: 'justification_id',
  //           value: res.attachments,
  //         });
  //       }
  //       params.requestParams.push({ name: 'notes', value: res.note });
  //     } else if (type === Actions.addOnTrack.uniqueTitle) {
  //       if (res.attachments) {
  //         params.requestParams.push({
  //           name: 'remark_id',
  //           value: res.attachments,
  //         });
  //       }
  //       params.requestParams.push({ name: 'notes', value: res.note });
  //     } else if (type === Actions.returnEvidence.uniqueTitle) {
  //       params.requestParams.push({
  //         name: 'is_evidence_approved',
  //         value: 2, // 2 means rejected.
  //       });

  //       params.requestParams.push({
  //         name: 'reason_of_rejection',
  //         value: res.note,
  //       });

  //       if (res.attachments) {
  //         params.requestParams.push({
  //           name: 'attachment_id',
  //           value: res.attachments,
  //         });
  //       }
  //     } else if (type === Actions.returnJustification.uniqueTitle) {
  //       params.requestParams.push({
  //         name: 'is_justification_approved',
  //         value: 2, // 2 means rejected.
  //       });

  //       params.requestParams.push({
  //         name: 'reason_of_rejection',
  //         value: res.note,
  //       });

  //       if (res.attachments) {
  //         params.requestParams.push({
  //           name: 'attachment_id',
  //           value: res.attachments,
  //         });
  //       }
  //     } else if (type === Actions.returnOnTrack.uniqueTitle) {
  //       params.requestParams.push({
  //         name: 'is_remark_approved',
  //         value: 2, // 2 means rejected.
  //       });

  //       params.requestParams.push({
  //         name: 'reason_of_rejection',
  //         value: res.note,
  //       });

  //       if (res.attachments) {
  //         params.requestParams.push({
  //           name: 'attachment_id',
  //           value: res.attachments,
  //         });
  //       }
  //     } else if (type === Actions.noNeed.uniqueTitle) {
  //       // no need action here.. not tested
  //     } else if (type === Actions.approveProgress.uniqueTitle) {
  //       params.requestParams.push({
  //         name: 'is_progress_approved',
  //         value: true, // 2 means rejected.
  //       });
  //     } else if (type === Actions.returnProgress.uniqueTitle) {
  //       params.requestParams.push({
  //         name: 'is_progress_approved',
  //         value: false, // 2 means rejected.
  //       });

  //       params.requestParams.push({
  //         name: 'reason_of_rejection',
  //         value: res.note,
  //       });
  //     }

  //     this.isLoadingSteps = true;
  //     // if (this.isUpdateProgressOnHold) {
  //     //   this.sendAllRequests(params, isFirstUpdateProgress);
  //     //   this.isUpdateProgressOnHold = false;
  //     // } else {
  //     //   this.reportsService
  //     //     .completePendingTask(
  //     //       this.reportsDetails.currentMilestoneProgressUpdateDto
  //     //         ?.workflowId || '',
  //     //       Number(item?.requestTaskId),
  //     //       params
  //     //     )
  //     //     .subscribe(() => {
  //     //       this.getReportDetails();
  //     //     });
  //     // }
  //   });
  // }

  // openProgressUpdateModal(
  //   reportId: Milestone['id'],
  //   isFirstUpdateProgress: boolean = true
  // ) {
  //   const dialogRef = this.matDialog.open(UpdateProgressDialogComponent, {
  //     width: '800px',
  //     data: {
  //       // overallProgress:
  //       //   this.reportsDetails.
  //       //     ?.overallProgress,
  //       // reportName: this.reportsDetails.reportName,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (!res) {
  //       return;
  //     }

  //     this.deliverableInMaking = res.deliverable;
  //     this.overallProgressInMaking = res.overallProgress;

  //     this.refinedProgressUpdate.deliverableInMaking = res.deliverable;
  //     this.refinedProgressUpdate.overallProgressInMaking = res.overallProgress;

  //     this.isLoadingSteps = true;
  //     this.isUpdateProgressOnHold = true;
  //     // this.sendProgressToCalculate(
  //     //   reportId,
  //     //   this.overallProgressInMaking,
  //     //   isFirstUpdateProgress
  //     // );
  //   });
  // }

  sendAllRequests(
    params: {
      requestParams: {
        name: string;
        value: number | string | boolean;
      }[];
    },
    isFirstUpdateProgress: boolean = true
  ) {
    if (isFirstUpdateProgress) {
      this.updateProgress().subscribe(() => {
        this.isLoadingSteps = true;
        this.needToPushWorkflowAction = true;
        this.getReportDetails(params);
      });
    } else {
      // this.updateNonInitialProgress().subscribe(() => {
      //   this.needToPushWorkflowAction = true;
      //   this.isLoadingSteps = true;
      //   this.getReportDetails(params);
      // });
    }
  }

  updateProgress() {
    return this.reportsService.updateMilestoneProgress({
      reportId: this.reportsDetails.id!,
      deliverable: this.deliverableInMaking,
      overallProgress: this.overallProgressInMaking,
    });
  }

  updateNonInitialProgress() {
    // const params: {
    //   requestParams: { name: string; value: number | string | boolean }[];
    // } = {
    //   requestParams: [
    //     {
    //       name: 'overall_progress',
    //       value: this.refinedProgressUpdate.overallProgressInMaking,
    //     },
    //     {
    //       name: 'deliverable',
    //       value: this.refinedProgressUpdate.deliverableInMaking,
    //     },
    //   ],
    // };
    // return this.reportsService.completePendingTask(
    //   this.reportsDetails.currentMilestoneProgressUpdateDto?.workflowId || '',
    //   this.refinedProgressUpdate.requestTaskId,
    //   params
    // );
  }

  pushWorkflowAction(params: Params) {
    // this.isLoadingSteps = true;
    // this.reportsService
    //   .completePendingTask(
    //     this.reportsDetails.currentMilestoneProgressUpdateDto?.workflowId ||
    //       '',
    //     this.steps[1].stepObject.requestTaskId,
    //     params
    //   )
    //   .subscribe(() => {
    //     this.isLoadingSteps = true;
    //     this.needToPushWorkflowAction = false;
    //     this.getReportDetails();
    //   });
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

  isDirector(): boolean {
    return this.reportsService.checkIsDirector();
  }
}
