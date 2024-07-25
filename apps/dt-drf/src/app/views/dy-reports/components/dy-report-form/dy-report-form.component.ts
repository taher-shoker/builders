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
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { ConfigService } from '../../../../services/config.service';
import { Report } from '../../../../services/models/report-flow.model';
import { User } from '../../../../services/models/user';
import { ReportsService, UploadResponse } from '../../dy-reports.service';

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

  @ViewChild('fileUpload') fileUpload!: ElementRef;

  form!: FormGroup;
  users: User[] = [];
  approvers: User[] = [];
  filteredApprovers: any[][] = []; // Array of filtered options for each dropdown

  uploadedFiles: BehaviorSubject<{ id: number; label: string }[]> =
    new BehaviorSubject<{ id: number; label: string }[]>([]);

  isLoading = false;
  isSubmitLoading = false;

  errorSize = false;
  errorType = false;
  disableSaveBtn = true;
  filteredOptions: Observable<User[]>[] = [];

  selectTeam!: any;
  stepCounter = 1;
  selectedOptions: any = [];
  customRangeSLA: { name: number; id: number }[] = [];
  categories: any;
  constructor(
    private _formBuilder: FormBuilder,
    protected dialogService: DialogService,
    public reportsService: ReportsService,
    private toastr: ToastrService,
    private router: Router,
    public config_service: ConfigService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportData']) {
      this.reportData = changes['reportData'].currentValue;
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
    this.getCategories();
  }

  initReportForm() {
    this.form = this._formBuilder.group({
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(150)]],
      requestCategoryId: ['', Validators.required],
      sla: [''],
      customSLA: [''],
      needMoreDataFromCreator: [0],
      initiatorShouldApprove: [0],
      creatorEmail: [''],
      attachments: [[], Validators.required],
      requestApprovals: this._formBuilder.array([]),
    });
    this.addNewStep();
  }

  restFormWithValue(data: any) {
    this.form?.get('reportName')?.setValue(data?.reportName);
    this.form?.get('description')?.setValue(data.description);
    this.form?.get('requestCategoryId')?.setValue(data.requestCategory.id);
    this.uploadedFiles.next(data?.attachments);
    if (data?.creatorEmail) {
      this.form?.get('needMoreDataFromCreator')?.setValue(true);
      this.form?.get('creatorEmail')?.setValue(data.creatorEmail);
    }
  }
  onSubmit() {
    if (this.form.valid) {
      this.isSubmitLoading = true;
      let finalData = {
        ...this.form.value,
        initiatorShouldApprove: this.form.get('initiatorShouldApprove')?.value
          ? 1
          : 0,
        needMoreDataFromCreator: this.form.get('needMoreDataFromCreator')?.value
          ? 1
          : 0,
      };
      if (this.isEditing) {
        finalData = { ...finalData };
        // this.reportsService
        //   .updateReportFlow('1', finalData)
        //   .subscribe((res) => {
        //     if (res) {
        //       this.toastr.success('Milestone has been edited successfully');
        //       this.form.reset();
        //       this.router.navigate(['./home']);
        //     }
        //   });
      } else {
        this.reportsService.createReportFlow(finalData).subscribe((res) => {
          if (res) {
            this.isSubmitLoading = false;
            this.toastr.success('Report has been created successfully');
            this.form.reset();
            this.router.navigate(['./home']);
          }
        });
      }
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

  getUsersListing() {
    this.reportsService.getUsers().subscribe((res) => {
      this.users = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
      this.approvers = this.users;
    });
  }
  getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories = res;
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
        this.form.get('creatorEmail')?.setValidators(Validators.required);
        this.form.get('attachments')?.clearValidators();
      } else {
        this.form.get('creatorEmail')?.clearValidators();
        this.form.get('attachments')?.setValidators(Validators.required);
      }
      this.form.get('creatorEmail')?.updateValueAndValidity();
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
    //this.files = [];
  }

  handleUploadChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = Array.from(inputElement.files || []);
    if (files.length > 0) {
      this.uploadAndProgress(files);
    }
  }
  uploadAndProgress(files: File[]) {
    // Track the number of files processed
    let filesProcessed = 0;
    const totalFiles = files.length;

    files.forEach((file) => {
      if (
        file.size >
        +this.config_service.getConfig().fileValidation.sizeWithMegaBytes *
          1000000
      ) {
        this.errorSize = true;
      } else if (
        !this.config_service
          .getConfig()
          .fileValidation.acceptType.split(',')
          .includes(file.type)
      ) {
        this.errorType = true;
      } else {
        // Create a new FormData object for each file
        const formData = new FormData();
        formData.append('file', file);

        this.reportsService.addFile(formData).subscribe({
          next: (res: UploadResponse) => {
            console.log(res);
            // Update the BehaviorSubject with new file data
            this.uploadedFiles.next([
              ...this.uploadedFiles.value,
              { id: res.id, label: res.label },
            ]);

            // Increment the count of processed files
            filesProcessed++;

            // Check if all files have been processed
            if (filesProcessed === totalFiles) {
              // Update the form control value after all files have been processed
              this.form
                .get('attachments')
                ?.setValue(
                  this.uploadedFiles.value.map((file) => ({ id: file.id }))
                );
            }
          },
          error: (err) => {
            console.error(err);
            // Handle error if needed
          },
        });
      }
    });
  }

  removeFile(index: number) {
    const currentFiles = this.uploadedFiles.value;
    currentFiles.splice(index, 1); // Remove the file at the specified index
    this.uploadedFiles.next(currentFiles); // Update the BehaviorSubject with the new list
    this.form
      .get('attachments')
      ?.setValue(this.uploadedFiles.value.map((file) => ({ id: file.id })));
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
  onSelectionChange(v: any, i: number) {
    this.disableSaveBtn = false;
    //const value = event.source.value.toLowerCase();

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
    this.selectedOptions.splice(i, 1);

    if (!this.selectedOptions.includes(v)) {
      this.selectedOptions.splice(i, 0, v);
    }
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
