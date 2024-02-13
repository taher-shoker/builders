import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { Router } from '@angular/router';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { CasesService, File } from '../../casses.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
export class MilestoneFormComponent implements OnInit {
  form!: FormGroup;
  @Input() readOnly!: boolean;
  @Input() isSubmited!: boolean;
  @Input() casseId!: string;
  @Output() caseStatus = new EventEmitter<string>();

  startDate!: Date | null;
  endDate!: Date | null;

  constructor(
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    public casesService: CasesService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.MilestoneForm();
    this.casesService.checkIsDirector();
    this.casesService.setUserTeam();
    this.setRelatedTeam();
  }

  MilestoneForm() {
    this.form = this.formBuilder.group({
      milestoneName: ['', [Validators.required, Validators.maxLength(150)]],
      activityName: ['', [Validators.required, Validators.maxLength(150)]],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required]],
      weight: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      teamName: [
        '',
        this.casesService.isDTDirector
          ? Validators.nullValidator
          : Validators.required,
      ],
      deliverable: ['', Validators.maxLength(300)],
    });
  }

  setRelatedTeam() {
    this.form.get('teamName')?.setValue(this.casesService.setUserTeam());
    this.form.get('teamName')?.disable();
  }

  FilterDate = (d: Date | null): boolean => {
    if (d === null) return false;
    if (this.startDate) {
      const nextDays = new Date(this.startDate);
      return d >= nextDays;
    } else if (this.endDate) {
      const previousDays = new Date(this.endDate);
      return d <= previousDays;
    }
    return true;
  };
  handelChangeDate(event: MatDatepickerInputEvent<Date>, type: string) {
    this.startDate = null;
    this.endDate = null;

    if (type === 'start') {
      this.startDate = event.value;
      this.form.get('endDate')?.reset();
    } else {
      this.endDate = event.value;
    }
  }
  onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      const finalData = {
        ...this.form.value,
        teamName: this.casesService.setUserTeam(),
        weight: +this.form.get('weight')?.value,
      };
      this.casesService.createMilestone(finalData).subscribe((res) => {
        if (res) {
          this.toastr.success('Milesotne has been created successfully');
          this.form.reset();
          this.router.navigate(['./home']);
        }
      });
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  cancel() {
    this.router.navigate(['../']);
  }
}
