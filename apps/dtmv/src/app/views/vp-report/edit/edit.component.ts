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
  form!: FormGroup;

  reviewMode: WritableSignal<boolean> = signal(false);
  showSubmitBtn: WritableSignal<boolean> = signal(false);
  showResubmitBtn: WritableSignal<boolean> = signal(false);

  showApproveBtn: WritableSignal<boolean> = signal(false);
  showRejectBtn: WritableSignal<boolean> = signal(false);
  showStatus: WritableSignal<boolean> = signal(false);

  status: WritableSignal<string> = signal('');
  commentText: WritableSignal<string> = signal('');
  commentCheckbox: WritableSignal<boolean> = signal(false);
  directorCanComment: WritableSignal<boolean> = signal(false);

  lastCommentReceived: WritableSignal<string> = signal('');
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
          Validators.pattern(numberPattern),
        ]),
        baseline: new FormControl('', [
          Validators.required,
          Validators.max(100),
          Validators.pattern(numberPattern),
        ]),
        targetEoy: new FormControl('', [
          Validators.required,
          Validators.max(100),
          Validators.pattern(numberPattern),
        ]),
        target: new FormControl('', [
          Validators.required,
          Validators.max(100),
          Validators.pattern(numberPattern),
        ]),
        highlight: new FormControl('', [
          Validators.required,
          Validators.max(100),
          quillContentValidator,
        ]),
        valueImpact: new FormControl('', [
          Validators.required,
          Validators.max(100),
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
    this.lastCommentReceived.set('');
  }

  private getVpReportState() {
    this.resetStatus();

    this.milestonesService
      .getReportData(
        this.selectedTeam(),
        Number(new Date().getFullYear().toString())
      ) // Check if year should be sent!
      .subscribe((res: ReportData) => {
        console.log('State res:', res);
        this.workflowId.set(res.workflowId);

        if (res.isApproved === null || res.isApproved === true) {
          if (!this.milestonesService.checkIsDirector()) {
            this.handleUiState('edit-pending', res); // DT User should Edit
          } else {
            this.handleUiState('none-pending', res); // DT User should Edit
            this.showStatus.set(true);
            this.status.set('Waiting For Edit');
            this.directorCanComment.set(false);
          }
        } else {
          this.handlePendingTask(res);
          this.handleCommentsOfAllTasks();
        }
      });
  }

  private handlePendingTask(res: ReportData) {
    this.milestonesService
      .getPendingVPReportWorkflowItem(this.workflowId()!)
      .subscribe((workflowRes) => {
        this.requestTaskId.set(workflowRes?.requestTaskId);

        if (workflowRes?.taskName === 'Edit Report Data') {
          if (!this.milestonesService.checkIsDirector()) {
            this.handleUiState('resubmission-pending', res);
          } else {
            this.handleUiState('none-pending', res);
            this.showStatus.set(true);
            this.status.set('Waiting For Resubmission');
          }
        } else {
          if (this.milestonesService.checkIsDirector()) {
            this.handleUiState('approval-pending', res); // DT Director should approve/reject
            this.directorCanComment.set(true);
          } else {
            this.handleUiState('none-pending', res);
            this.showStatus.set(true);
            this.status.set('Waiting For Approval');
          }
        }
      });
  }

  private handleCommentsOfAllTasks() {
    const comments: string[] = [];

    this.milestonesService
      .getVPReportWorkflow(this.workflowId()!)
      .subscribe((workflowRes) => {
        for (const item of workflowRes) {
          for (const taskAttr of item.requestTaskAttributes) {
            if (taskAttr.name === 'reason_of_rejection') {
              comments.push(taskAttr.value);
            }
          }
        }

        this.lastCommentReceived.set(comments[comments.length - 1]);
        console.log('All comms', comments);
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
      | 'approval-pending'
      | 'resubmission-pending'
      | 'none-pending'
      | 'loading',
    formData?: ReportData
  ) {
    if (formData) {
      this.populateForm(formData); // if not approved, means we need to populate the inputs as the the workflow needs a director approval
    }
    this.showSpinner.set(false);

    if (state === 'edit-pending') {
      this.showSubmitBtn.set(true);
      this.showApproveBtn.set(false);
      this.showRejectBtn.set(false);
      this.showResubmitBtn.set(false);
    } else if (state === 'resubmission-pending') {
      this.showSubmitBtn.set(false);
      this.showApproveBtn.set(false);
      this.showRejectBtn.set(false);
      this.showResubmitBtn.set(true);
    } else if (state === 'none-pending') {
      this.showSubmitBtn.set(false);
      this.showApproveBtn.set(false);
      this.showRejectBtn.set(false);
      this.showResubmitBtn.set(false);
      this.form.get('dataForm')?.disable();
    } else if (state === 'approval-pending') {
      this.form.get('dataForm')?.disable();
      this.showSubmitBtn.set(false);
      this.showApproveBtn.set(true);
      this.showRejectBtn.set(true);
      this.showResubmitBtn.set(false);
    } else if (state === 'loading') {
      this.showSubmitBtn.set(false);
      this.showApproveBtn.set(false);
      this.showRejectBtn.set(false);
      this.showResubmitBtn.set(false);
      this.showSpinner.set(true);
    }
  }

  private getAllTeams() {
    if (this.milestonesService.checkIsDirector()) {
      this.milestonesService.setSystemTeams().subscribe((res) => {
        this.allTeams = res;
        this.watchRoute();
      });
    } else {
      this.allTeams = this.milestonesService.setUserTeams();
      this.watchRoute();
    }
  }

  private updateRoute(team: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { team },
      queryParamsHandling: 'merge', // Merge with existing query parameters,
      replaceUrl: true,
    });
  }

  private watchRoute() {
    this.route.queryParams.subscribe((params) => {
      this.selectedTeam.set(params['team']);

      if (!params['team']) {
        this.selectedTeam.set(this.allTeams[0].name);
        this.updateRoute(this.allTeams[0].name);
      }
      this.getVpReportState();
    });
  }

  protected selectTeam(value: string) {
    if (this.selectedTeam() !== value) {
      this.selectedTeam.set(value);
      this.updateRoute(value);
      this.getVpReportState();
    }
  }

  protected navBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  protected submitForm() {
    console.log('the form value:', this.form.value);
    this.handleUiState('loading');

    const { actual, baseline, targetEoy, target, highlight, valueImpact } =
      this.form.value;
    const editingData: HighlightImpactReport = {
      actual,
      baseline,
      targetEoy,
      target,
      highlight,
      valueImpact,
      team: this.selectedTeam(),
      year: 2024,
    };

    this.milestonesService
      .postHighlightOrImpact(editingData)
      .subscribe((res) => {
        console.log('THE RES OF POSTING', res);
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

    console.log('workflowId', workflowId);
    console.log('requestTaskId', requestTaskId);
    console.log('requestParams', requestParams);

    if (workflowId && requestTaskId && requestParams) {
      this.milestonesService
        .completePendingTask(workflowId, requestTaskId, requestParams)
        .subscribe((res) => {
          console.log('res of editing back again for approval', res);
          this.getVpReportState();
        });
    }
  }

  protected approveFlow(isApproved: boolean) {
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

  protected alterCommentArea(val: boolean) {
    console.log('Val:', val);
  }
}
