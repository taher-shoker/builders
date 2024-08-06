/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
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

import { ActivatedRoute, Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfigService } from '../../../../services/config.service';
import { Report } from '../../../../services/models/report-flow.model';
import { User } from '../../../../services/models/user';
import {
  Category,
  ReportDetails,
  ReportsService,
  RequestTaskAttributes,
  UploadResponse,
} from '../../dy-reports.service';

@Component({
  selector: 'stc-apps-dy-report-form',
  templateUrl: './dy-report-form.component.html',
  styleUrls: ['./dy-report-form.component.scss'],
})
export class DyReportFormComponent implements OnInit, OnChanges {
  @Input() isEditing!: boolean;
  @Input() reportData!: Report;
  @Input() readOnly!: boolean;
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  mode: 'add' | 'edit_report_step' | 'edit' = 'add';
  form!: FormGroup;
  users: User[] = [];
  approvers: User[] = [];
  creators: User[] = [];
  uploadedFiles = new BehaviorSubject<{ id: number; label: string }[]>([]);
  isSubmitLoading = false;
  filteredOptions: Observable<User[]>[] = [];
  selectedOptions: string[] = [];
  customRangeSLA: { name: number; id: number }[] = [];
  categories!: Category[];

  constructor(
    private _formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private configService: ConfigService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportData'] && this.reportData) {
      this.resetFormWithValue(this.reportData);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
    this.fetchDataOfReportAndEditIfExists();
  }

  private initForm() {
    this.form = this._formBuilder.group({
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            this.configService.getConfig().characterLimit.descriptionLength
          ),
        ],
      ],
      requestCategoryId: ['', Validators.required],
      slaDurationInDays: [
        '',
        [
          Validators.pattern('^[0-9]+$'),
          Validators.max(this.configService.getConfig().rangeForSLA.max),
        ],
      ],
      needMoreDataFromCreator: [0],
      initiatorShouldApprove: [0],
      creatorEmail: [''],
      attachments: [[], Validators.required],
      requestApprovals: this._formBuilder.array([]),
    });
  }

  private loadInitialData() {
    this.getUsers().subscribe(() => {
      this.setupInitialFilteredOptions();
    });
    this.populateCustomSLA();
    this.getCategories();
  }

  private setupInitialFilteredOptions() {
    // Setup filtered options for each approval step
    this.t.controls.forEach((control, index) => {
      this.manageUserNameControl(index);
    });
  }

  paramsId!: string;
  paramsMode!: string;
  paramsflowId!: string;
  paramsRequestTaskId!: string;

  fetchDataOfReportAndEditIfExists(): void {
    this.route.queryParams.subscribe((params) => {
      this.paramsId = params['id'];
      this.paramsMode = params['mode'];
      this.paramsflowId = params['flowId'];
      this.paramsRequestTaskId = params['requestTaskId'];

      if (this.paramsMode === 'edit_report_step' && this.paramsId) {
        this.paramsMode = 'edit_report_step';
        this.reportsService.getReport(this.paramsId).subscribe({
          next: (res) => {
            console.log(res);
            this.resetFormWithValueForEditStep(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  private resetFormWithValue(data: Report) {
    this.form.patchValue({
      reportName: data.reportName,
      description: data.description,
      requestCategoryId: data.requestCategory.id,
      needMoreDataFromCreator: !!data.creatorEmail,
      creatorEmail: data.creatorEmail || '',
      slaDurationInDays: data.requestCategory.slaDuration || 0,
    });
    this.uploadedFiles.next(data.attachments);
    this.form.get('description')?.disable();
    this.form.get('requestCategoryId')?.disable();
    this.form.get('needMoreDataFromCreator')?.disable();
    this.form.get('creatorEmail')?.disable();
    this.form.get('initiatorShouldApprove')?.disable();
    this.form.get('attachments')?.disable();
    this.form.get('requestApprovals')?.disable();
    this.form.get('slaDurationInDays')?.disable();
  }

  private resetFormWithValueForEditStep(data: ReportDetails) {
    this.form.patchValue({
      reportName: data.reportName,
      description: data.description,
      requestCategoryId: data.requestCategory.id,
      needMoreDataFromCreator: !!data.creatorEmail,
      creatorEmail: data.creatorEmail || '',
      slaDurationInDays: data.requestCategory.slaDuration || 0,
    });

    // Clear existing array and add new controls
    const requestApprovalsArray = this.form.get(
      'requestApprovals'
    ) as FormArray;
    requestApprovalsArray.clear();
    data.requestApprovals.forEach((approval) => {
      requestApprovalsArray.push(this.createApprovalControl(approval));
    });

    this.uploadedFiles.next(data.attachments);

    // Disable certain form controls if needed
    this.form.get('description');
    this.form.get('requestCategoryId');
    this.form.get('needMoreDataFromCreator');
    this.form.get('creatorEmail');
    this.form.get('initiatorShouldApprove');
    this.form.get('attachments');
    this.form.get('requestApprovals');
    this.form.get('slaDurationInDays');
  }

  private createApprovalControl(approval: any): FormGroup {
    return this._formBuilder.group({
      id: [approval.id],
      username: [approval.username],
      sequence: [approval.sequence],
      status: [approval.status],
      userDisplayName: [approval.userDisplayName],
    });
  }
  handelCreator(value: string) {
    this.approvers = this.creators.filter((a: User) => a.email !== value);
    // Find and remove the selected value from the FormArray
    this.t.controls.forEach((control, index) => {
      if (control.get('username')?.value === value) {
        this.t.removeAt(index);
      }
    });
    this.selectedOptions = this.selectedOptions.filter((s) => s !== value);
    this.updateFilteredOptions();
  }
  onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isSubmitLoading = true;
    const finalData = {
      ...this.form.value,
      initiatorShouldApprove: this.form.value.initiatorShouldApprove ? 1 : 0,
      needMoreDataFromCreator: this.form.value.needMoreDataFromCreator ? 1 : 0,
    };

    const handleSuccess = (message: string) => {
      this.toastr.success(message);
      this.router.navigate(['./home']);
    };

    const handleSuccessStepEdit = (message: string) => {
      this.toastr.success(message);
      this.router.navigate(['../']);
    };

    const handleError = () => {
      this.toastr.error('An error occurred while processing your request.');
      this.isSubmitLoading = false;
    };

    if (this.paramsMode === 'edit_report_step') {
      console.log('Req Approvals', this.form.get('requestApprovals')?.value);

      const params: RequestTaskAttributes = {
        requestParams: [
          { name: 'delete', value: false },
          { name: 'report_name', value: this.form.get('reportName')?.value },
          { name: 'description', value: this.form.get('description')?.value },
          {
            name: 'attachments',
            value: this.idsJoiner(this.form.get('attachments')?.value),
          },
          {
            name: 'request_approvals',
            value: this.usernamesJoiner(
              this.form.get('requestApprovals')?.value
            ),
          },
          {
            name: 'needs_creator_to_add_data',
            value:
              this.form.get('needMoreDataFromCreator')?.value === false ? 0 : 1,
          },
          {
            name: 'creator_email',
            value: this.form.get('creatorEmail')?.value,
          },
          {
            name: 'initiator_should_approve',
            value: this.form.get('initiatorShouldApprove')?.value,
          },
          {
            name: 'request_category',
            value: this.form.get('requestCategoryId')?.value,
          },
          {
            name: 'sla_duration',
            value: this.form.get('slaDurationInDays')?.value,
          },
        ],
      };
      this.reportsService
        .completePendingTask(
          this.paramsflowId,
          this.paramsRequestTaskId,
          params
        )
        .subscribe({
          next: () => handleSuccessStepEdit('Edit Step is success'),
          error: handleError,
          complete: () => (this.isSubmitLoading = false),
        });

      return;
    }

    if (this.isEditing) {
      this.reportsService
        .updateReportFlow(this.reportData.id, finalData)
        .subscribe({
          next: () => handleSuccess('Report has been edited successfully'),
          error: handleError,
          complete: () => (this.isSubmitLoading = false),
        });
    } else {
      this.reportsService.createReportFlow(finalData).subscribe({
        next: () => handleSuccess('Report has been created successfully'),
        error: handleError,
        complete: () => (this.isSubmitLoading = false),
      });
    }
  }

  private idsJoiner(arrOfObjs: { id: string }[]) {
    const newArr = arrOfObjs.map((x) => x.id);
    return newArr.join('@#%@#%Z%#@%#@');
  }

  private usernamesJoiner(arrOfObjs: { username: string }[]) {
    const newArr = arrOfObjs.map((x) => x.username);
    return newArr.join('@#%@#%Z%#@%#@');
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
  handleGategory(item: number) {
    const selectedCategory = this.categories.filter(
      (c: Category) => c?.id === item
    )[0];
    // Set the form control value to the found category's slaDuration or default to 0
    this.form
      .get('slaDurationInDays')
      ?.setValue(selectedCategory?.slaDuration ?? 0);
  }
  private getUsers(): Observable<User[]> {
    return this.reportsService.getUsers().pipe(
      map((res) => {
        this.users = res.filter(
          (user) => user.userGroups[0].roles[0].roleName !== 'ADMINS'
        );
        this.approvers = this.users.filter(
          (user) => user.email !== this.reportsService.getCurrentUser().email
        );
        this.creators = this.approvers;
        return this.users;
      })
    );
  }

  private getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  private populateCustomSLA() {
    const { min, max } = this.configService.getConfig().rangeForSLA;
    this.customRangeSLA = Array.from({ length: max - min + 1 }, (_, i) => ({
      name: min + i,
      id: min + i,
    }));
  }
  cancel() {
    this.router.navigate(['../']);
  }
  preventComma(event: KeyboardEvent) {
    if (event.key === ',') {
      event.preventDefault();
    }
  }

  handleCheck({ name, value }: { name: string; value: string }) {
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
      this.form
        .get('customSLA')
        ?.setValidators(value ? Validators.required : null);
      this.form.get('customSLA')?.updateValueAndValidity();
    }
  }
  uploadClick() {
    this.fileUpload.nativeElement.click();
  }

  handleUploadChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = Array.from(inputElement.files || []);
    if (files.length) {
      this.uploadAndProgress(files);
    }
  }

  private uploadAndProgress(files: File[]) {
    let filesProcessed = 0;

    files.forEach((file) => {
      if (this.isFileValid(file)) {
        const formData = new FormData();
        formData.append('file', file);

        this.reportsService.addFile(formData).subscribe({
          next: (res: UploadResponse) => {
            this.uploadedFiles.next([
              ...this.uploadedFiles.value,
              { id: res.id, label: res.label },
            ]);
            filesProcessed++;
            if (filesProcessed === files.length) {
              this.form
                .get('attachments')
                ?.setValue(this.uploadedFiles.value.map(({ id }) => ({ id })));
            }
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  private isFileValid(file: File): boolean {
    const config = this.configService.getConfig().fileValidation;
    if (file.size > config.sizeWithMegaBytes * 1_000_000) {
      this.toastr.error('File size exceeds the allowed limit.');
      return false;
    } else if (!config.acceptType.includes(file.type)) {
      this.toastr.error('File type is not allowed.');
      return false;
    }
    return true;
  }

  removeFile(index: number) {
    const currentFiles = [...this.uploadedFiles.value];
    currentFiles.splice(index, 1);
    this.uploadedFiles.next(currentFiles);
    this.form
      .get('attachments')
      ?.setValue(currentFiles.map(({ id }) => ({ id })));
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get t(): FormArray {
    return this.f['requestApprovals'] as FormArray;
  }

  addNewStep() {
    const newGroup = this._formBuilder.group({
      username: ['', Validators.required],
      sequence: [this.t.length + 1],
    });
    this.t.push(newGroup);
    this.manageUserNameControl(this.t.length - 1);
  }

  removeStep(index: number) {
    this.t.removeAt(index);
    this.selectedOptions.splice(index, 1);
    this.updateFilteredOptions();
  }

  manageUserNameControl(index: number) {
    const control = this.t.at(index).get('username');
    if (control) {
      this.filteredOptions[index] = control.valueChanges.pipe(
        startWith<string | User>(''),
        map((value) => (typeof value === 'string' ? value : value.email)),
        map((name) => {
          const copySelected = [...this.selectedOptions];
          copySelected.splice(index, 1);
          return name
            ? this.filterUsers(name)
            : this.approvers.filter(
                (x) => !copySelected.includes(x.email.toLowerCase())
              );
        })
      );
    }
  }

  private filterUsers(name: string): User[] {
    const filterValue = name.toLowerCase();
    let filteredUsers = this.approvers.filter((option) =>
      option.email.toLowerCase().includes(filterValue)
    );

    if (this.selectedOptions.length > 0) {
      filteredUsers = filteredUsers.filter(
        (user) => !this.selectedOptions.includes(user.email.toLowerCase())
      );
    }

    return filteredUsers;
  }

  onSelectionChange(option: string, index: number) {
    this.selectedOptions[index] = option.toLowerCase();
    this.updateFilteredOptions();
  }

  private updateFilteredOptions() {
    this.selectedOptions.forEach((_, i) => {
      this.manageUserNameControl(i);
    });
  }
}
