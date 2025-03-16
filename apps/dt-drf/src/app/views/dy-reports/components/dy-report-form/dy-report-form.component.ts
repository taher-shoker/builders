/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
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
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
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
import { Location } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'stc-apps-dy-report-form',
  templateUrl: './dy-report-form.component.html',
  styleUrls: ['./dy-report-form.component.scss'],
})
export class DyReportFormComponent implements OnInit, OnChanges {
  @Input() isEditing!: boolean;
  @Input() reportData!: ReportDetails;
  @Input() readOnly!: boolean;
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  mode: 'add' | 'edit_report_step' | 'edit' = 'add';
  form!: FormGroup;
  users: User[] = [];
  approvers: User[] = [];
  creators: User[] = [];
  creatorSelected!: string;
  uploadedFiles = new BehaviorSubject<{ id: number; label: string }[]>([]);
  isUploaderLoader = false;
  isSubmitLoading = false;
  filteredOptions: Observable<User[]>[] = [];
  selectedOptions: string[] = [];
  customRangeSLA: { name: number; id: number }[] = [];
  categories: WritableSignal<Category[]> = signal([]);
  paramsId!: string;
  paramsMode!: string;
  paramsFlowId!: string;
  paramsRequestTaskId!: string;
  availableUsers: WritableSignal<User[]> = signal([]);
  startDate: Date | null = new Date();
  endDate!: Date | null;
  SchedulingTypes: { id: string; name: string }[] = [
    { id: 'Monthly', name: 'Monthly' },
    { id: 'Weekly', name: 'Weekly' },
    { id: 'CustomDate', name: 'Custom date' },
  ];

  monthNumbers: { id: number; name: string }[] = [];
  weeklyDays: { id: string; name: string }[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private location: Location
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportData'] && this.reportData) {
      if (this.paramsMode !== 'edit_report_step') {
        this.resetFormWithValue(this.reportData);
      }
    }
  }

  handleScheduleType(type: string) {
    this.restDateFields();
    this.handleValidationWithScheduling(type);
  }
  restDateFields() {
    this.form.get('startDate')?.reset();
    this.form.get('endDate')?.reset();
    this.weeklyDays = [];
    this.monthNumbers = [];
  }

  FilterEndDate = (d: Date | null): boolean => {
    if (d === null) return false; // null dates are not allowed

    if (this.startDate) {
      const previousDays = new Date(this.startDate);
      const dateWithDays = new Date(d);
      const day = dateWithDays.getDay();
      return d >= previousDays && day !== 5 && day !== 6;
    }

    return true;
  };
  DisableSpecificDays = (d: Date | null): boolean => {
    if (d === null) return false;
    const dateWithdays = new Date(d);
    const day = dateWithdays.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return day !== 5 && day !== 6; // Disable Sunday (0) and Saturday (6)
  };
  handelChangeDate(event: MatDatepickerInputEvent<Date>, type: string) {
    if (type === 'start') {
      this.startDate = null;
      this.endDate = null;
      this.startDate = event.value;
      this.form.get('endDate')?.reset();
    } else {
      this.endDate = event.value;
      if (this.startDate && this.endDate) {
        if (this.form.get('schedulingType')?.value === 'Monthly') {
          this.getDaysBetweenDatesArray(this.startDate, this.endDate);
        } else {
          this.getUniqueDayNamesBetweenDates(this.startDate, this.endDate);
        }
      }
    }
  }
  handleValidationWithScheduling(schedulingType: string) {
    if (schedulingType === 'Monthly') {
      this.form.get('monthNumber')?.setValidators([Validators.required]);
    } else if (schedulingType === 'Weekly') {
      this.form.get('weeklyDay')?.setValidators([Validators.required]);
    }
    this.form.get('monthNumber')?.updateValueAndValidity();
    this.form.get('weeklyDay')?.updateValueAndValidity();
  }

  getDaysBetweenDatesArray(startDate: Date, endDate: Date): void {
    console.log(startDate, endDate);
    const daySet = new Set<number>();
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayNumber = currentDate.getDate();
      const dayName = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });

      // Exclude Friday and Saturday
      if (dayName !== 'Friday' && dayName !== 'Saturday') {
        daySet.add(dayNumber);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Convert Set to array, sort it, and map to desired format
    this.monthNumbers = Array.from(daySet)
      .sort((a, b) => a - b)
      .map((day) => ({ id: day, name: day.toString() }));
    console.log(this.monthNumbers);
  }

  getUniqueDayNamesBetweenDates(
    startDate: string | Date,
    endDate: string | Date
  ): void {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daySet = new Set<string>();
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayName = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });

      // Exclude Friday and Saturday
      if (dayName !== 'Friday' && dayName !== 'Saturday') {
        daySet.add(dayName); // Store unique day names
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Define the desired order starting from Sunday
    const weekOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    // Sort based on predefined order
    this.weeklyDays = Array.from(daySet)
      .sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b))
      .map((day) => ({ id: day, name: day }));
  }

  ngOnInit(): void {
    // this.initForm();
    // this.loadInitialData();

    this.initForm();
    this.fetchUsers();
    this.populateCustomSLA();
    this.getCategories();
    this.fetchDataOfReportAndEditIfExists();
  }

  private noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  private initForm() {
    this.form = this._formBuilder.group({
      reportName: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            this.configService.getConfig().characterLimit.nameLength
          ),
          this.noWhitespaceValidator,
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(
            this.configService.getConfig().characterLimit.descriptionLength
          ),
          this.noWhitespaceValidator,
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
      autoScheduling: [false],
      schedulingType: [''],
      monthNumber: [''],
      isEscalationEnabled: [false],
      isReminderActive: [false],
      weeklyDay: [''],
      startDate: [''],
      endDate: [''],
      customDate: [''],
    });
  }

  private fetchUsers() {
    this.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.availableUsers.set([...users].sort((a, b) => a.id - b.id)); // Clone the list of available users
    });
  }

  fetchDataOfReportAndEditIfExists(): void {
    this.route.queryParams.subscribe((params) => {
      this.paramsId = params['id'];
      this.paramsMode = params['mode'];
      this.paramsFlowId = params['flowId']; // Needed for complete task method
      this.paramsRequestTaskId = params['requestTaskId']; // Needed for complete task method

      if (this.paramsMode === 'edit_report_step' && this.paramsId) {
        this.isEditing = false;
        forkJoin([
          this.reportsService.getUsers(),
          this.reportsService.getCategories(),
        ]).subscribe(() => {
          this.reportsService.getReport(this.paramsId).subscribe({
            next: (res) => {
              this.resetFormWithValueForEditStep(res);
            },
            error: (err) => {
              console.log(err);
            },
          });
        });
      }
    });
  }

  private resetFormWithValue(data: ReportDetails) {
    forkJoin([
      this.reportsService.getUsers(),
      this.reportsService.getCategories(),
    ]).subscribe(() => {
      this.form.patchValue({
        reportName: data.reportName,
        description: data.description,
        requestCategoryId: data.requestCategory.id,
        needMoreDataFromCreator: !!data.creatorEmail,
        creatorEmail: data.creatorEmail || '',
        slaDurationInDays: data.reportSlaDuration || 0,
        initiatorShouldApprove: data.initiatorShouldApprove,
        autoScheduling: data.requestSchedule.autoScheduling,
        schedulingType: data.requestSchedule.schedulingType,
        startDate: data.requestSchedule.startDate,
        endDate: data.requestSchedule.endDate,
        isEscalationEnabled: data.isEscalationEnabled,
        isReminderActive: data.requestSchedule.isReminderActive,
      });
      if (data.requestSchedule.autoScheduling) {
        // this.handelChangeDate(data.requestSchedule.schedulingType);
        if (data.requestSchedule.schedulingType === 'Monthly') {
          this.getDaysBetweenDatesArray(
            data.requestSchedule.startDate,
            data.requestSchedule.endDate
          );
        } else if (data.requestSchedule.schedulingType === 'Weekly') {
          this.getUniqueDayNamesBetweenDates(
            data.requestSchedule.startDate,
            data.requestSchedule.endDate
          );
        }
      }
      this.uploadedFiles.next(data.attachments);
      // this.form.get('description')?.disable();
      this.form.get('requestCategoryId')?.disable();
      this.form.get('needMoreDataFromCreator')?.disable();
      this.form.get('creatorEmail')?.disable();
      this.form.get('initiatorShouldApprove')?.disable();
      this.form.get('attachments')?.disable();
      const requestApprovalsArray = this.form.get(
        'requestApprovals'
      ) as FormArray;
      if (requestApprovalsArray) {
        requestApprovalsArray.disable(); // Disables the array and all controls within it
      }
      this.form.get('slaDurationInDays')?.disable();

      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
      });
    });
  }

  private resetFormWithValueForEditStep(data: ReportDetails) {
    this.form.patchValue({
      reportName: data.reportName,
      description: data.description,
      requestCategoryId: data.requestCategory.id,
      needMoreDataFromCreator: !!data.creatorEmail,
      creatorEmail: data.creatorEmail || '',
      slaDurationInDays: data.requestCategory.slaDuration || 0,
      attachments: data.attachments.map((attachment) => attachment.id),
      initiatorShouldApprove: data.initiatorShouldApprove,
      autoScheduling: data.requestSchedule.autoScheduling,
      schedulingType: data.requestSchedule.schedulingType,
      startDate: data.requestSchedule.startDate,
      endDate: data.requestSchedule.endDate,
    });

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.enable();
    });

    if (data.creatorEmail) {
      this.selectedUsers.push({
        index: 0,
        userEmail: data.creatorEmail,
      });
    }

    this.handleCheck({
      name: 'needMoreDataFromCreator',
      value: !!data.creatorEmail,
    });

    this.uploadedFiles.next(data.attachments);

    this.populateRequestApprovals(data.requestApprovals);
  }

  private populateRequestApprovals(
    approvals: ReportDetails['requestApprovals']
  ) {
    const requestApprovalsFormArray = this.form.get(
      'requestApprovals'
    ) as FormArray;
    approvals.forEach((approval, idx) => {
      const user = this.users.find((u) => u.email === approval.username);
      if (user) {
        this.selectedUsers.push({
          index: idx + 1,
          userEmail: user.email,
        });

        requestApprovalsFormArray.push(this.createApprovalFormGroup(user));
        this.removeFromAvailableUsers(user);
      }
    });
  }

  private createApprovalFormGroup(user: User): FormGroup {
    return this._formBuilder.group({
      username: [user.email, Validators.required],
    });
  }

  private removeFromAvailableUsers(user: User) {
    this.availableUsers.set(
      this.availableUsers()
        .filter((u) => u.email !== user.email)
        .sort((a, b) => a.id - b.id)
    );
  }

  protected addUserApproval(user: User | null) {
    // Ensure the user is not null before proceeding
    if (user) {
      const approvalControl = this._formBuilder.group({
        username: [user.email, Validators.required],
        // Additional form controls related to the user approval can go here
      });

      this.requestApprovalsGetter.push(approvalControl);

      // Remove the selected user from availableUsers list
      this.availableUsers.set(
        this.availableUsers().filter(
          (availableUser) => availableUser.email !== user.email
        )
      );
    } else {
      console.error('Invalid user selection: User is null');
    }
  }

  protected removeUserApproval(index: number) {
    const requestApprovalsFormArray = this.form.get(
      'requestApprovals'
    ) as FormArray;
    const userControl = requestApprovalsFormArray.at(index).get('user');
    const user = userControl?.value;
    if (user) {
      this.availableUsers.set(
        [...this.availableUsers(), user].sort((a, b) => a.id - b.id)
      );
    }
    requestApprovalsFormArray.removeAt(index);
  }

  protected fetchAvailableUsers(index: number): User[] {
    // find the available user then exclude the selected from the list
    const availableUsers: User[] = [
      ...this.availableUsers().filter(
        (avUser) =>
          !this.selectedUsers.some((sUser) => sUser.userEmail === avUser.email)
      ),
    ];

    // find the current selected user in this control index to be added to the list again
    const userEmail = this.selectedUsers.find(
      (user) => user.index === index
    )?.userEmail;

    // get the user object
    const user = this.users.find((user) => user.email === userEmail);
    if (user) {
      // add the user to the available user list
      availableUsers.push(user);
    }

    // return the users
    return availableUsers.sort((a, b) => a.id - b.id);
  }

  handelCreator(value: string) {
    this.creatorSelected = value;
    this.refetchAvailableUsers(0);
    this.customDropdownSelectionChange(value, 0);
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
      // this.router.navigate(['../'], { relativeTo: this.route });
    };

    const handleError = () => {
      this.toastr.error('An error occurred while processing your request.');
      this.isSubmitLoading = false;
    };

    if (this.paramsMode === 'edit_report_step') {
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
            value: this.form.get('initiatorShouldApprove')?.value ? 1 : 0,
          },
          {
            name: 'request_category',
            value: this.form.get('requestCategoryId')?.value,
          },
          {
            name: 'sla_duration',
            value: Number(this.form.get('slaDurationInDays')?.value),
          },
        ],
      };
      this.reportsService
        .completePendingTask(
          this.paramsFlowId,
          this.paramsRequestTaskId,
          params
        )
        .subscribe({
          next: () => {
            handleSuccessStepEdit('Edit Step is success');
            this.location.back();
          },
          error: handleError,
          complete: () => (this.isSubmitLoading = false),
        });

      return;
    }

    if (this.isEditing) {
      this.reportsService
        .updateReportFlow(
          this.reportData.id,
          finalData.reportName,
          finalData.description
        ) // TODO: Add the Description once the backend has added it to the API.
        .subscribe({
          next: () => handleSuccess('Report has been edited successfully'),
          error: handleError,
          complete: () => (this.isSubmitLoading = false),
        });
    } else {
      finalData.requestApprovals = finalData.requestApprovals.map(
        (req: any, idx: number) => {
          return { ...req, sequence: idx + 1 };
        }
      );
      this.reportsService.createReportFlow(finalData).subscribe({
        next: () => handleSuccess('Report has been created successfully'),
        error: handleError,
        complete: () => (this.isSubmitLoading = false),
      });
    }
  }

  private idsJoiner(arr: any) {
    let newArr;

    if (Array.isArray(arr) && arr.every((item) => item.hasOwnProperty('id'))) {
      newArr = arr.map((x) => x.id);
      newArr = newArr.join('@#%@#%Z%#@%#@');
    } else {
      newArr = arr.join('@#%@#%Z%#@%#@');
    }
    return newArr;
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
    const selectedCategory = this.categories()?.filter(
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
          (user) =>
            user.userGroups[0].roles[0].roleName !== 'ADMINS' &&
            user.email !== this.reportsService.getCurrentUser().email
        );
        // this.approvers = this.users.filter(
        //   (user) => user.email !== this.reportsService.getCurrentUser().email
        // );
        // this.creators = this.approvers;
        return this.users;
      })
    );
  }

  private getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories.set(res);
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
    // this.router.navigate(['../'], { relativeTo: this.route });
    this.location.back();
  }

  preventComma(event: KeyboardEvent) {
    if (event.key === ',') {
      event.preventDefault();
    }
  }

  handleCheck({ name, value }: { name: string; value: boolean }) {
    if (name === 'needMoreDataFromCreator') {
      this.form.get('creatorEmail')?.reset();
      this.handleUnselectedItem(this.creatorSelected, 0);
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
    } else if (name === 'autoScheduling') {
      this.form.get('schedulingType')?.reset();
      this.restDateFields();
      if (value) {
        this.form.get('schedulingType')?.setValidators([Validators.required]);
        this.form.get('startDate')?.setValidators([Validators.required]);
        this.form.get('endDate')?.setValidators([Validators.required]);
      }
      this.form.get('schedulingType')?.updateValueAndValidity();
      this.form.get('startDate')?.updateValueAndValidity;
      this.form.get('endDate')?.updateValueAndValidity;
    }
  }
  uploadClick() {
    this.fileUpload.nativeElement.click();
  }
  handleUploadClick(event: MouseEvent): void {
    if (this.isUploaderLoader) {
      event.preventDefault(); // Prevent the file dialog from opening
    }
  }
  handleUploadChange(event: Event): void {
    if (this.isUploaderLoader) {
      event.preventDefault();
    } else {
      const inputElement = event.target as HTMLInputElement;
      const files = Array.from(inputElement.files || []);
      if (files.length) {
        this.uploadAndProgress(files);
      }
    }
  }

  private uploadAndProgress(files: File[]) {
    let filesProcessed = 0;
    this.isUploaderLoader = true;
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
              this.isUploaderLoader = false;
              this.form
                .get('attachments')
                ?.setValue(
                  this.uploadedFiles.value.map(({ id }) => ({ id: id }))
                );
            }
          },
          error: (err) => (this.isUploaderLoader = false),
        });
      } else {
        this.isUploaderLoader = false;
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

  get requestApprovalsGetter(): FormArray {
    return this.f['requestApprovals'] as FormArray;
  }

  addNewStep() {
    const newGroup = this._formBuilder.group({
      username: ['', Validators.required],
      sequence: [this.requestApprovalsGetter.length + 1],
    });
    this.requestApprovalsGetter.push(newGroup);
    this.manageUserNameControl(this.requestApprovalsGetter.length - 1);
  }

  manageUserNameControl(index: number) {
    const control = this.requestApprovalsGetter.at(index).get('username');
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

  selectedUsers: { index: number; userEmail: string }[] = [];

  customDropdownSelectionChange(selectedUserEmail: string, index: number) {
    const user = this.selectedUsers.find((user) => user.index === index);

    if (user) {
      user.userEmail = selectedUserEmail;
    } else {
      this.selectedUsers.push({ index: index, userEmail: selectedUserEmail });
    }

    // Remove the selected user from available users
    this.availableUsers.set(
      this.users
        .filter((user) => user.email !== selectedUserEmail)
        .sort((a, b) => a.id - b.id)
    );

    // Optionally, handle other logic related to the selection
  }

  handleUnselectedItem(selectedUserEmail: string, index: number) {
    const userIndex = this.selectedUsers.findIndex(
      (user) => user.index === index
    );
    if (userIndex !== -1) {
      this.selectedUsers.splice(userIndex, 1);
    }

    const unselectedUser = this.users.find(
      (user) => user.email === selectedUserEmail
    );

    if (unselectedUser) {
      const foundUser = this.availableUsers().find(
        (user) => user.email === selectedUserEmail
      );
      if (!foundUser) {
        const updatedAvailableUsers = [
          ...this.availableUsers(),
          unselectedUser,
        ].sort((a, b) => a.id - b.id);
        this.availableUsers.set(updatedAvailableUsers);
      }
    }
  }

  removeStep(item: FormGroup, index: number) {
    this.refetchAvailableUsers(index);
    this.requestApprovalsGetter.removeAt(index - 1);
  }

  refetchAvailableUsers(index: number) {
    // get the selected user from the selected users list
    const selected = this.selectedUsers.find((user) => user.index === index);

    // if there a selected one
    if (selected) {
      // remove from the selected users
      const indexOfRemoval = this.selectedUsers.findIndex(
        (element) => selected.userEmail === element.userEmail
      );
      // splice to remove
      this.selectedUsers.splice(indexOfRemoval, 1);

      // update each selection index
      this.selectedUsers = this.selectedUsers.map((element) => {
        if (element.index > selected.index) {
          return { ...element, index: element.index - 1 };
        } else {
          return element;
        }
      });

      // get the user object for this selection
      const selectedUser = this.users.find(
        (user) => user.email === selected.userEmail
      );
      // after get the user object add it to the available list
      if (selectedUser) {
        if (
          !this.availableUsers().find((x) => x.email === selected.userEmail)
        ) {
          this.availableUsers.set(
            [...this.availableUsers(), selectedUser].sort((a, b) => a.id - b.id)
          );
        }
      }
    }
  }
}

class AttachmentBody {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
}
