/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogService, BannerDataService } from '@stc-apps/shared-ui';
import saveAs from 'file-saver';
import {
  ReportDetails,
  ReportsService,
  Actions,
  MilestoneAttachment,
  RequestTask,
} from '../../dy-reports.service';
import { Milestone } from '../reports/reports.component';
import { UpdateMilestoneProgressDialogComponent } from '../update-milestone-progress-dialog/update-milestone-progress-dialog.component';
import { UpdateProgressDialogComponent } from '../updateProgressDialog/updateProgressDialog.component';
import { AuthService } from 'apps/dt-drf/src/app/services/auth.service';
import { Step } from 'libs/shared-ui/src/lib/actions-stepper/actions-stepper.component';
import { MessageDialogComponent } from 'libs/shared-ui/src/lib/message-dialog/message-dialog.component';

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
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.reportsService.checkIsAdmin();
    this.route.params.subscribe((params) => {
      this.reportId = params['id'];
      this.getReportDetails();
    });
  }

  askUserToInitiateUpdateProgress() {
    const initialStep: Step = {
      caption: Actions.initiateUpdateProgress.displayCaption,
      state: 'undone',
      actions: [Actions.initiateUpdateProgress],
    };
    this.isLoadingSteps = false;
    if (!this.isDirector()) {
      this.steps.unshift(initialStep); // Adding the first step statically in the array before looping the rest of tasks.
    }
  }

  showMilestoneProgressWorkflow(params?: Params) {
    this.isLoadingSteps = true;

    // this.steps = [];
    // if (this.reportsDetails.currentMilestoneProgressUpdateDto) {
    //   this.progress =
    //     this.reportsDetails.currentMilestoneProgressUpdateDto.overallProgress;
    //   this.progressUpdatedBy =
    //     this.reportsDetails.currentMilestoneProgressUpdateDto.updatedBy;
    //   this.deliverable =
    //     this.reportsDetails.currentMilestoneProgressUpdateDto.deliverable;
    //   this.status =
    //     this.reportsDetails.currentMilestoneProgressUpdateDto.status;
    //   this.progressDate =
    //     this.datePipe.transform(
    //       this.reportsDetails.currentMilestoneProgressUpdateDto
    //         .progressUpdateDate,
    //       'medium'
    //     ) || '';
    // } else if (this.reportsDetails.latestApprovedMilestoneProgressUpdate) {
    //   this.progress =
    //     this.reportsDetails.latestApprovedMilestoneProgressUpdate.overallProgress;
    //   this.progressUpdatedBy =
    //     this.reportsDetails.latestApprovedMilestoneProgressUpdate.updatedBy;
    //   this.deliverable =
    //     this.reportsDetails.latestApprovedMilestoneProgressUpdate.deliverable;
    //   this.status =
    //     this.reportsDetails.latestApprovedMilestoneProgressUpdate.status;
    //   this.progressDate =
    //     this.datePipe.transform(
    //       this.reportsDetails.latestApprovedMilestoneProgressUpdate
    //         .progressUpdateDate,
    //       'medium'
    //     ) || '';
    // }
    const initialStep: Step = {
      caption: `Milestone progress updated (${this.status})`,
      state: 'done',
      extraInfo: [`${this.progressDate} By ${this.progressUpdatedBy}`],
      additionalTemp: true,
      captionTemp: true,
    };

    this.steps.unshift(initialStep); // Adding the first step statically in the array before looping the rest of tasks.
    this.getMilestoneProgressWorkflow(params);
  }

  getMilestoneProgressWorkflow(params?: Params) {
    // if (
    //   this.reportsDetails.currentMilestoneProgressUpdateDto &&
    //   this.reportsDetails.currentMilestoneProgressUpdateDto.workflowId
    // ) {
    //   this.reportsService
    //     .getMilestoneProgressWorkflow(
    //       this.reportsDetails.currentMilestoneProgressUpdateDto.workflowId
    //     )
    //     .subscribe((res) => {
    //       if (!this.isUpdateProgressOnHold) {
    //         this.isLoadingSteps = false;
    //       }
    //       res.sort(function (a, b) {
    //         return b.requestTaskId - a.requestTaskId;
    //       });
    //       let foundAddRemarksOnce: 'once' | 'twice' | null = null; // to show or hide the noNeed action in the loop.
    //       for (let i = res.length - 1; i >= 0; i--) {
    //         if (
    //           res[i].taskName === Actions.addOnTrack.uniqueTitle &&
    //           foundAddRemarksOnce === null
    //         ) {
    //           foundAddRemarksOnce = 'once'; // Once means show "No Need" btn cuz it's one instance
    //         } else if (
    //           res[i].taskName === Actions.addOnTrack.uniqueTitle &&
    //           foundAddRemarksOnce === 'once'
    //         ) {
    //           foundAddRemarksOnce = 'twice'; // Twice means hide the "No Need" btn
    //         }
    //         const attachmentsIDs: string[] = [];
    //         const attachments: MilestoneAttachment[] = [];
    //         let notes: string = '';
    //         const displayDate = res[i].completedDate
    //           ? res[i].completedDate
    //           : res[i].createdDate;
    //         const progressDate: string =
    //           this.datePipe.transform(displayDate, 'medium') || '';
    //         let byUser = '';
    //         let userThatTaskIsPendingOn = '';
    //         const actions: Actions[] = [];
    //         let isWarningState: boolean = false;
    //         for (const taskAttribute of res[i].requestTaskAttributes) {
    //           if (res[i].status !== 'pending') {
    //             byUser = `By ${res[i].completedByName}`;
    //             if (
    //               taskAttribute.name.includes('approved') &&
    //               (taskAttribute.value === 'false' ||
    //                 taskAttribute.value == '0' ||
    //                 taskAttribute.value == '2')
    //             ) {
    //               // Means it's approval (review) step and it's not approved.
    //               isWarningState = true;
    //             }
    //           }
    //           if (
    //             taskAttribute.name === 'evidence_id' ||
    //             taskAttribute.name === 'justification_id' ||
    //             taskAttribute.name === 'remark_id' ||
    //             taskAttribute.name === 'attachment_id'
    //           ) {
    //             attachmentsIDs.push(taskAttribute.value);
    //           } else if (
    //             taskAttribute.name === 'notes' ||
    //             taskAttribute.name === 'reason_of_rejection'
    //           ) {
    //             notes = taskAttribute.value;
    //           }
    //         }
    //         for (const attachmentID of attachmentsIDs) {
    //           this.reportsService
    //             .getAttachment(+attachmentID)
    //             .subscribe((res) => {
    //               attachments.push(res);
    //             });
    //         }
    //         if (
    //           res[i].taskName === 'Review Evidence' ||
    //           res[i].taskName === 'Review Justification' ||
    //           res[i].taskName === 'Review Progress' ||
    //           res[i].taskName === 'Update DT Record'
    //         ) {
    //           userThatTaskIsPendingOn = 'DT User';
    //         }
    //         if (res[i].taskName === 'Approve Progress') {
    //           userThatTaskIsPendingOn = 'DT Director';
    //         }
    //         if (res[i].taskName === 'Add New Progress') {
    //           userThatTaskIsPendingOn = res[i].username;
    //         }
    //         if (res[i].status === 'pending' && res[i].params?.length > 0) {
    //           //those two conditions are for a user to take action, otherwise it's not his task to handle.
    //           if (res[i].taskName === 'Add New Progress') {
    //             actions.push(Actions.addNewProgress);
    //           }
    //           if (
    //             res[i].taskName === 'Review Evidence' ||
    //             res[i].taskName === 'Review Justification' ||
    //             res[i].taskName === 'Review Progress'
    //           ) {
    //             if (res[i].taskName === 'Review Evidence') {
    //               actions.push(Actions.reviewEvidence);
    //               actions.push(Actions.returnEvidence); // Adding action 'Return' in all 3 cases.
    //             }
    //             if (res[i].taskName === 'Review Justification') {
    //               actions.push(Actions.reviewJustification);
    //               actions.push(Actions.returnJustification); // Adding action 'Return' in all 3 cases.
    //             }
    //             if (res[i].taskName === 'Review Progress') {
    //               actions.push(Actions.reviewOnTrack);
    //               actions.push(Actions.returnOnTrack); // Adding action 'Return' in all 3 cases.
    //             }
    //           } else if (
    //             res[i].taskName === Actions.addEvidence.uniqueTitle ||
    //             res[i].taskName === Actions.addJustification.uniqueTitle ||
    //             res[i].taskName === Actions.addOnTrack.uniqueTitle
    //           ) {
    //             if (res[i].taskName === Actions.addEvidence.uniqueTitle) {
    //               actions.push(Actions.addEvidence);
    //             }
    //             if (res[i].taskName === Actions.addJustification.uniqueTitle) {
    //               actions.push(Actions.addJustification);
    //             }
    //             if (res[i].taskName === Actions.addOnTrack.uniqueTitle) {
    //               actions.push(Actions.addOnTrack);
    //               if (foundAddRemarksOnce !== 'twice') {
    //                 actions.push(Actions.noNeed);
    //               }
    //             }
    //           } else if (res[i].taskName === 'Approve Progress') {
    //             actions.push(Actions.approveProgress);
    //             actions.push(Actions.returnProgress);
    //           }
    //         }
    //         if (
    //           res[i].taskName === 'Update DT Record' &&
    //           res[i].params?.length === 0
    //         ) {
    //           // This is to check if params is received but empty, that must indicate that the user can Update DT Record
    //           actions.push(Actions.updateDTRecord);
    //         }
    //         const step: Step = {
    //           caption:
    //             res[i].taskName === 'Review Remarks'
    //               ? 'Review Progress'
    //               : res[i].taskName +
    //                 (isWarningState === true ? ' (Returned)' : ''),
    //           state:
    //             isWarningState === true
    //               ? 'warning'
    //               : res[i].status === 'completed'
    //               ? 'done'
    //               : 'undone',
    //           notes: notes,
    //           // attachments: attachments,
    //           extraInfo: [
    //             `${progressDate} ${byUser || 'By ' + userThatTaskIsPendingOn}`,
    //           ],
    //           actions: actions,
    //           stepObject: res[i],
    //         };
    //         this.steps.push(step);
    //       }
    //       if (this.needToPushWorkflowAction) {
    //         this.pushWorkflowAction(params!);
    //       }
    //     });
    // }
  }

  getReportDetails(params?: Params) {
    this.reportsService.getReport(this.reportId).subscribe((res: any) => {
      // this.reportsService.getRemindersData();
      this.reportsDetails = res;
      this.bannerDataService.updateData({
        title: this.reportsDetails.reportName || '',
        text: '',
      });

      // if (
      //   this.reportsDetails.currentMilestoneProgressUpdateDto &&
      //   this.reportsDetails.currentMilestoneProgressUpdateDto
      //     .overallProgress
      // ) {
      //   this.showMilestoneProgressWorkflow(params);
      // } else {
      //   this.steps = [];
      //   this.askUserToInitiateUpdateProgress();
      // }
      // this.getHistory(res);
    });
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

  doSpecialStepAction(
    action: { actionObj: Actions | string },
    isFirstUpdateProgress: boolean = true
  ) {
    if (
      typeof action.actionObj !== 'string' &&
      'uniqueTitle' in action.actionObj
    ) {
      if (
        action.actionObj.uniqueTitle === Actions.returnEvidence.uniqueTitle ||
        action.actionObj.uniqueTitle ===
          Actions.returnJustification.uniqueTitle ||
        action.actionObj.uniqueTitle === Actions.returnOnTrack.uniqueTitle ||
        action.actionObj.uniqueTitle === Actions.addEvidence.uniqueTitle ||
        action.actionObj.uniqueTitle === Actions.addJustification.uniqueTitle ||
        action.actionObj.uniqueTitle === Actions.addOnTrack.uniqueTitle
      ) {
        this.openMilestoneWorkflowActionsModal(
          action.actionObj.uniqueTitle,
          undefined,
          isFirstUpdateProgress
        );
      }
    }
  }

  isPanelOpen(panelNumber: number): boolean {
    return this.openPanel === panelNumber;
  }

  panelOpened(panelNumber: number): void {
    this.openPanel = panelNumber;
  }

  downloadFile(id: number, name: string = 'untitled.txt') {
    this.reportsService.downloadAttachment(id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer]);
      // you may improve this code to customize the name
      // of the export based on date or some other factors
      saveAs(data, name);
    });
  }

  openMilestoneWorkflowActionsModal(
    type: string,
    item?: RequestTask,
    isFirstUpdateProgress: boolean = true,
    showAttachment: boolean = true
  ) {
    const dialogRef = this.matDialog.open(
      UpdateMilestoneProgressDialogComponent,
      {
        width: '800px',
        data: {
          milestoneName: this.reportsDetails.reportName,
          type,
          reportId: this.reportId,
          showAttachment,
        },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.isLoadingSteps = false;
        return;
      }

      const params: {
        requestParams: { name: string; value: number | string | boolean }[];
      } = {
        requestParams: [],
      };

      if (type === Actions.addEvidence.uniqueTitle) {
        if (res.attachments) {
          params.requestParams.push({
            name: 'evidence_id',
            value: res.attachments,
          });
        }
        params.requestParams.push({ name: 'notes', value: res.note });
      } else if (type === Actions.addJustification.uniqueTitle) {
        if (res.attachments) {
          params.requestParams.push({
            name: 'justification_id',
            value: res.attachments,
          });
        }
        params.requestParams.push({ name: 'notes', value: res.note });
      } else if (type === Actions.addOnTrack.uniqueTitle) {
        if (res.attachments) {
          params.requestParams.push({
            name: 'remark_id',
            value: res.attachments,
          });
        }
        params.requestParams.push({ name: 'notes', value: res.note });
      } else if (type === Actions.returnEvidence.uniqueTitle) {
        params.requestParams.push({
          name: 'is_evidence_approved',
          value: 2, // 2 means rejected.
        });

        params.requestParams.push({
          name: 'reason_of_rejection',
          value: res.note,
        });

        if (res.attachments) {
          params.requestParams.push({
            name: 'attachment_id',
            value: res.attachments,
          });
        }
      } else if (type === Actions.returnJustification.uniqueTitle) {
        params.requestParams.push({
          name: 'is_justification_approved',
          value: 2, // 2 means rejected.
        });

        params.requestParams.push({
          name: 'reason_of_rejection',
          value: res.note,
        });

        if (res.attachments) {
          params.requestParams.push({
            name: 'attachment_id',
            value: res.attachments,
          });
        }
      } else if (type === Actions.returnOnTrack.uniqueTitle) {
        params.requestParams.push({
          name: 'is_remark_approved',
          value: 2, // 2 means rejected.
        });

        params.requestParams.push({
          name: 'reason_of_rejection',
          value: res.note,
        });

        if (res.attachments) {
          params.requestParams.push({
            name: 'attachment_id',
            value: res.attachments,
          });
        }
      } else if (type === Actions.noNeed.uniqueTitle) {
        // no need action here.. not tested
      } else if (type === Actions.approveProgress.uniqueTitle) {
        params.requestParams.push({
          name: 'is_progress_approved',
          value: true, // 2 means rejected.
        });
      } else if (type === Actions.returnProgress.uniqueTitle) {
        params.requestParams.push({
          name: 'is_progress_approved',
          value: false, // 2 means rejected.
        });

        params.requestParams.push({
          name: 'reason_of_rejection',
          value: res.note,
        });
      }

      this.isLoadingSteps = true;
      // if (this.isUpdateProgressOnHold) {
      //   this.sendAllRequests(params, isFirstUpdateProgress);
      //   this.isUpdateProgressOnHold = false;
      // } else {
      //   this.reportsService
      //     .completePendingTask(
      //       this.reportsDetails.currentMilestoneProgressUpdateDto
      //         ?.workflowId || '',
      //       Number(item?.requestTaskId),
      //       params
      //     )
      //     .subscribe(() => {
      //       this.getReportDetails();
      //     });
      // }
    });
  }

  openProgressUpdateModal(
    reportId: Milestone['id'],
    isFirstUpdateProgress: boolean = true
  ) {
    const dialogRef = this.matDialog.open(UpdateProgressDialogComponent, {
      width: '800px',
      data: {
        // overallProgress:
        //   this.reportsDetails.
        //     ?.overallProgress,
        // reportName: this.reportsDetails.reportName,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.deliverableInMaking = res.deliverable;
      this.overallProgressInMaking = res.overallProgress;

      this.refinedProgressUpdate.deliverableInMaking = res.deliverable;
      this.refinedProgressUpdate.overallProgressInMaking = res.overallProgress;

      this.isLoadingSteps = true;
      this.isUpdateProgressOnHold = true;
      this.sendProgressToCalculate(
        reportId,
        this.overallProgressInMaking,
        isFirstUpdateProgress
      );
    });
  }

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

  sendProgressToCalculate(
    reportId: number,
    progress: string,
    isFirstUpdateProgress: boolean = true
  ) {
    this.reportsService
      .calculateMilestoneProgress(reportId, progress)
      .subscribe((res: any) => {
        let actionObj: Actions;
        if (res.status === 'Delayed') {
          actionObj = Actions.addJustification;
        } else if (res.status === 'Completed') {
          actionObj = Actions.addEvidence;
        } else {
          actionObj = Actions.addOnTrack;
        }

        this.doSpecialStepAction({ actionObj }, isFirstUpdateProgress);
      });
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
