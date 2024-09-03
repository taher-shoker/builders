/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HighlightImpactReport,
  MilestonesService,
} from '../../milestones-setting/milestones.service';
import { quillContentValidator } from '../../../services/validators/quill-empty-validator';
import { ReportData } from '../../../services/models/milestones.models';

@Component({
  selector: 'stc-apps-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  allTeams: any[] = [];
  selectedTeam: WritableSignal<string> = signal('');
  selectedYear: WritableSignal<number> = signal(0);
  form!: FormGroup;

  reviewMode: WritableSignal<boolean> = signal(false);
  showSubmitBtn: WritableSignal<boolean> = signal(false);
  showResubmitBtn: WritableSignal<boolean> = signal(false);

  showPMOApprovalBtn: WritableSignal<boolean> = signal(false);
  showPMORejectBtn: WritableSignal<boolean> = signal(false);

  showDirectorApproveBtn: WritableSignal<boolean> = signal(false);
  showDirectorRejectBtn: WritableSignal<boolean> = signal(false);
  showStatus: WritableSignal<boolean> = signal(false);

  status: WritableSignal<string> = signal('');
  commentText: WritableSignal<string> = signal('');
  commentCheckbox: WritableSignal<boolean> = signal(false);
  directorOrPMOCanComment: WritableSignal<boolean> = signal(false);

  lastCommentReceivedFromPMO: WritableSignal<string> = signal('');
  lastCommentReceivedFromDirector: WritableSignal<string> = signal('');

  showSpinner: WritableSignal<boolean> = signal(false);
  requestParams: WritableSignal<
    | {
        requestParams: {
          name: string;
          value: string | number | boolean;
        }[];
      }
    | undefined
  > = signal(undefined);

  workflowId: WritableSignal<number | undefined> = signal(undefined);
  requestTaskId: WritableSignal<number | undefined> = signal(undefined);

  showQuill: WritableSignal<boolean> = signal(true);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private milestonesService: MilestonesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllTeams();
  }

  private initForm() {
    const numberPattern = /^-?\d*(\.\d+)?$/;

    this.form = new FormGroup({
      dataForm: new FormGroup({
        actual: new FormControl('', [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        baseline: new FormControl('', [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        targetEoy: new FormControl('', [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        target: new FormControl('', [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        highlight: new FormControl('', [
          Validators.required,
          quillContentValidator,
        ]),
        valueImpact: new FormControl('', [
          Validators.required,
          quillContentValidator,
        ]),
      }),
      commentForm: new FormGroup({
        comment: new FormControl(''),
        commentCheckbox: new FormControl(false),
      }),
    });

    this.form
      .get('commentForm')
      ?.get('commentCheckbox')
      ?.valueChanges.subscribe((isChecked: boolean) => {
        this.commentCheckbox.set(isChecked);
      });
  }

  get isDataFormInvalid(): boolean {
    const dataForm = this.form.get('dataForm');
    return dataForm ? dataForm.invalid : true;
  }

  private resetStatus() {
    this.showStatus.set(false);
    this.status.set('');
    this.lastCommentReceivedFromDirector.set('');
    this.lastCommentReceivedFromPMO.set('');
  }

  private getVpReportState() {
    this.resetStatus();

    this.milestonesService
      .getReportData(this.selectedTeam(), this.selectedYear())
      .subscribe((res: ReportData) => {
        this.workflowId.set(res.workflowId);

        this.populateForm(res);

        if (res.isApproved === null || res.isApproved === true) {
          // Is Approved true or null, means a flow is closed and a DT User with role "Editor" can submit again
          if (
            this.milestonesService.userInGroup('DT_User') &&
            this.milestonesService.userInGroup('DT_VP_Dashboard_Editor')
          ) {
            this.handleUiState('edit-pending'); // prepare the UI state for dt user to edit data.
          } else {
            this.handleUiState('none-pending'); // prepare the UI state to prevent any actions.
            this.showStatus.set(true);
            this.status.set('Waiting For Edit');
            this.directorOrPMOCanComment.set(false);
          }
        } else {
          this.handlePendingTask(); // Is approved false, means it doesn't belong to DT user edits, it needs a PMO or Director, and we need to hit another API to find out.
          this.handleCommentsOfAllTasks();
        }
      });
  }

  private handlePendingTask() {
    this.milestonesService
      .getPendingVPReportWorkflowItem(this.workflowId()!)
      .subscribe((workflowRes) => {
        this.requestTaskId.set(workflowRes?.requestTaskId);

        if (workflowRes?.taskName === 'Edit Report Data') {
          if (
            this.milestonesService.userInGroup('DT_User') &&
            this.milestonesService.userInGroup('DT_VP_Dashboard_Editor')
          ) {
            this.handleUiState('resubmission-pending');
          } else {
            this.handleUiState('none-pending');
            this.showStatus.set(true);
            this.status.set('Waiting For Resubmission');
          }
        } else if (workflowRes?.taskName === 'Approve Report Data PMO') {
          if (
            this.milestonesService.userInGroup('DT_User') &&
            this.milestonesService.userInGroup('PMO')
          ) {
            this.directorOrPMOCanComment.set(true);
            this.handleUiState('pmo-approval-pending');
          } else {
            this.handleUiState('none-pending');
            this.showStatus.set(true);
            this.status.set('Waiting For PMO approval');
          }
        } else {
          if (this.milestonesService.checkIsDirector()) {
            this.handleUiState('director-approval-pending'); // DT Director should approve/reject
            this.directorOrPMOCanComment.set(true);
          } else {
            this.handleUiState('none-pending');
            this.showStatus.set(true);
            this.status.set('Waiting For Director Approval');
          }
        }
      });
  }

  private handleCommentsOfAllTasks() {
    const PMOsComments: string[] = [];
    const directorsComments: string[] = [];

    this.milestonesService
      .getVPReportWorkflow(this.workflowId()!)
      .subscribe((workflowRes) => {
        for (const item of workflowRes) {
          for (const taskAttr of item.requestTaskAttributes) {
            if (
              taskAttr.name === 'reason_of_rejection' &&
              item.taskName === 'Approve Report Data PMO'
            ) {
              // comments of PMO
              PMOsComments.push(taskAttr.value);
            }

            if (
              taskAttr.name === 'reason_of_rejection' &&
              item.taskName === 'Approve Report Data Director'
            ) {
              // comments of Director
              directorsComments.push(taskAttr.value);
            }
          }
        }

        this.lastCommentReceivedFromDirector.set(
          directorsComments[directorsComments.length - 1]
        );
        this.lastCommentReceivedFromPMO.set(
          PMOsComments[PMOsComments.length - 1]
        );
      });
  }

  private populateForm(formData: ReportData) {
    this.form.get('dataForm')?.get('actual')?.setValue(formData.actual);
    this.form.get('dataForm')?.get('baseline')?.setValue(formData.baseline);
    this.form.get('dataForm')?.get('targetEoy')?.setValue(formData.targetEoy);
    this.form.get('dataForm')?.get('target')?.setValue(formData.target);
    this.form.get('dataForm')?.get('highlight')?.setValue(formData.highlight);
    this.form
      .get('dataForm')
      ?.get('valueImpact')
      ?.setValue(formData.valueImpact);

    this.destroyQuillEditor();
    this.reviewMode.set(true);
    this.buildQuillEditor();
  }

  destroyQuillEditor() {
    this.showQuill.set(false);
  }

  buildQuillEditor() {
    this.showQuill.set(true);
  }

  private handleUiState(
    state:
      | 'edit-pending'
      | 'director-approval-pending'
      | 'resubmission-pending'
      | 'pmo-approval-pending'
      | 'none-pending'
      | 'loading'
  ) {
    this.showSpinner.set(false);

    if (state === 'edit-pending') {
      this.showSubmitBtn.set(true);
      this.showPMOApprovalBtn.set(false);
      this.showPMORejectBtn.set(false);
      this.showDirectorApproveBtn.set(false);
      this.showDirectorRejectBtn.set(false);
      this.showResubmitBtn.set(false);
      this.form.get('dataForm')?.enable();
    } else if (state === 'resubmission-pending') {
      this.showPMOApprovalBtn.set(false);
      this.showPMORejectBtn.set(false);
      this.showSubmitBtn.set(false);
      this.showDirectorApproveBtn.set(false);
      this.showDirectorRejectBtn.set(false);
      this.showResubmitBtn.set(true);
      this.form.get('dataForm')?.enable();
    } else if (state === 'none-pending') {
      this.showPMOApprovalBtn.set(false);
      this.showPMORejectBtn.set(false);
      this.showSubmitBtn.set(false);
      this.showDirectorApproveBtn.set(false);
      this.showDirectorRejectBtn.set(false);
      this.showResubmitBtn.set(false);
      this.form.get('dataForm')?.disable();
    } else if (state === 'director-approval-pending') {
      this.form.get('dataForm')?.disable();
      this.showPMOApprovalBtn.set(false);
      this.showPMORejectBtn.set(false);
      this.showSubmitBtn.set(false);
      this.showDirectorApproveBtn.set(true);
      this.showDirectorRejectBtn.set(true);
      this.showResubmitBtn.set(false);
    } else if (state === 'pmo-approval-pending') {
      this.form.get('dataForm')?.disable();
      this.showPMOApprovalBtn.set(true);
      this.showPMORejectBtn.set(true);
      this.showSubmitBtn.set(false);
      this.showDirectorApproveBtn.set(false);
      this.showDirectorRejectBtn.set(false);
      this.showResubmitBtn.set(false);
    } else if (state === 'loading') {
      this.showPMOApprovalBtn.set(false);
      this.showPMORejectBtn.set(false);
      this.showSubmitBtn.set(false);
      this.showDirectorApproveBtn.set(false);
      this.showDirectorRejectBtn.set(false);
      this.showResubmitBtn.set(false);
      this.showSpinner.set(true);
      this.directorOrPMOCanComment.set(false);
      this.form.get('dataForm')?.disable();
    }
  }

  private getAllTeams() {
    this.allTeams = this.milestonesService.setUserTeams();
    this.watchRoute();
  }

  private updateRoute(team: string, year: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { team, year },
      queryParamsHandling: 'merge', // Merge with existing query parameters,
      replaceUrl: true,
    });
  }

  private watchRoute() {
    this.route.queryParams.subscribe((params) => {
      this.selectedTeam.set(params['team']);
      this.selectedYear.set(params['year']);

      const currentYear = new Date().getFullYear();

      if (!params['year']) {
        this.selectedYear.set(currentYear);
        this.updateRoute(this.allTeams[0].name, currentYear);
      }

      if (!params['team']) {
        this.selectedTeam.set(this.allTeams[0].name);
        this.updateRoute(this.allTeams[0].name, currentYear);
      }
      this.getVpReportState();
    });
  }

  protected selectTeam(value: string) {
    if (this.selectedTeam() !== value) {
      this.selectedTeam.set(value);
      this.updateRoute(value, this.selectedYear());
    }
  }

  protected navBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  protected submitForm() {
    this.handleUiState('loading');

    const { actual, baseline, targetEoy, target, highlight, valueImpact } =
      this.form.get('dataForm')!.value;
    const editingData: HighlightImpactReport = {
      actual,
      baseline,
      targetEoy,
      target,
      highlight,
      valueImpact,
      team: this.selectedTeam(),
      year: this.selectedYear(),
    };

    this.milestonesService.postHighlightOrImpact(editingData).subscribe(() => {
      this.getVpReportState();
    });
  }

  protected resubmitForm() {
    this.handleUiState('loading');

    const { actual, baseline, targetEoy, target, highlight, valueImpact } =
      this.form.get('dataForm')!.value;
    this.requestParams.set({
      requestParams: [
        {
          name: 'actual',
          value: actual.toString(),
        },
        {
          name: 'baseline',
          value: baseline.toString(),
        },
        {
          name: 'target_eoy',
          value: targetEoy.toString(),
        },
        {
          name: 'target',
          value: target.toString(),
        },
        {
          name: 'highlight',
          value: highlight,
        },
        {
          name: 'value_impact',
          value: valueImpact,
        },
      ],
    });

    const workflowId = this.workflowId();
    const requestTaskId = this.requestTaskId();
    const requestParams = this.requestParams();

    if (workflowId && requestTaskId && requestParams) {
      this.milestonesService
        .completePendingTask(workflowId, requestTaskId, requestParams)
        .subscribe((res) => {
          this.getVpReportState();
        });
    }
  }

  protected approveDirectorFlow(isApproved: boolean) {
    this.handleUiState('loading');

    if (!isApproved && this.commentCheckbox() === true) {
      this.requestParams.set({
        requestParams: [
          {
            name: 'is_report_data_approved',
            value: isApproved,
          },
          {
            name: 'reason_of_rejection',
            value: this.form.get('commentForm')?.get('comment')?.value,
          },
        ],
      });
    } else {
      this.requestParams.set({
        requestParams: [
          {
            name: 'is_report_data_approved',
            value: isApproved,
          },
        ],
      });
    }

    const workflowId = this.workflowId();
    const requestTaskId = this.requestTaskId();
    const requestParams = this.requestParams();

    if (workflowId && requestTaskId && requestParams) {
      this.milestonesService
        .completePendingTask(workflowId, requestTaskId, requestParams)
        .subscribe((res) => {
          console.log('res of approving', res);

          this.getVpReportState();
        });
    }
  }

  protected approvePMO(isApproved: boolean) {
    this.handleUiState('loading');

    if (!isApproved && this.commentCheckbox() === true) {
      this.requestParams.set({
        requestParams: [
          {
            name: 'is_report_data_approved',
            value: isApproved,
          },
          {
            name: 'reason_of_rejection',
            value: this.form.get('commentForm')?.get('comment')?.value,
          },
        ],
      });
    } else {
      this.requestParams.set({
        requestParams: [
          {
            name: 'is_report_data_approved',
            value: isApproved,
          },
        ],
      });
    }

    const workflowId = this.workflowId();
    const requestTaskId = this.requestTaskId();
    const requestParams = this.requestParams();

    if (workflowId && requestTaskId && requestParams) {
      this.milestonesService
        .completePendingTask(workflowId, requestTaskId, requestParams)
        .subscribe((res) => {
          console.log('res of approving', res);

          this.getVpReportState();
        });
    }
  }
}
