/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Milestone } from './../milestones/milestones.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import {
  Actions,
  Case,
  CaseStatus,
  MilestoneStatus,
  MilestonesService,
  RequestTask,
  TaskCicle,
  TaskInDetails,
  User,
} from '../../milestones.service';
import {
  Step,
  StepDirective,
} from 'libs/shared-ui/src/lib/actions-stepper/actions-stepper.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMilestoneProgressDialogComponent } from '../update-milestone-progress-dialog/update-milestone-progress-dialog.component';
import { DatePipe } from '@angular/common';
import { UpdateProgressDialogComponent } from '../updateProgressDialog/updateProgressDialog.component';
import { MessageDialogComponent } from 'libs/shared-ui/src/lib/message-dialog/message-dialog.component';

export interface MilestoneDetails {
  activityName: string | null;
  createdByEmail: string | null;
  createdByName: string | null;
  deliverable: string | null;
  endDate: Date | null;
  id: number | null;
  lastProgressUpdateDate: Date | null;
  milestoneName: string | null;
  startDate: Date | null;
  status: MilestoneStatus | null;
  teamName: string | null;
  updatedByEmail: null | string;
  updatedByName: null | string;
  weight: number | null;
  workingDays: number | null;
  milestoneProgressUpdateDTO: {
    deliverable: string | null;
    isApproved: boolean | null;
    milestoneId: number | null;
    overallProgress: string | null;
    progressUpdateDate: Date | null;
    workflowId: number | null;
  };
}

@Component({
  selector: 'stc-apps-milestone-details',
  templateUrl: './milestone-details.component.html',
  styleUrls: ['./milestone-details.component.scss'],
})
export class MilestoneDetailsComponent implements OnInit, OnDestroy {
  readonly TaskCicle = TaskCicle;
  readonly CaseStatus = CaseStatus;

  steps: Step[] = [];

  closeForm!: FormGroup;
  infoForm!: FormGroup;
  rejectForm!: FormGroup;
  replyForm!: FormGroup;
  firstEscalateForm!: FormGroup;
  secondEscalateForm!: FormGroup;

  formData = new FormData();

  milestoneId!: string;
  taskId!: number;
  caseSerial!: string;
  caseStatus!: string;
  milestoneDetails!: MilestoneDetails;
  allTasks!: TaskInDetails[];
  assigneeType = [
    { name: 'team', value: '1' },
    { name: 'users', value: '2' },
  ];
  users: any = [];
  teams: any = [];
  selectedTeam = {};
  selectedUser = {};
  langSub!: Subscription;
  invalidFileMessageDetail!: string;

  constructor(
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    private bannerDataService: BannerDataService,
    private route: ActivatedRoute,
    private router: Router,
    public milestonesService: MilestonesService,
    private languageManagerService: LanguageManagerService,
    public authService: AuthService,
    private matDialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.milestoneId = this.route.snapshot.params['id'];

    this.getMilestoneDetails(+this.milestoneId);

    // this.CasesService.getCase(this.milestoneId).subscribe((res) => {
    //   if (res) {
    //     this.milestoneDetails = res;
    //     this.caseSerial = res.caseSerialNumber;
    //     this.caseStatus = res.caseStatus;
    //     this.subscribeToLanguage();
    //     this.handleTeam(this.milestoneDetails, this.teams);
    //   }
    // });
    // this.getMilestoneTasks();

    this.closeForm = this.formBuilder.group({
      close_mail_content: [''],
    });
    this.infoForm = this.formBuilder.group({
      assignedTo: [this.assigneeType[1], Validators.required], //That makes the dropdown of team/users to have a *USER* option selected by default
      selectedUser: ['', Validators.required],
      message: ['', Validators.required],
      check_case_attachment: [''],
    });
    this.rejectForm = this.formBuilder.group({
      reject_note: [''],
    });
    this.replyForm = this.formBuilder.group({
      message: ['', Validators.required],
      check_case_attachment: [''],
    });
    this.firstEscalateForm = this.formBuilder.group({
      first_escalate_content: ['', Validators.required],
    });
    this.secondEscalateForm = this.formBuilder.group({
      second_escalate_content: ['', Validators.required],
    });
  }

  // checkIfUserShouldSeeMilestone() {
  //   if (this.milestoneDetails.teamName !== this.milestonesService.currentTeam.name) {
  //     console.log("checked", this.milestoneDetails.teamName, "++", this.milestonesService.currentTeam.name)
  //     console.log("checked", this.milestoneDetails.teamName, "++", this.milestonesService.currentTeam)
  //     this.router.navigate(['/'], { relativeTo: this.route });
  //   }
  // }

  progress!: string | null;
  deliverable!: string | null;
  progressDate!: string;

  askUserToInitiateUpdateProgress() {
    const initialStep: Step = {
      caption: Actions.initiateUpdateProgress,
      state: 'undone',
      actions: [Actions.initiateUpdateProgress],
    };

    this.steps.unshift(initialStep); // Adding the first step statically in the array before looping the rest of tasks.
  }

  showMilestoneProgressWorkflow() {
    this.steps = [];
    console.log('details :', this.milestoneDetails);
    this.progress =
      this.milestoneDetails.milestoneProgressUpdateDTO.overallProgress;
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
      extraInfo: [`${this.progressDate}`],
      additionalTemp: true,
    };

    this.steps.unshift(initialStep); // Adding the first step statically in the array before looping the rest of tasks.

    if (this.milestoneDetails.milestoneProgressUpdateDTO.workflowId) {
      this.milestonesService
        .getMilestoneProgressWorkflow(
          this.milestoneDetails.milestoneProgressUpdateDTO.workflowId
        )
        .subscribe((res) => {
          console.log('getMilesoneProgressWorkflow:', res);

          res.sort(function (a, b) {
            return b.requestTaskId - a.requestTaskId;
          });

          for (let i = res.length - 1; i >= 0; i--) {
            console.log('El task', res[i]);

            const attachmentsIDs: string[] = [];
            let notes: string = '';
            const progressDate: string =
              this.datePipe.transform(res[i].createdDate, 'MMMM, d, y') || '';
            const actions: string[] = [];

            for (const taskAttribute of res[i].requestTaskAttributes) {
              if (
                taskAttribute.name === 'evidence_id' ||
                taskAttribute.name === 'justification_id' ||
                taskAttribute.name === 'remark_id'
              ) {
                attachmentsIDs.push(taskAttribute.value);
              } else if (taskAttribute.name === 'notes') {
                notes = taskAttribute.value;
              }
            }

            if (res[i].status === 'pending' && res[i].params.length > 0) {
              //those two conditions are for a user to take action, otherwise it's not his task to handle.
              if (
                res[i].taskName === 'Review Evidence' ||
                res[i].taskName === 'Review Justification' ||
                res[i].taskName === 'Review Remarks'
              ) {
                if (res[i].taskName === 'Review Evidence') {
                  actions.push(Actions.reviewEvidence);
                }
                if (res[i].taskName === 'Review Justification') {
                  actions.push(Actions.reviewJustification);
                }
                if (res[i].taskName === 'Review Remarks') {
                  actions.push(Actions.reviewOnTrack);
                }
                actions.push(Actions.return); // Adding action 'Return' in all 3 cases.
              } else if (
                res[i].taskName === 'Add Evidence' ||
                res[i].taskName === 'Add Justification' ||
                res[i].taskName === 'Add Remarks'
              ) {
                if (res[i].taskName === 'Add Evidence') {
                  actions.push(Actions.addEvidence);
                }
                if (res[i].taskName === 'Add Justification') {
                  actions.push(Actions.addJustification);
                }
                if (res[i].taskName === 'Add Remarks') {
                  actions.push(Actions.addOnTrack);
                  actions.push(Actions.noNeed); // TODO: Loop over to check if a previous 'Add Remarks' Exists, if so remove noNeed.
                }
              } else if (res[i].taskName === 'Update DT Record') {
                actions.push(Actions.updateDTRecord);
              } else if (res[i].taskName === 'Approve Progress') {
                actions.push(Actions.approveProgress);
              }
            }

            const step: Step = {
              caption: res[i].taskName,
              state: res[i].status === 'completed' ? 'done' : 'undone',
              notes: notes,
              attachments: attachmentsIDs,
              extraInfo: [`${progressDate}`],
              actions: actions,
              stepObject: res[i],
            };
            this.steps.push(step);
          }
        });
    }
  }

  getMilestoneDetails(id: number) {
    this.milestonesService.getMilestone(id).subscribe((res: any) => {
      this.milestoneDetails = res;
      // this.checkIfUserShouldSeeMilestone();
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
      this.milestonesService
        .updateMilestoneRecord(
          this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
          action.item.requestTaskId
        )
        .subscribe((res) => {
          console.log('Res of updating record:', res);
          this.showMilestoneProgressWorkflow();
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
        } else if (action.item.taskName === 'Review Remarks') {
          params.requestParams.push({
            name: 'is_remark_approved',
            value: true,
          });
        }

        this.milestonesService
          .completePendingTask(
            this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
            action.item.requestTaskId,
            params
          )
          .subscribe((res) => {
            console.log('Resp of completing approve task :', res); // This is done and works fine.
            this.showMilestoneProgressWorkflow();
          });
      });
    }

    if (action.actionName === Actions.return) {
      this.openMilestoneWorkflowActionsModal(
        action.actionName as Actions,
        action.item
      );
    }

    if (
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

      // params.requestParams.push({
      //   name: 'remark_id',
      //   value: true,
      // });

      this.milestonesService
        .completePendingTask(
          this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
          action.item.requestTaskId,
          params
        )
        .subscribe((res) => {
          console.log('Resp of completing approve task :', res); // This is done and works fine.
          this.showMilestoneProgressWorkflow();
        });
    }

    if (action.actionName === 'download') {
      this.downloadFile(action.item);
    }

    // if (
    //   action.actionName !== Actions.initiateUpdateProgress &&
    //   action.actionName !== Actions.approveProgress
    // ) {

    //   if (
    //     action.actionName === Actions.reviewEvidence ||
    //     action.actionName === Actions.reviewJustification ||
    //     action.actionName === Actions.reviewOnTrack
    //   ) {

    //     const params: {
    //       requestParams: { name: string; value: number | string | boolean }[];
    //     } = {
    //       requestParams: [],
    //     };

    //     this.makeSureToApprove(
    //       this.milestoneDetails.milestoneName || 'unnamed'
    //     ).subscribe((res) => {
    //       if (!res) {
    //         return;
    //       }

    //       if (
    //         action.item.taskName === 'Review evidence' ||
    //         action.item.taskName === 'Review Evidence'
    //       ) {
    //         params.requestParams.push({
    //           name: 'is_evidence_approved',
    //           value: true,
    //         });
    //       } else if (
    //         action.item.taskName === 'Review justification' ||
    //         action.item.taskName === 'Review Justification'
    //       ) {
    //         params.requestParams.push({
    //           name: 'is_justification_approved',
    //           value: true,
    //         });
    //       } else if (
    //         action.item.taskName === 'Review on track' ||
    //         action.item.taskName === 'Review On Track'
    //       ) {
    //         params.requestParams.push({
    //           name: 'is_on_track_approved',
    //           value: true,
    //         });
    //       }

    //       this.milestonesService
    //         .completePendingTask(
    //           this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
    //           action.item.requestTaskId,
    //           params
    //         )
    //         .subscribe((res) => {
    //           console.log('Resp of completing approve evidence task :', res); // This is done and works fine.
    //           this.showMilestoneProgressWorkflow();
    //         });
    //     });
    //   } else {
    //     this.openMilestoneWorkflowActionsModal(
    //       action.actionName as Actions,
    //       action.item
    //     );
    //   }
    // } else if (action.actionName === Actions.initiateUpdateProgress) {
    //   this.openProgressUpdateModal(this.milestoneDetails.id || 0);
    // }

    // if (action.actionName === 'download') {
    //   this.downloadFile(action.item);
    // } else if (
    //   action.actionName === Actions.updateDTRecord ||
    //   action.actionName === Actions.approveProgress
    // ) {
    //   this.milestonesService
    //     .updateMilestoneRecord(
    //       this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
    //       action.item.requestTaskId
    //     )
    //     .subscribe((res) => {
    //       console.log('Res of updating record:', res);
    //     });
    // }
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
        params.requestParams.push({
          name: 'remark_id',
          value: res.attachments,
        });
        params.requestParams.push({ name: 'notes', value: res.note });
      } else if (type === Actions.return) {
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

      this.milestonesService
        .completePendingTask(
          this.milestoneDetails.milestoneProgressUpdateDTO.workflowId || '',
          taskItem.requestTaskId,
          params
        )
        .subscribe((res) => {
          console.log('Resp of completing approve evidence task :', res); // This is done and works fine.
          this.showMilestoneProgressWorkflow();
        });
      console.log('The reso :', res);
      console.log('The id :', this.milestoneId);
      console.log('The taskItem :', taskItem);
    });
  }

  openProgressUpdateModal(rowId: Milestone['id']) {
    const dialogRef = this.matDialog.open(UpdateProgressDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.milestonesService
        .updateMilestoneProgress({
          milestoneId: rowId,
          deliverable: res.deliverable,
          overallProgress: res.overallProgress,
        })
        .subscribe((res) => {
          console.log('Got a res for updating progress: ', res);
          this.showMilestoneProgressWorkflow();
        });
    });
  }

  makeSureToApprove(name: string) {
    {
      const dialogRef = this.matDialog.open(MessageDialogComponent, {
        width: '800px',
        data: {
          msg: `You're about to approve Milestone "${name}" Kindly note you can't roll back this action. Are you sure?`,
        },
        disableClose: true,
      });
      return dialogRef.afterClosed();
    }
  }

  isLoading = false;
  uploadedFile: any[] = []; // turn to File later
  onUploadFile(files: string | any[]) {
    if (files) {
      for (let i = 0; i < files?.length; i++) {
        this.isLoading = true;
        const formData = new FormData();
        formData.append('file', files[i]);
        // this.formData.append('file', files[i]);
        // this.milestonesService.uploadFile(formData).subscribe((res: any) => {
        //   if (res) {
        //     this.uploadedFile.push(res);
        //     this.isLoading = false;
        //     this.infoForm
        //       .get('check_case_attachment')
        //       ?.setValue(this.uploadedFile);
        //   }
        // });
      }
    }
  }

  onDeleteFile(id: number) {
    this.milestonesService.deleteFile(id).subscribe((res: any) => {
      this.uploadedFile = this.uploadedFile.filter((x: any) => x.id !== id);
      this.infoForm.get('check_case_attachment')?.setValue(this.uploadedFile);
    });
  }

  /** function to call fetching all tasks again and close any Modal if found **/
  refreshTasks(taskId: number, data: any) {
    this.milestonesService
      .updateCaseTask(+this.milestoneId, taskId, data)
      .subscribe((res: any) => {
        this.caseStatus = res.caseStatus;
        this.dialogService.close();
        this.getMilestoneDetails(+this.milestoneId);
      });
  }

  /** Actions with check case info (Request More Info) status **/
  onCheck(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('request-Info-Modal');
  }

  sendInfo() {
    const idsArr = [];
    for (const obj of this.uploadedFile) {
      idsArr.push(obj.id);
    }

    const data = {
      form: {
        info_needed: 1,
        form_assignee: this.infoForm.get('selectedUser')?.value.email
          ? this.infoForm.get('selectedUser')?.value.email
          : this.infoForm.get('selectedUser')?.value.name,
        message: this.infoForm.get('message')?.value,
        // check_case_attachment: this.infoForm.get('check_case_attachment')?.value
        check_case_attachment: idsArr,
      },
    };

    this.refreshTasks(this.taskId, data);

    this.closeForm.reset();
    this.infoForm.reset();
    this.uploadedFile = [];

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
  }

  cancelCheck(taskId: number) {
    const data = { form: { info_needed: 0 } };
    // this.milestonesService
    //   .updateCaseTask(+this.milestoneId, data)
    //   .subscribe((res: any) => {
    //     this.getMilestoneDetails(+this.milestoneId);
    //   });

    this.refreshTasks(taskId, data);
  }

  /** Actions with Fill More Info status  **/
  // getAssigneeValue(value: string) {
  //   if (value === '2') {
  //     this.users = [{ name: 'Demo', value: 'demo' }];
  //   }
  // }
  confirmReply() {
    const idsArr = [];
    for (const obj of this.uploadedFile) {
      idsArr.push(obj.id);
    }

    const data = {
      form: {
        message: this.replyForm.get('message')?.value,
        reply_attachments: idsArr,
      },
    };

    this.closeForm.reset();
    this.infoForm.reset();
    this.uploadedFile = [];

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
    this.refreshTasks(this.taskId, data);
  }
  replyfeed(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('replyFeeback-Modal');
  }

  /** Actions with Approve Casse status  **/

  confirm(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('approve-Modal');
  }

  approvedTask() {
    const data = { form: { case_approved: 1 } };
    this.refreshTasks(this.taskId, data);
  }
  /** Actions with Reject status **/
  reject(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('reject-Modal');
  }
  confirmReject() {
    const data = {
      form: {
        case_approved: 0,
        reject_note: this.rejectForm.get('reject_note')?.value,
      },
    };
    this.refreshTasks(this.taskId, data);
  }
  /** Actions with Within Response Casse status  **/

  withinResponse(taskId: number) {
    const data = { form: {} };
    this.refreshTasks(taskId, data);
  }
  /** Actions with Should First Escalate  Casse status  **/

  shouldFirstEscalate(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('first-escalate-Modal');
  }
  notFirstEscalate(taskId: number) {
    const data = { form: { should_first_escalate: 0 } };
    this.refreshTasks(taskId, data);
  }
  confirmFirstEscalate() {
    const data = {
      form: {
        should_first_escalate: 1,
        first_escalate_content: this.firstEscalateForm.get(
          'first_escalate_content'
        )?.value,
      },
    };
    this.refreshTasks(this.taskId, data);
  }
  /** Actions with Should Second Escalate  Casse status  **/

  shouldSecondEscalate(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('second-escalate-Modal');
  }
  notSecondEscalate(taskId: number) {
    const data = { form: { should_second_escalate: 0 } };
    this.refreshTasks(taskId, data);
  }
  confirmSecondEscalate() {
    const data = {
      form: {
        should_second_escalate: 1,
        second_escalate_content: this.secondEscalateForm.get(
          'second_escalate_content'
        )?.value,
      },
    };
    this.refreshTasks(this.taskId, data);
  }
  /** Actions with Send to Close  Casse status  **/

  sendToClose(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('close-Modal');
  }

  confirmClose() {
    const data = { form: this.closeForm.value };
    this.closeForm.reset();
    this.infoForm.reset();

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
    this.refreshTasks(this.taskId, data);
  }

  subscribeToLanguage() {
    this.langSub = this.languageManagerService
      .getSavedLanguageAsStream()
      .subscribe((res) => {
        const outputTitle =
          this.languageManagerService.getSavedLanguage() === 'ar'
            ? `تفاصيل حالة رقم : ${this.caseSerial} `
            : `D2D Case ( ID: ${this.caseSerial} ) Details`;
        this.bannerDataService.updateData({
          title: outputTitle,
          text: '',
        });
      });
  }

  checkAssigne(item: any) {
    if (item?.isAssigneeTeam) {
      if (item?.assignedUser === this.authService.getLoggedInUser().teamName) {
        return true;
      }
    } else {
      if (item?.assignedUser === this.authService.getLoggedInUser().email) {
        return true;
      }
    }
    return false;
  }

  // handleTeam(milestoneDetails?: Case, team?: any) {
  //   if (milestoneDetails && team) {
  //     this.selectedTeam = team.filter(
  //       (t: any) => t.name === this.milestoneDetails?.creatorTeamName
  //     )[0];
  //   }
  // }

  // handleUser(milestoneDetails?: Case, users?: any) {
  //   if (milestoneDetails && users) {
  //     this.selectedUser = users.filter(
  //       (u: any) => u.email === this.milestoneDetails?.creatorEmail
  //     )[0];
  //   }
  // }

  getUserPrivilege(user: User) {
    let x = '';
    _.forEach(user.userGroups, (group: any) => {
      if (group.roles[0].system.name === 'FRAUD_ManagementUsers') {
        x = group.roles[0].roleName;
      }
    });
    return x;
  }
  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }
}
