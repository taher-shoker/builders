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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { MilestonesService, User } from '../../dy-reports.service';
import { startWith, map, Observable } from 'rxjs';

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
  @Input() data!: any;
  @Input() readOnly!: boolean;
  @Input() isSubmited!: boolean;
  @Input() casseId!: string;

  @Output() caseStatus = new EventEmitter<string>();

  @ViewChild('fileUpload') fileUpload!: ElementRef;

  form!: FormGroup;
  users!: [];
  files: File[] = [];
  formData = new FormData();
  isLoading = false;
  errorSize = false;
  errorType = false;
  disableSaveBtn = true;
  filteredOptions: Observable<any[]>[] = [];

  accept = 'text/csv';
  allTeams: any;
  selectTeam!: any;
  stepCounter = 1;
  selectedOptions = [];

  constructor(
    private _formBuilder: FormBuilder,
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
    this.initReportForm();
    //this.ManageUserNameControl(0);
  }

  initReportForm() {
    this.form = this._formBuilder.group({
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(150)]],
      category: ['', Validators.required],
      sla: [''],
      isCreator: [''],
      creatorName: [''],
      file: ['', Validators.required],
      requestApprovals: this._formBuilder.array(
        !this.isEditing
          ? [
              this._formBuilder.group({
                username: ['', Validators.required],
                sequence: [1],
                input: [''],
              }),
            ]
          : []
      ),
    });
  }

  restFormWithValue(data: any) {
    console.log(data);
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
      if (f.size > 20000000) {
        this.errorSize = true;
      } else if (f.type !== 'text/csv') {
        this.errorType = true;
      } else {
        this.formData.append('file', f);
        this.form.get('file')?.setValue(this.formData);
      }
    });
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.form.controls;
  }
  get t() {
    return (this.f['requestApprovals'] as FormArray).controls as FormGroup[];
  }
  /** setps flow functions **/

  addNewStep() {
    this.stepCounter += 1;
    if (this.t.length < this.stepCounter) {
      for (let i = this.t.length; i < this.stepCounter; i++) {
        this.t.push(
          this._formBuilder.group({
            username: ['', Validators.required],
            sequence: [''],
            input: [''],
          })
        );
        //  this.t.at(i).patchValue({ sequence: this.stepCounter });
        //this.ManageUserNameControl(i);
      }
    }
  }
  removeStep(item: number) {
    this.selectedOptions.splice(item, 1);
  }
  // triggerEvent(event: boolean, item: number) {
  //   if (!event) {
  //     this.t.at(item).patchValue({ input: '' });
  //   } else {
  //     this.t.at(item).get('input').markAsTouched();
  //   }
  // }
  onSelectionChange(event: any, i: number) {
    //this.disableSaveBtn = false;
    const value = event.source.value.toLowerCase();

    // if (
    //   this.isEditing &&
    //   (value ===
    //     this.formData?.requestApprovals[
    //       this.formData?.requestApprovals?.length - 1
    //     ].username ||
    //     value === this.authService.getCurrentUserName())
    // ) {
    //   this.disableSaveBtn = true;
    // }
    // this.selectedOptions.splice(i, 1);

    // if (!this.selectedOptions.includes(value)) {
    //   this.selectedOptions.splice(i, 0, value);
    // }
    //this.ManageUserNameControl(i);
  }

  // ManageUserNameControl(index: number) {
  //   if (this.t.at(index).get('input').touched) {
  //     this.filteredOptions[index] = this.t
  //       .at(index)
  //       ?.get('input')
  //       .valueChanges.pipe(
  //         startWith<string | User>(''),
  //         map((value) => (typeof value === 'string' ? value : value.username)),
  //         map((name) => {
  //           const copySelected = this.selectedOptions.slice();
  //           copySelected.splice(index, 1);
  //           return name
  //             ? this._filter(name)
  //             : this.selectedOptions.length === 1
  //             ? this.users
  //             : this.users?.filter((x) => {
  //                 return !copySelected.includes(x.username.toLowerCase());
  //               });
  //         })
  //       );
  //     this.filteredOptions[index + 1] = this.t
  //       .at(index + 1)
  //       ?.get('input')
  //       .valueChanges.pipe(
  //         startWith<string | User>(''),
  //         map((value) => (typeof value === 'string' ? value : value.username)),
  //         map((name) => {
  //           return name
  //             ? this._filter(name)
  //             : this.users?.filter(
  //                 (x) =>
  //                   !this.selectedOptions.includes(x.username.toLowerCase())
  //               );
  //         })
  //       );
  //   } else {
  //     this.filteredOptions[index] = this.t
  //       .at(index)
  //       ?.get('input')
  //       .valueChanges.pipe(
  //         startWith<string | User>(''),
  //         map((value) => (typeof value === 'string' ? value : value.username)),
  //         map((name) => {
  //           return name
  //             ? this._filter(name)
  //             : this.formMode === 'edit'
  //             ? this.users
  //             : this.users?.filter(
  //                 (x) =>
  //                   !this.selectedOptions.includes(x.username.toLowerCase())
  //               );
  //         })
  //       );
  //   }
  // }
  // private _filter(name: string): User[] {
  //   const filterValue = name.toLowerCase();
  //   if (this.selectedOptions.length > 0) {
  //     return this.users
  //       ?.filter(
  //         (option) => option?.name.toLowerCase().indexOf(filterValue) === 0
  //       )
  //       .filter(
  //         (x) => !this.selectedOptions.includes(x.username.toLowerCase())
  //       );
  //   } else {
  //     return this.users?.filter(
  //       (option) => option.name.toLowerCase().indexOf(filterValue) === 0
  //     );
  //   }
  // }
}
