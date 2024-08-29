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

  // private initForm() {
  //   this.form = this._formBuilder.group({
  //     reportName: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.maxLength(100),
  //         this.noWhitespaceValidator,
  //       ],
  //     ],
  //     description: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.maxLength(
  //           this.configService.getConfig().characterLimit.descriptionLength
  //         ),
  //         this.noWhitespaceValidator,
  //       ],
  //     ],
  //     requestCategoryId: ['', Validators.required],
  //     slaDurationInDays: [
  //       '',
  //       [
  //         Validators.pattern('^[0-9]+$'),
  //         Validators.max(this.configService.getConfig().rangeForSLA.max),
  //       ],
  //     ],
  //     needMoreDataFromCreator: [0],
  //     initiatorShouldApprove: [0],
  //     creatorEmail: [''],
  //     attachments: [[], Validators.required],
  //     requestApprovals: this._formBuilder.array([]),
  //   });
  // }

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
    });
  }

  private fetchUsers() {
    this.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.availableUsers.set([...users].sort((a, b) => a.id - b.id)); // Clone the list of available users
    });
  }

  // private loadInitialData() {
  //   this.getUsers().subscribe(() => {
  //     this.setupInitialFilteredOptions();
  //     // this.handleUserFiltration();
  //   });
  //   this.populateCustomSLA();
  //   this.getCategories();
  // }

  // private setupInitialFilteredOptions() {
  //   // Setup filtered options for each approval step
  //   this.addNewStep();
  //   this.requestApprovalsGetter.controls.forEach((control, index) => {
  //     this.manageUserNameControl(index);
  //     // this.handleUserFiltration();
  //   });
  // }

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

  private resetFormWithValue(data: Report) {
    console.log('Data report:', data);
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
      });

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

      console.log('Form Controls:', this.form.controls);
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        console.log(
          `Control: ${key}, Status: ${control?.status}, Errors: ${control?.errors}, value: ${control?.value}`
        );
      });
    });
  }

  private resetFormWithValueForEditStep(data: ReportDetails) {
    console.log('El resetFormWithValueForEditStep data:', data);
    this.form.patchValue({
      reportName: data.reportName,
      description: data.description,
      requestCategoryId: data.requestCategory.id,
      needMoreDataFromCreator: !!data.creatorEmail,
      creatorEmail: data.creatorEmail || '',
      slaDurationInDays: data.requestCategory.slaDuration || 0,
      attachments: data.attachments.map((attachment) => attachment.id),
      initiatorShouldApprove: data.initiatorShouldApprove,
      // attachments: data.attachments,
    });

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.enable();
      // console.log(
      //   `Control: ${key}, Status: ${control?.status}, Errors: ${control?.errors}, value: ${control?.value}`
      // );
    });

    if (data.creatorEmail) {
      this.selectedUsers.push({
        index: 0,
        userEmail: data.creatorEmail,
      });
    }

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
    console.log('requestApprovalsFormArray is :', requestApprovalsFormArray);
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
    const availableUsers: User[] = [...this.availableUsers()];

    console.log('availableUsers const :', availableUsers);

    const userEmail = this.selectedUsers.find(
      (user) => user.index === index
    )?.userEmail;

    const user = this.users.find((user) => user.email === userEmail);
    if (user) {
      availableUsers.push(user);
    }

    console.log('userEmail is :', userEmail);
    console.log('user is :', user);

    return availableUsers;
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
    // this.approvers = this.creators.filter((a: User) => a.email !== selectedValue);
    // Find and remove the selected value from the FormArray
    // this.requestApprovalsGetter.controls.forEach((control, index) => {
    //   if (control.get('username')?.value === selectedValue) {
    //     this.requestApprovalsGetter.removeAt(index);
    //   }
    // });
    // this.selectedOptions = this.selectedOptions.filter((s) => s !== selectedValue);
    // this.updateFilteredOptions();
    this.refetchAvailableUsers(0);
    this.customDropdownSelectionChange(value, 0);
  }
  onSubmit() {
    // console.log('Form Controls:', this.form.controls);
    // Object.keys(this.form.controls).forEach((key) => {
    //   const control = this.form.get(key);
    //   console.log(
    //     `Control: ${key}, Status: ${control?.status}, Errors: ${control?.errors}, value: ${control?.value}`
    //   );
    // });

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
      this.router.navigate(['../'], { relativeTo: this.route });
    };

    const handleError = () => {
      this.toastr.error('An error occurred while processing your request.');
      this.isSubmitLoading = false;
    };

    if (this.paramsMode === 'edit_report_step') {
      console.log('Req Approvals', this.form.get('requestApprovals')?.value);
      console.log('form before submission is :', this.form.value);

      const params: RequestTaskAttributes = {
        requestParams: [
          { name: 'delete', value: false },
          { name: 'report_name', value: this.form.get('reportName')?.value },
          { name: 'description', value: this.form.get('description')?.value },
          {
            name: 'attachments',
            value: this.idsJoinerWithNoExtraction(this.form.get('attachments')?.value),
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

  private idsJoiner(arrOfObjs: { id: string }[]) {
    console.log('Got this arr of ids:', arrOfObjs);
    const newArr = arrOfObjs.map((x) => x.id);
    const final = newArr.join('@#%@#%Z%#@%#@');
    return final;
  }

  private idsJoinerWithNoExtraction(arrOfNums: number[]) {
    console.log('Got this arr of ids:', arrOfNums);
    const final = arrOfNums.join('@#%@#%Z%#@%#@');
    return final;
  }

  private usernamesJoiner(arrOfObjs: { username: string }[]) {
    console.log('Got this arr of username:', arrOfObjs);
    const newArr = arrOfObjs.map((x) => x.username);
    return newArr.join('@#%@#%Z%#@%#@');
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        console.log('control instanceof FormControl:', control);
        control.markAsTouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        console.log('control instanceof FormGroup:', control);
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
      console.log('Populating categories from parent:', this.categories());
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
  handleUploadClick(event: MouseEvent): void {
    if (this.isUploaderLoader) {
      event.preventDefault(); // Prevent the file dialog from opening
      console.log('File selection prevented because uploader is not ready.');
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
                ?.setValue(this.uploadedFiles.value.map(({ id }) => ({ id })));
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
    console.log(file);
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

  // removeStep(index: number) {
  //   this.requestApprovalsGetter.removeAt(index);
  //   this.selectedOptions.splice(index, 1);
  //   this.updateFilteredOptions();
  // }

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

  // onSelectionChange(option: string, index: number) {
  //   this.selectedOptions[index] = option.toLowerCase();
  //   this.updateFilteredOptions();
  //   this.handleUserFiltration();
  // }

  onSelectionChange(option: string) {
    // Update filteredUsers based on the selected option
    // Assuming you want to add the selected user to filteredUsers
    // if (!this.filteredUsers.some((user) => user.email === option.email)) {
    //   this.filteredUsers.push(option);
    // }
    // Call the handleUserFiltration method to update available users
    // console.log('user before filter:', option);
    // const user = this.users.find((user) => user.email === option);
    // this.handleUserFiltration(user);
  }

  // customDropdownSelectionChange(user: User) {
  //   this.handleUserFiltration(user);
  // }

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

  removeStep(item: FormGroup, index: number) {
    this.refetchAvailableUsers(index);
    // const removedUser = this.users.find(user => user.email === username);
    // console.log("removedUser", removedUser)

    // if (removedUser ) {
    //   this.availableUsers.set([...this.availableUsers(), removedUser]);
    //   console.log("this avails", this.availableUsers)
    // }

    this.requestApprovalsGetter.removeAt(index - 1);
    console.log('available users:', this.availableUsers());
    console.log('index:', index);
  }

  refetchAvailableUsers(index: number) {
    const selected = this.selectedUsers.find((user) => user.index === index);

    if (selected) {
      const selectedUser = this.users.find(
        (user) => user.email === selected.userEmail
      );
      if (selectedUser) {
        this.availableUsers.set(
          [...this.availableUsers(), selectedUser].sort((a, b) => a.id - b.id)
        );
      }

      const indexOfRemoval = this.selectedUsers.findIndex(
        (element) => selected.userEmail === element.userEmail
      );

      this.selectedUsers.splice(indexOfRemoval, 1);

      this.selectedUsers = this.selectedUsers.map((element) => {
        if (element.index > selected.index) {
          return { ...element, index: element.index - 1 };
        } else {
          return element;
        }
      });
    }
  }

  private updateFilteredOptions() {
    this.selectedOptions.forEach((_, i) => {
      this.manageUserNameControl(i);
    });
  }
}
