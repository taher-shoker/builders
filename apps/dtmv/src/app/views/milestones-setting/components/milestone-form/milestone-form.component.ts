import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { MilestonesService } from '../../milestones.service';

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'stc-apps-milestone-form',
  templateUrl: './milestone-form.component.html',
  styleUrls: ['./milestone-form.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class MilestoneFormComponent implements OnInit, OnChanges {
  @Input() isEditing!: boolean;
  @Input() data!: any;

  @Input() readOnly!: boolean;
  @Input() isSubmited!: boolean;
  @Input() casseId!: string;
  @Output() caseStatus = new EventEmitter<string>();

  form!: FormGroup;
  startDate!: Date | null;
  endDate!: Date | null;
  allTeams: any;
  selectTeam!: any;
  constructor(
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    public milestonesService: MilestonesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;
      if (this.data) {
        this.restFormWithValue(this.data);
      }
    }
  }

  ngOnInit(): void {
    this.MilestoneForm();
    this.milestonesService.checkIsAdmin();
    this.setRelatedTeam();
  }

  MilestoneForm() {
    this.form = this.formBuilder.group({
      milestoneName: ['', [Validators.required, Validators.maxLength(100)]],
      activityName: ['', [Validators.required, Validators.maxLength(150)]],
      workStream: ['', [Validators.required, Validators.maxLength(150)]],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required]],
      weight: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100),
          Validators.pattern(/^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/),
        ],
      ],
      teamName: [
        '',
        this.milestonesService.isDTDirector
          ? Validators.nullValidator
          : Validators.required,
      ],
      deliverable: ['', Validators.maxLength(300)],
      workStream: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  setRelatedTeam() {
    if (!this.milestonesService.isDTAdmin) {
      this.allTeams = this.milestonesService.setUserTeams();
    } else {
      this.getAllTeams();
    }
  }

  FilterStartDate = (d: Date | null): boolean => {
    if (d === null) return false;
    if (this.startDate) {
      const nextDays = new Date(this.startDate);
      return d >= nextDays;
    }
    return true;
  };
  FilterEndDate = (d: Date | null): boolean => {
    if (d === null) return false;
    if (this.startDate) {
      const previousDays = new Date(this.startDate);
      return d >= previousDays;
    }
    return true;
  };
  handelChangeDate(event: MatDatepickerInputEvent<Date>, type: string) {
    if (type === 'start') {
      this.startDate = null;
      this.endDate = null;
      this.startDate = event.value;
      this.form.get('endDate')?.reset();
    } else {
      this.endDate = event.value;
    }
  }

  restFormWithValue(data: any) {
    this.form?.get('milestoneName')?.setValue(data?.milestoneName);
    this.form?.get('activityName')?.setValue(data.activityName);
    this.form?.get('workStream')?.setValue(data.workStream);
    this.form?.get('teamName')?.setValue(data.teamName);
    this.form?.get('teamName')?.disable();
    this.form?.get('startDate')?.setValue(data.startDate);
    this.form?.get('endDate')?.setValue(data.endDate);
    this.form?.get('weight')?.setValue(data.weight);
    this.form?.get('deliverable')?.setValue(data.deliverable);
    this.form?.get('workStream')?.setValue(data.workStream);
  }
  onSubmit() {
    if (this.form.valid) {
      let finalData = {
        ...this.form.value,
        weight: +this.form.get('weight')?.value,
      };
      if (this.isEditing) {
        finalData = { ...finalData, teamName: this.data.teamName };
        this.milestonesService
          .updateMilestone(this.data.id, finalData)
          .subscribe((res) => {
            if (res) {
              this.toastr.success('Milestone has been edited successfully');
              this.form.reset();
              this.router.navigate(['./home']);
            }
          });
      } else {
        this.milestonesService.createMilestone(finalData).subscribe((res) => {
          if (res) {
            this.toastr.success('Milestone has been created successfully');
            this.form.reset();
            this.router.navigate(['./home']);
          }
        });
      }
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
  preventComma(event: KeyboardEvent) {
    if (event.key === ',') {
      event.preventDefault();
    }
  }
  getAllTeams() {
    this.milestonesService.setSystemTeams().subscribe((res) => {
      this.allTeams = res;
    });
  }

  cancel() {
    this.router.navigate(['../']);
  }
}
