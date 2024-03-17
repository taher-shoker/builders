/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Milestone } from './../milestones/milestones.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import { saveAs } from 'file-saver';
import { AuthService } from '../../../../services/auth.service';
import {
  Actions,
  MilestoneDetails,
  MilestonesService,
  RequestTask,
} from '../../milestones.service';
import { Step } from 'libs/shared-ui/src/lib/actions-stepper/actions-stepper.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMilestoneProgressDialogComponent } from '../update-milestone-progress-dialog/update-milestone-progress-dialog.component';
import { DatePipe } from '@angular/common';
import { UpdateProgressDialogComponent } from '../updateProgressDialog/updateProgressDialog.component';
import { MessageDialogComponent } from 'libs/shared-ui/src/lib/message-dialog/message-dialog.component';

@Component({
  selector: 'stc-apps-milestone-details',
  templateUrl: './milestone-details.component.html',
  styleUrls: ['./milestone-details.component.scss'],
})
export class MilestoneDetailsComponent implements OnInit {
  steps: Step[] = [];
  milestoneId!: string;
  milestoneDetails!: MilestoneDetails;
  isLoadingSteps: boolean = false;

  constructor(
    protected dialogService: DialogService,
    private bannerDataService: BannerDataService,
    private route: ActivatedRoute,
    public milestonesService: MilestonesService,
    public authService: AuthService,
    private matDialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.milestoneId = this.route.snapshot.params['id'];
    this.getMilestoneDetails();
  }

  progress!: string | null;
  deliverable!: string | null;
  progressDate!: string;
  progressUpdatedBy!: string;

  askUserToInitiateUpdateProgress() {
    const initialStep: Step = {
      caption: Actions.initiateUpdateProgress,
      state: 'undone',
      actions: [Actions.initiateUpdateProgress],
    };

    this.steps.unshift(initialStep); // Adding the first step statically in the array before looping the rest of tasks.
  }

  showMilestoneProgressWorkflow() {
    this.isLoadingSteps = true;

    this.steps = [];
    console.log('details :', this.milestoneDetails);
    this.progress =
      this.milestoneDetails.milestoneProgressUpdateDTO.overallProgress;
    this.progressUpdatedBy =
      this.milestoneDetails.milestoneProgressUpdateDTO.updatedBy;
    this.deliverable =
      this.milestoneDetails.milestoneProgressUpdateDTO.deliverable;
    this.progressDate =
      this.datePipe.transform(
        this.milestoneDetails.milestoneProgressUpdateDTO.progressUpdateDate,
        'MMMM, d, y'
      ) || '';
    const initialStep: Step = {
      caption: 'Milestone progress updated',
      state: 'done',
      extraInfo: [`${this.progressDate} By ${this.progressUpdatedBy}`],
      additionalTemp: true,
    };

    this.steps.unshift(initialStep); // Adding the first step statically in the array before looping the rest of tasks.

    if (this.milestoneDetails.milestoneProgressUpdateDTO.workflowId) {
      this.milestonesService
        .getMilestoneProgressWorkflow(
          this.milestoneDetails.milestoneProgressUpdateDTO.workflowId
        )
        .subscribe((res) => {
          this.isLoadingSteps = false;

          res.sort(function (a, b) {
            return b.requestTaskId - a.requestTaskId;
          });

          let foundAddRemarksOnce: 'once' | 'twice' | null = null; // to show or hide the noNeed action in the loop.

          for (let i = res.length - 1; i >= 0; i--) {
            console.log(`El task num${i}`, res[i]);

            if (
              res[i].taskName === Actions.addOnTrack &&
              foundAddRemarksOnce === null
            ) {
              foundAddRemarksOnce = 'once'; // Once means show "No Need" btn cuz it's one instance
            } else if (
              res[i].taskName === Actions.addOnTrack &&
              foundAddRemarksOnce === 'once'
            ) {
              foundAddRemarksOnce = 'twice'; // Twice means hide the "No Need" btn
            }

            const attachmentsIDs: string[] = [];
            let notes: string = '';

            const displayDate = res[i].completedDate
              ? res[i].completedDate
              : res[i].createdDate;
            const progressDate: string =
              (this.datePipe.transform(displayDate, 'MMMM, d, y') || '') +
                ' ' +
                this.datePipe.transform(displayDate, 'h:mm:ss a') || '';

            let byUser = '';
            const actions: string[] = [];

            for (const taskAttribute of res[i].requestTaskAttributes) {
              if (res[i].status !== 'pending') {
                byUser = `By ${res[i].username}`;
              }

              if (
                taskAttribute.name === 'evidence_id' ||
                taskAttribute.name === 'justification_id' ||
                taskAttribute.name === 'remark_id'
              ) {
                attachmentsIDs.push(taskAttribute.value);
              } else if (
                taskAttribute.name === 'notes' ||
                taskAttribute.name === 'reason_of_rejection'
              ) {
                notes = taskAttribute.value;
              }
            }

            if (res[i].status === 'pending' && res[i].params?.length > 0) {
              //those two conditions are for a user to take action, otherwise it's not his task to handle.
              if (
                res[i].taskName === 'Review Evidence' ||
                res[i].taskName === 'Review Justification' ||
                res[i].taskName === 'Review Progress'
              ) {
                if (res[i].taskName === 'Review Evidence') {
                  actions.push(Actions.reviewEvidence);
                  actions.push(Actions.returnEvidence); // Adding action 'Return' in all 3 cases.
                }
                if (res[i].taskName === 'Review Justification') {
                  actions.push(Actions.reviewJustification);
                  actions.push(Actions.returnJustification); // Adding action 'Return' in all 3 cases.
                }
                if (res[i].taskName === 'Review Progress') {
                  actions.push(Actions.reviewOnTrack);
                  actions.push(Actions.returnOnTrack); // Adding action 'Return' in all 3 cases.
                }
              } else if (
                res[i].taskName === Actions.addEvidence ||
                res[i].taskName === Actions.addJustification ||
                res[i].taskName === Actions.addOnTrack
              ) {
                if (res[i].taskName === Actions.addEvidence) {
                  actions.push(Actions.addEvidence);
                }
                if (res[i].taskName === Actions.addJustification) {
                  actions.push(Actions.addJustification);
                }
                if (res[i].taskName === Actions.addOnTrack) {
                  actions.push(Actions.addOnTrack);
                  if (foundAddRemarksOnce !== 'twice') {
                    actions.push(Actions.noNeed); // TODO: Loop over to check if a previous 'Add Remarks' Exists, if so remove noNeed.
                  }
                }
              } else if (res[i].taskName === 'Update DT Record') {
                actions.push(Actions.updateDTRecord);
              } else if (res[i].taskName === 'Approve Progress') {
                actions.push(Actions.approveProgress);
              }
            }

            const step: Step = {
              caption:
                res[i].taskName === 'Review Remarks'
                  ? 'Review Progress'
                  : res[i].taskName,
              state: res[i].status === 'completed' ? 'done' : 'undone',
              notes: notes,
              attachments: attachmentsIDs,
              extraInfo: [`${progressDate} ${byUser}`],
              actions: actions,
              stepObject: res[i],
            };
            this.steps.push(step);
          }
        });
    }
  }

  getMilestoneDetails() {
    this.milestonesService
      .getMilestone(this.milestoneId)
      .subscribe((res: any) => {
        this.milestoneDetails = res;
        this.bannerDataService.updateData({
          title: this.milestoneDetails.milestoneName + ' details',
          text: '',
        });
        if (
          this.milestoneDetails.milestoneProgressUpdateDTO &&
          this.milestoneDetails.milestoneProgressUpdateDTO.overallProgress
        ) {
          this.showMilestoneProgressWorkflow();
        } else {
          this.askUserToInitiateUpdateProgress();
        }
      });
  }

  doStepAction(action: { actionName: string; item: any }) {

    if (action.actionName === Actions.initiateUpdateProgress) {
      this.openProgressUpdateModal(this.milestoneDetails.id || 0);
    }

    if (
      action.actionName === Actions.updateDTRecord ||
      action.actionName === Actions.approveProgress
    ) {
      this.isLoadingSteps = true;

      this.milestonesService
        .updateMilestoneRecord(
          this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
          action.item.requestTaskId
        )
        .subscribe(() => {
          this.getMilestoneDetails();
        });
    }

    if (
      action.actionName === Actions.reviewEvidence ||
      action.actionName === Actions.reviewJustification ||
      action.actionName === Actions.reviewOnTrack
    ) {
      const params: {
        requestParams: { name: string; value: number | string | boolean }[];
      } = {
        requestParams: [],
      };

      this.makeSureToApprove(
        this.milestoneDetails.milestoneName || 'unnamed'
      ).subscribe((res) => {
        if (!res) {
          return;
        }

        if (action.item.taskName === 'Review Evidence') {
          params.requestParams.push({
            name: 'is_evidence_approved',
            value: true,
          });
        } else if (action.item.taskName === 'Review Justification') {
          params.requestParams.push({
            name: 'is_justification_approved',
            value: true,
          });
        } else if (action.item.taskName === 'Review Progress') {
          params.requestParams.push({
            name: 'is_remark_approved',
            value: true,
          });
        }

      this.isLoadingSteps = true;

        this.milestonesService
          .completePendingTask(
            this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
            action.item.requestTaskId,
            params
          )
          .subscribe(() => {
            this.getMilestoneDetails();
          });
      });
    }

    if (
      action.actionName === Actions.returnEvidence ||
      action.actionName === Actions.returnJustification ||
      action.actionName === Actions.returnOnTrack ||
      action.actionName === Actions.addEvidence ||
      action.actionName === Actions.addJustification ||
      action.actionName === Actions.addOnTrack
    ) {
      this.openMilestoneWorkflowActionsModal(
        action.actionName as Actions,
        action.item
      );
    }

    if (action.actionName === Actions.noNeed) {
      const params: {
        requestParams: { name: string; value: number | string | boolean }[];
      } = {
        requestParams: [],
      };

      this.isLoadingSteps = true;

      this.milestonesService
        .completePendingTask(
          this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
          action.item.requestTaskId,
          params
        )
        .subscribe(() => {
          this.getMilestoneDetails();
        });
    }

    if (action.actionName === 'download') {
      this.downloadFile(action.item);
    }
  }

  downloadFile(id: number, name: string = 'untitled') {
    this.milestonesService.downloadAttachment(id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8',
      });
      // you may improve this code to customize the name
      // of the export based on date or some other factors
      saveAs(data, name);
    });
  }

  openMilestoneWorkflowActionsModal(type: Actions, taskItem: RequestTask) {
    const dialogRef = this.matDialog.open(
      UpdateMilestoneProgressDialogComponent,
      {
        width: '800px',
        data: {
          milestoneName: this.milestoneDetails.milestoneName,
          type,
          milestoneId: this.milestoneId,
        },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      const params: {
        requestParams: { name: string; value: number | string | boolean }[];
      } = {
        requestParams: [],
      };

      if (type === Actions.addEvidence) {
        params.requestParams.push({
          name: 'evidence_id',
          value: res.attachments,
        });
        params.requestParams.push({ name: 'notes', value: res.note });
      } else if (type === Actions.addJustification) {
        params.requestParams.push({
          name: 'justification_id',
          value: res.attachments,
        });
        params.requestParams.push({ name: 'notes', value: res.note });
      } else if (type === Actions.addOnTrack) {
        console.warn(res);
        params.requestParams.push({
          name: 'remark_id',
          value: res.attachments,
        });
        params.requestParams.push({ name: 'notes', value: res.note });
      } else if (type === Actions.returnEvidence) {
        params.requestParams.push({
          name: 'is_evidence_approved',
          value: false,
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
      } else if (type === Actions.returnJustification) {
        params.requestParams.push({
          name: 'is_justification_approved',
          value: false,
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
      } else if (type === Actions.returnOnTrack) {
        params.requestParams.push({
          name: 'is_remark_approved',
          value: false,
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
      }

      this.isLoadingSteps = true;
      this.milestonesService
        .completePendingTask(
          this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
          taskItem.requestTaskId,
          params
        )
        .subscribe(() => {
          this.getMilestoneDetails();
        });
    });
  }

  openProgressUpdateModal(milestoneId: Milestone['id']) {
    const dialogRef = this.matDialog.open(UpdateProgressDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {

      if (!res) {
        return;
      }
      this.isLoadingSteps = true;

      this.milestonesService
        .updateMilestoneProgress({
          milestoneId: milestoneId,
          deliverable: res.deliverable,
          overallProgress: res.overallProgress,
        })
        .subscribe(() => {
          setTimeout(() => {
            this.getMilestoneDetails();
          }, 7000);
        });
    });
  }

  makeSureToApprove(name: string) {
    {
      const dialogRef = this.matDialog.open(MessageDialogComponent, {
        height: '160px',
        width: '500px',
        data: {
          msg: `You're about to approve Milestone "${name}" Kindly note you can't roll back this action. Are you sure?`,
        },
        disableClose: true,
      });
      return dialogRef.afterClosed();
    }
  }
}
