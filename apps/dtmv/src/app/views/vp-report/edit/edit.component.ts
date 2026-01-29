/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ReportData } from '../../../services/models/milestones.models';
import {
  HighlightImpactReport,
  MilestonesService,
} from '../../milestones-setting/milestones.service';

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

  levels = [
    { name: 'Pulse Check Report', id: 'Pulse_Check_Report' },
    { name: 'PR Meeting', id: 'PR_Meeting' },
    { name: 'DT GCEO Workshop', id: 'DT_GCEO_Workshop' },
    { name: 'Deep Dive', id: 'Deep_Dive' },
    { name: 'Strategic Dialogue', id: 'Strategic_Dialogue' },
    { name: 'ERP Committee', id: 'ERP_Committee' },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private milestonesService: MilestonesService,
    private cookieService: CookieService
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
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        baseline: new FormControl('', [
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        targetEoy: new FormControl('', [
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        target: new FormControl('', [
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        highlight: new FormControl(''),
        valueImpact: new FormControl(''),
        stcDiScore: new FormControl(0.0, [
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        diScore: new FormControl(0.0, [
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        charterStatus: new FormControl(0.0, [
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        achievements: new FormControl('', Validators.maxLength(1000)),
        charterProgress: new FormControl('', Validators.maxLength(1000)),
        supportNeeded: new FormControl('', Validators.maxLength(1000)),
        digitalTransformationReflectionLevel: new FormControl(null),
        clarityProgramProgress: new FormControl(0.0, [
          Validators.max(100),
          Validators.min(0),
          Validators.pattern(numberPattern),
        ]),
        status: new FormControl('', Validators.maxLength(1000)),
        clarityStrategicProgramReflectionLevel: new FormControl(null),
        erpStatus: new FormControl('', Validators.maxLength(1000)),
        erpStatusReflectionLevel: new FormControl(null),
        dataEnablementStatus: new FormControl('', Validators.maxLength(1000)),
        dataEnablementStatusReflectionLevel: new FormControl(null),
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
          if (this.milestonesService.userInGroup('VP_EDITOR')) {
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
            this.milestonesService.userInGroup('VP_EDITOR')
          ) {
            this.handleUiState('resubmission-pending');
          } else {
            this.handleUiState('none-pending');
            this.showStatus.set(true);
            this.status.set('Waiting For Resubmission');
          }
        } else if (workflowRes?.taskName === 'Approve Report Data Governance') {
          if (this.milestonesService.userInGroup('DT_Governance_Approver')) {
            this.directorOrPMOCanComment.set(true);
            this.handleUiState('governance-approval-pending');
          } else {
            this.handleUiState('none-pending');
            this.showStatus.set(true);
            this.status.set('Waiting For Governance approval');
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
              item.taskName === 'Approve Report Data Governance'
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
    this.form.get('dataForm')?.get('stcDiScore')?.setValue(formData.stcDiScore);
    this.form.get('dataForm')?.get('diScore')?.setValue(formData.diScore);
    this.form
      .get('dataForm')
      ?.get('charterStatus')
      ?.setValue(formData.charterStatus);
    this.form
      .get('dataForm')
      ?.get('clarityProgramProgress')
      ?.setValue(formData.clarityProgramProgress);
    this.form
      .get('dataForm')
      ?.get('achievements')
      ?.setValue(formData.achievements);
    this.form
      .get('dataForm')
      ?.get('charterProgress')
      ?.setValue(formData.charterProgress);
    this.form
      .get('dataForm')
      ?.get('supportNeeded')
      ?.setValue(formData.supportNeeded);
    this.form
      .get('dataForm')
      ?.get('digitalTransformationReflectionLevel')
      ?.setValue(formData.digitalTransformationReflectionLevel);
    this.form.get('dataForm')?.get('status')?.setValue(formData.status);
    this.form
      .get('dataForm')
      ?.get('clarityStrategicProgramReflectionLevel')
      ?.setValue(formData.clarityStrategicProgramReflectionLevel);
    this.form.get('dataForm')?.get('erpStatus')?.setValue(formData.erpStatus);
    this.form
      .get('dataForm')
      ?.get('dataEnablementStatus')
      ?.setValue(formData.dataEnablementStatus);
    this.form
      .get('dataForm')
      ?.get('erpStatusReflectionLevel')
      ?.setValue(formData.erpStatusReflectionLevel);
    this.form
      .get('dataForm')
      ?.get('dataEnablementStatusReflectionLevel')
      ?.setValue(formData.dataEnablementStatusReflectionLevel);
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
      | 'governance-approval-pending'
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
    } else if (state === 'governance-approval-pending') {
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
    this.milestonesService.setUserTeams().subscribe((res) => {
      this.allTeams = res;
    });
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
    window.scrollTo(0, 0);
  }

  protected submitForm() {
    if (!this.form.valid) {
      this.markFormAsTouched();
      return;
    }
    this.handleUiState('loading');
    const {
      actual,
      baseline,
      targetEoy,
      target,
      highlight,
      valueImpact,
      stcDiScore,
      diScore,
      charterStatus,
      achievements,
      charterProgress,
      supportNeeded,
      digitalTransformationReflectionLevel,
      clarityProgramProgress,
      status,
      clarityStrategicProgramReflectionLevel,
      erpStatus,
      dataEnablementStatus,
      erpStatusReflectionLevel,
      dataEnablementStatusReflectionLevel,
    } = this.form.get('dataForm')!.value;
    const editingData: HighlightImpactReport = {
      actual: actual || 0,
      baseline: baseline || 0,
      target: target || 0,
      targetEoy: targetEoy || 0,
      valueImpact,
      highlight,
      stcDiScore: stcDiScore || 0.0,
      diScore: diScore || 0.0,
      charterStatus: charterStatus || 0.0,
      achievements: achievements || '',
      charterProgress: charterProgress || '',
      supportNeeded: supportNeeded || '',
      digitalTransformationReflectionLevel:
        digitalTransformationReflectionLevel || null,
      clarityProgramProgress: clarityProgramProgress || 0.0,
      status: status || '',
      clarityStrategicProgramReflectionLevel:
        clarityStrategicProgramReflectionLevel || null,
      erpStatus: erpStatus || '',
      dataEnablementStatus: dataEnablementStatus || '',
      erpStatusReflectionLevel: erpStatusReflectionLevel || null,
      dataEnablementStatusReflectionLevel:
        dataEnablementStatusReflectionLevel || null,
      team: this.selectedTeam(),
      year: this.selectedYear(),
    };
    this.milestonesService.postHighlightOrImpact(editingData).subscribe({
      next: () => this.getVpReportState(),
    });
  }
  markFormAsTouched() {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  protected resubmitForm() {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');

    this.handleUiState('loading');
    const {
      actual,
      baseline,
      targetEoy,
      target,
      highlight,
      valueImpact,
      stcDiScore,
      diScore,
      charterStatus,
      achievements,
      charterProgress,
      supportNeeded,
      digitalTransformationReflectionLevel,
      clarityProgramProgress,
      status,
      clarityStrategicProgramReflectionLevel,
      erpStatus,
      dataEnablementStatus,
      erpStatusReflectionLevel,
      dataEnablementStatusReflectionLevel,
    } = this.form.get('dataForm')!.value;
    const params = [
      {
        name: 'edit_by',
        value: user.email.toString(),
      },
      {
        name: 'actual',
        value: actual ? actual.toString() : '0',
      },
      {
        name: 'baseline',
        value: baseline ? baseline.toString() : '0',
      },
      {
        name: 'target_eoy',
        value: targetEoy ? targetEoy.toString() : '0',
      },
      {
        name: 'target',
        value: target ? target.toString() : '0',
      },
      {
        name: 'highlight',
        value: highlight,
      },
      {
        name: 'value_impact',
        value: valueImpact,
      },
      {
        name: 'stc_di_score',
        value: stcDiScore ? stcDiScore.toString() : '0',
      },
      {
        name: 'di_score',
        value: diScore ? diScore.toString() : '0',
      },
      {
        name: 'charter_status',
        value: charterStatus ? charterStatus.toString() : '0',
      },
      {
        name: 'achievements',
        value: achievements,
      },
      {
        name: 'charter_progress',
        value: charterProgress,
      },
      {
        name: 'support_needed',
        value: supportNeeded,
      },
      {
        name: 'digital_transformation_reflection_level',
        value: digitalTransformationReflectionLevel
          ? digitalTransformationReflectionLevel?.join(',')
          : null,
      },
      {
        name: 'clarity_program_progress',
        value: clarityProgramProgress ? clarityProgramProgress.toString() : '0',
      },
      {
        name: 'status',
        value: status,
      },
      {
        name: 'clarity_strategic_program_reflection_level',
        value: clarityStrategicProgramReflectionLevel
          ? clarityStrategicProgramReflectionLevel?.join(',')
          : null,
      },
      {
        name: 'erp_status',
        value: erpStatus,
      },
      {
        name: 'data_enablement_status',
        value: dataEnablementStatus,
      },
      {
        name: 'erp_status_reflection_level',
        value: erpStatusReflectionLevel
          ? erpStatusReflectionLevel?.join(',')
          : null,
      },
      {
        name: 'data_enablement_status_reflection_level',
        value: dataEnablementStatusReflectionLevel
          ? dataEnablementStatusReflectionLevel?.join(',')
          : null,
      },
    ].filter((param: { name: string; value: string }) => param.value !== null);
    this.requestParams.set({
      requestParams: params,
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
          this.getVpReportState();
        });
    }
  }
}
