import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { ConfigService } from '../../../../services/config.service';
import { Report } from '../../../../services/models/report-flow.model';
import { User } from '../../../../services/models/user';
import { MilestonesService } from '../../dy-reports.service';

@Component({
  selector: 'stc-apps-dy-report-form',
  templateUrl: './dy-report-form.component.html',
  styleUrls: ['./dy-report-form.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class DyReportFormComponent implements OnInit, OnChanges {
  @Input() isEditing!: boolean;
  @Input()
  reportData!: Report;
  @Input() readOnly!: boolean;

  @Output() caseStatus = new EventEmitter<string>();

  @ViewChild('fileUpload') fileUpload!: ElementRef;

  form!: FormGroup;
  users: User[] = [];
  approvers: User[] = [];
  files: File[] = [];
  formData = new FormData();
  isLoading = false;
  errorSize = false;
  errorType = false;
  disableSaveBtn = true;
  filteredOptions: Observable<User[]>[] = [];

  allTeams: any;
  selectTeam!: any;
  stepCounter = 1;
  selectedOptions: any = [];
  customRangeSLA: { name: number; id: number }[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    protected dialogService: DialogService,
    public milestonesService: MilestonesService,
    private toastr: ToastrService,
    private router: Router,
    public config_service: ConfigService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.reportData = changes['data'].currentValue;
      if (this.reportData) {
        this.restFormWithValue(this.reportData);
      }
    }
  }

  ngOnInit(): void {
    this.initReportForm();
    this.ManageUserNameControl(0);
    this.customSLAPopulator();
    this.getUsersListing();
  }

  initReportForm() {
    this.form = this._formBuilder.group({
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(150)]],
      requestCategoryId: ['', Validators.required],
      sla: [''],
      customSLA: [''],
      needMoreDataFromCreator: [false],
      creatorName: [''],
      attachments: [[]],
      requestApprovals: this._formBuilder.array([]),
    });
    this.addNewStep();
  }

  restFormWithValue(data: any) {
    console.log(data);
  }
  onSubmit() {
    // console.log(this.form.value);

    if (this.form.valid) {
      console.log(this.form.value);
      // let finalData = {
      //   ...this.form.value,
      //   weight: +this.form.get('weight')?.value,
      // };
      // if (this.isEditing) {
      //   finalData = { ...finalData, teamName: '4' };
      //   this.milestonesService
      //     .updateReportFlow('1', finalData)
      //     .subscribe((res) => {
      //       if (res) {
      //         this.toastr.success('Milestone has been edited successfully');
      //         this.form.reset();
      //         this.router.navigate(['./home']);
      //       }
      //     });
      // } else {
      //   this.milestonesService.createReportFlow(finalData).subscribe((res) => {
      //     if (res) {
      //       this.toastr.success('Milestone has been created successfully');
      //       this.form.reset();
      //       this.router.navigate(['./home']);
      //     }
      //   });
      // }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.form);
    }
  }
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
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

  getUsersListing() {
    this.milestonesService.getUsers().subscribe((res) => {
      this.users = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
      this.approvers = this.users;
    });
  }
  customSLAPopulator() {
    const min = +this.config_service.getConfig().rangeForSLA.min;
    const max = +this.config_service.getConfig().rangeForSLA.max;

    for (let i = min; i <= max; i++) {
      const obj = { name: i, id: i };
      this.customRangeSLA.push(obj);
    }
  }

  cancel() {
    this.router.navigate(['../']);
  }

  handleCheck(v: { name: string; value: string }) {
    const { name, value } = v;
    if (name === 'needMoreDataFromCreator') {
      if (value) {
        this.form
          .get('needMoreDataFromCreator')
          ?.setValidators(Validators.required);
        this.form.get('attachments')?.setValidators(Validators.required);
      } else {
        this.form.get('needMoreDataFromCreator')?.clearValidators();
        this.form.get('attachments')?.clearValidators();
      }
      this.form.get('needMoreDataFromCreator')?.updateValueAndValidity();
      this.form.get('attachments')?.updateValueAndValidity();
    } else if (name === 'sla') {
      if (value) {
        this.form.get('customSLA')?.setValidators(Validators.required);
      } else {
        this.form.get('customSLA')?.clearValidators();
      }
      this.form.get('customSLA')?.updateValueAndValidity();
    }
  }
  /** Uploader functions **/

  uploadClick() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }

  clearInputElement() {
    this.errorSize = false;
    this.errorType = false;
    this.formData.delete('file');
    this.files = [];
  }

  handleUploadChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = Array.from(inputElement.files || []);
    if (files.length > 0) {
      this.clearInputElement();
      this.uploadAndProgress(files);
    }
  }

  uploadAndProgress(files: File[]) {
    this.files = files;
    files.forEach((f) => {
      if (
        f.size >
        +this.config_service.getConfig().fileValidation.sizeWithMegaBytes *
          1000000
      ) {
        this.errorSize = true;
      } else if (
        !this.config_service
          .getConfig()
          .fileValidation.acceptType.split(',')
          .includes(f.type)
      ) {
        this.errorType = true;
      } else {
        this.formData.append('file', f);
        this.form.get('file')?.setValue(this.formData);
      }
    });
  }

  // convenience getters for easy access to form fields
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get t(): FormArray {
    return this.f['requestApprovals'] as FormArray;
  }

  /** setps flow functions **/

  addNewStep() {
    const newGroup = this._formBuilder.group({
      username: ['', Validators.required],
      sequence: [this.stepCounter++],
    });
    this.t.push(newGroup);
    this.ManageUserNameControl(this.t.length - 1);
  }
  removeStep(index: number) {
    this.t.removeAt(index);
    this.selectedOptions.splice(index, 1);
  }
  triggerEvent(event: any, item: number) {
    if (!event) {
      this.t.at(item).patchValue({ input: '' });
    } else {
      this.t?.at(item)?.get('input')?.markAsTouched();
    }
  }
  onSelectionChange(event: any, i: number) {
    this.disableSaveBtn = false;
    const value = event.source.value.toLowerCase();

    // if (
    //   this.isEditing &&
    //   (value ===
    //     this.reportData?.requestApprovals[
    //       this.reportData?.requestApprovals?.length - 1
    //     ].username ||
    //     value === this.authService.getCurrentUserName())
    // ) {
    //   this.disableSaveBtn = true;
    // }
    // this.selectedOptions.splice(i, 1);

    // if (!this.selectedOptions.includes(value)) {
    //   this.selectedOptions.splice(i, 0, value);
    // }
    this.ManageUserNameControl(i);
  }
  ManageUserNameControl(index: number) {
    const control = this.t.at(index).get('input');
    if (control) {
      if (this.t.at(index).get('input')?.touched) {
        this.filteredOptions[index] = control.valueChanges.pipe(
          startWith<string | User>(''),
          map((value) => (typeof value === 'string' ? value : value.username)),
          map((name) => {
            const copySelected = this.selectedOptions.slice();
            copySelected.splice(index, 1);
            return name
              ? this._filter(name)
              : this.selectedOptions.length === 1
              ? this.users
              : this.users?.filter((x) => {
                  return !copySelected.includes(x.username.toLowerCase());
                });
          })
        );
        this.filteredOptions[index + 1] = control.valueChanges.pipe(
          startWith<string | User>(''),
          map((value) => (typeof value === 'string' ? value : value.username)),
          map((name) => {
            return name
              ? this._filter(name)
              : this.users?.filter(
                  (x) =>
                    !this.selectedOptions.includes(x.username.toLowerCase())
                );
          })
        );
      } else {
        this.filteredOptions[index] = control.valueChanges.pipe(
          startWith<string | User>(''),
          map((value) => (typeof value === 'string' ? value : value.username)),
          map((name) => {
            return name
              ? this._filter(name)
              : this.isEditing
              ? this.users
              : this.users?.filter(
                  (x) =>
                    !this.selectedOptions.includes(x.username.toLowerCase())
                );
          })
        );
      }
    }
  }
  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    if (this.selectedOptions.length > 0) {
      return this.users
        ?.filter(
          (option) => option?.name.toLowerCase().indexOf(filterValue) === 0
        )
        .filter((x) => !this.selectedOptions.includes(x?.username));
    } else {
      return this.users?.filter(
        (option) => option.name.toLowerCase().indexOf(filterValue) === 0
      );
    }
  }
}
