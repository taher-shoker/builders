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

  showApproveBtn: WritableSignal<boolean> = signal(false);
  showRejectBtn: WritableSignal<boolean> = signal(false);

  requestParams: WritableSignal<
    | {
        requestParams: {
          name: string;
          value: string | number | boolean;
        }[];
      }
    | undefined
  > = signal(undefined);

  workflowId: WritableSignal<number | undefined> = signal(undefined)
  requestTaskId: WritableSignal<number | undefined> = signal(undefined)

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
    });
  }

  private getVpReportState() {
    this.milestonesService
      .getReportData(this.selectedTeam(), 2024) // Check if year should be sent!
      .subscribe((res: ReportData) => {
        console.log('State res:', res);
        this.workflowId.set(res.workflowId)
        if(res.isApproved === null || res.isApproved === true){
          this.handleUiState('edit-pending', res); // DT User should Edit
        }else{
          this.handleUiState('approval-pending', res); // DT Director should approve/reject
          this.getWorkflow();
        }
      });
  }

  private populateForm(formData: ReportData) {
    this.form.get('actual')?.setValue(formData.actual);
    this.form.get('baseline')?.setValue(formData.baseline);
    this.form.get('targetEoy')?.setValue(formData.targetEoy);
    this.form.get('target')?.setValue(formData.target);
    this.form.get('highlight')?.setValue(formData.highlight);
    this.form.get('valueImpact')?.setValue(formData.valueImpact);
    this.reviewMode.set(true);
  }

  private getWorkflow() {
    if(this.workflowId()){
      this.milestonesService.getVPReportWorkflow(this.workflowId()!).subscribe((res) => {
        console.log('Res', res);
        
        this.requestTaskId.set(
          res?.requestTaskId
        )
        if (res && res.params.length > 0) {
          if(res.taskName === 'Edit Report Data'){
            // this.setParamsForEditing()
          }else if(res.taskName === 'Approve Report Data'){
            // this.setParamsForApproval()
          }
        }
      });
    }

  }

  private setParamsForEditing(){
    const {actual, baseline, targetEoy, target, highlight, valueImpact} = this.form.value
    this.requestParams.set(
      {
        requestParams: [
          {
            name: "actual",
            value: actual,
          },
          {
            name: "baseline",
            value: baseline,
          },
          {
            name: "target_eoy",
            value: targetEoy,
          },
          {
            name: "target",
            value: target,
          },
          {
            name: "highlight",
            value: highlight,
          },
          {
            name: "value_impact",
            value: valueImpact,
          },
        ]
      }
    )
  }

  // private setParamsForApproval(isApproved: boolean){

  // }

  private handleUiState(
    state: 'edit-pending' | 'approval-pending',
    formData: ReportData
  ) {
    if (state === 'edit-pending') {
      this.showSubmitBtn.set(true);
      this.showApproveBtn.set(false);
      this.showRejectBtn.set(false);
      this.populateForm(formData); // if not approved, means we need to populate the inputs as the the workflow needs a director approval
    } else {
      this.populateForm(formData); // if not approved, means we need to populate the inputs as the the workflow needs a director approval
      this.form.disable();
      this.showSubmitBtn.set(false);
      this.showApproveBtn.set(true);
      this.showRejectBtn.set(true);
    }
  }

  private getAllTeams() {
    if (this.milestonesService.checkIsDirector()) {
      this.milestonesService.setSystemTeams().subscribe((res) => {
        this.allTeams = res;
        this.watchRoute();
        this.selectedTeam.set(this.allTeams[0].name);
        this.getVpReportState();
      });
    } else {
      this.allTeams = this.milestonesService.setUserTeams();
      this.watchRoute();
      this.selectedTeam.set(this.allTeams[0].name);
      this.getVpReportState();
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

      // this.getDATA(); get backend data again after route changes
    });
  }

  protected selectTeam(value: string) {
    if (this.selectedTeam() !== value) {
      this.selectedTeam.set(value);
      this.updateRoute(value);
    }
  }

  protected navBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  protected submitForm() {
    console.log('the form value:', this.form.value);

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
      });
  }

  protected approveFlow(isApproved: boolean){
    this.requestParams.set(
      {
        requestParams: [
          {
            name: "is_report_data_approved",
            value: isApproved,
          },
          
        ]
      }
    )

    const workflowId = this.workflowId();
    const requestTaskId = this.requestTaskId();
    const requestParams = this.requestParams();

    if(workflowId && requestTaskId && requestParams){
      this.milestonesService.completePendingTask(workflowId, requestTaskId, requestParams).subscribe(res => {
        console.log("res of approving", res)
      })

    }
  }
}
