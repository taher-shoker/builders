import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { HttpParams } from '@angular/common/http';
import { DialogService } from '@stc-apps/shared-ui';
import {
  Role,
  Team,
  User,
  UserGroup,
} from '../../../../shared/models/users-settings.model';
import { UsersService } from '../../users.service';

@Component({
  selector: 'stc-apps-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() isEditing!: boolean;
  @Input() data!: User;

  form!: FormGroup;
  privilages: Role[] = [];
  teams: Team[] = [];
  allUsers: User[] = [];
  userDelegate: User[] = [];
  selectedPrivilege!: Role;
  selectedTeam!: { id: number; name: string };
  selectedDelegates: any;
  selectedGroup: number[] = [];
  addGroups = false;
  showInputs = true;
  hideDropdown = false;
  userTeam = '';
  userId = 0;
  isSubmitLoader = false;

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    const attributeOpenValue =
      this.el.nativeElement.getAttribute('attribute-open');
    if (target.className === 'stc-modal' && attributeOpenValue !== 'true') {
      const clickedInside = this.el.nativeElement.contains(target);
      if (!clickedInside) {
        this.dialogService.close();
        this.router.navigate(['./users-setting']);
      }
    }
  }
  constructor(
    private formBuilder: FormBuilder,
    protected router: Router,
    public userService: UsersService,
    private toastr: ToastrService,
    protected dialogService: DialogService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.initializeUserForm();
    if (!this.isEditing) {
      this.disableFields();
      this.showInputs = false;
    }
    this.handleGrouping();
    this.getusersList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;
      if (this.data) {
        this.restFormWithValue(this.data);
      }
    }
  }
  private noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  initializeUserForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      jobTitle: ['', [Validators.required, this.noWhitespaceValidator]],
      userGroups: [
        '',
        this.userService.getCurrentSystem() === 'DI_Management'
          ? Validators.nullValidator
          : Validators.required,
      ],
      teamDto: [
        [],
        this.userService.getCurrentSystem() === 'Dynamic_Report_Flow'
          ? Validators.nullValidator
          : Validators.required,
      ],
      userDelegates: [[]],
      viewer: [''],
      editor: [''],
      pmo: [''],
    });
  }

  // Getter for viewerControl
  get viewerControl(): AbstractControl | null {
    return this.form.get('viewer');
  }
  // Getter for editorControl
  get editorControl(): AbstractControl | null {
    return this.form.get('editor');
  }

  // Getter for pmoControl
  get pmoControl(): AbstractControl | null {
    return this.form.get('pmo');
  }

  onSubmit() {
    if (this.form.valid) {
      let dataForm;
      this.isSubmitLoader = true;
      // Check the current system
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        dataForm = {
          userGroups: [{ id: this.form.get('userGroups')?.value.id }],
          teams: this.form.get('teamDto')?.value.map((e: number) => {
            return { id: e };
          }),
          email: this.form.get('email')?.value,
          name: this.form.get('name')?.value,
          jobTitle: this.form.get('jobTitle')?.value,
        };
        if (this.viewerControl?.value) {
          const viewerObj = this.userService
            .getRoles()
            .filter((r) => r.groupName === 'DT_VP_Dashboard_Viewer')[0];
          dataForm.userGroups.push({ id: viewerObj.id });
          if (this.editorControl?.value) {
            const editorObj = this.userService
              .getRoles()
              .filter((r) => r.groupName === 'DT_VP_Dashboard_Editor')[0];
            dataForm.userGroups.push({ id: editorObj.id });
          }
          if (this.pmoControl?.value) {
            const pmoObj = this.userService
              .getRoles()
              .filter((r) => r.groupName === 'PMO')[0];
            dataForm.userGroups.push({ id: pmoObj.id });
          }
        }
      } else if (
        this.userService.getCurrentSystem() === 'Dynamic_Report_Flow'
      ) {
        dataForm = {
          userGroups: [{ id: this.form.get('userGroups')?.value.id }],
          email: this.form.get('email')?.value,
          name: this.form.get('name')?.value,
          jobTitle: this.form.get('jobTitle')?.value,
          userDelegates: this.form.get('userDelegates')?.value?.email
            ? [
                {
                  delegateName: this.form.get('userDelegates')?.value.email,
                  systemName: this.userService.getCurrentSystem(),
                },
              ]
            : [],
        };
      } else {
        dataForm = {
          userGroups:
            this.userService.getCurrentSystem() === 'DI_Management'
              ? this.form
                  .get('teamDto')
                  ?.value.map((g: { id: number; name: string }) => ({ id: g }))
              : [{ id: this.form.get('teamDto')?.value.id }],
          email: this.form.get('email')?.value,
          name: this.form.get('name')?.value,
          jobTitle: this.form.get('jobTitle')?.value,
        };
      }

      const onSuccess = (message: string) => {
        this.isSubmitLoader = false;
        this.toastr.success(message);
        this.form.reset();
        this.router.navigate(['./users-setting']);
      };

      const handleError = (error: unknown) => {
        this.isSubmitLoader = false;
        console.error('Error:', error);
      };

      if (this.isEditing) {
        this.updateUser(
          { id: this.data.id, ...dataForm },
          onSuccess,
          handleError
        );
      } else if (this.addGroups) {
        let queryParams = new HttpParams();

        if (this.userService.getCurrentSystem() === 'DI_Milestones') {
          if (this.form.get('teamDto')?.value?.length > 0) {
            queryParams = queryParams.set(
              'teamId',
              this.form.get('teamDto')?.value
            );
          }
        }
        this.userService
          .addUserGroup(
            this.userId,
            this.userService.getCurrentSystem() === 'DI_Milestones' ||
              this.userService.getCurrentSystem() === 'Dynamic_Report_Flow'
              ? this.form.get('userGroups')?.value.id
              : this.form.get('teamDto')?.value,
            {},
            queryParams
          )
          .subscribe(() => {
            const email = this.form.get('userDelegates')?.value?.email;

            if (email) {
              this.updateUserDelegate(email);
            }
            onSuccess('User Group is added successfully');
          }, handleError);
      } else {
        this.createUser(dataForm, onSuccess, handleError);
      }
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  /**
   * Updates the user.
   */
  updateUser(
    dataForm: any,
    onSuccess: (message: string) => void,
    handleError: (error: unknown) => void
  ) {
    this.userService
      .updateUser({ id: this.data.id, ...dataForm })
      .subscribe(() => onSuccess('User is edited successfully'), handleError);
  }
  /**
   * Updates the user Delegate.
   */
  updateUserDelegate(value: string) {
    if (this.addGroups) {
      const delegates = [value];
      this.userService
        .updateUserDelegate(this.userId, delegates)
        .subscribe((res) => {
          if (!res) {
            return;
          }
          // Additional logic can be added here if needed
        });
    }
  }

  /**
   * Creates user.
   */
  createUser(
    dataForm: any,
    onSuccess: (message: string) => void,
    handleError: (error: unknown) => void
  ) {
    this.userService
      .createUser(dataForm)
      .subscribe(() => onSuccess('User is added successfully'), handleError);
  }

  /**
   * Marks all form fields as touched.
   */
  markFormFieldsAsTouched() {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
  getRoles() {
    this.privilages = this.userService
      .getRoles()
      .filter(
        (r) =>
          r.groupName !== 'DT_VP_Dashboard_Viewer' &&
          r.groupName !== 'DT_VP_Dashboard_Editor' &&
          r.groupName !== 'PMO'
      );
    if (this.data) {
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        this.selectedPrivilege = this.privilages.filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.id
        )[0];
      } else if (this.userService.getCurrentSystem() === 'DI_Management') {
        this.selectedPrivilege = this.privilages.filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.roles[0].id
        )[0];
      } else {
        this.selectedPrivilege = this.privilages.filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.id
        )[0];
      }
    }
  }

  /**
   * Checks the system name for the given user groups
   * @param groups - Array of user groups
   * @returns the user group matching the current system name
   */
  checkSystem(groups: UserGroup[]) {
    return groups.find((group: UserGroup) => {
      return group.roles.some(
        (role: {
          id: number;
          roleName: string;
          system: { id: number; name: string };
        }) => {
          return role.system.name === this.userService.getCurrentSystem();
        }
      );
    });
  }
  /**
   * Fetches teams based on the user group
   * @param userGroup - The user group to filter teams
   */
  getTeams(userGroup: UserGroup) {
    this.teams =
      this.userService.getCurrentSystem() === 'DI_Milestones'
        ? this.userService.allTeams
        : this.userService
            .getTeams()
            .filter((x) => x.roleName == userGroup?.roles[0].roleName);

    if (this.data) {
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        if (this.data?.teams && this.data.teams.length > 0) {
          this.selectedGroup = this.data.teams.map(
            (t: { name: string; id: number }) => t.id
          );
        } else if (this.data.userGroups[0].groupName === 'DT_Director') {
          this.hideDropdown = true;
          this.form.get('teamDto')?.setValidators(null);
          this.form.get('teamDto')?.updateValueAndValidity();
        }
      } else if (this.userService.getCurrentSystem() === 'DI_Management') {
        this.teams = this.userService
          .getTeams()
          .filter(
            (s) =>
              s.roleName ===
              this.checkSystem(this.data.userGroups)?.roles[0].roleName
          );
      } else if (
        this.userService.getCurrentSystem() === 'Dynamic_Report_Flow' &&
        this.data?.userDelegates
      ) {
        const delegateEmail = this.data?.userDelegates?.[0]?.delegateName ?? '';
        this.selectedDelegates = this.allUsers.find(
          (p: User) => p.email === delegateEmail
        );
      } else {
        this.selectedTeam = this.teams.filter(
          (p: Team) => p.id === this.data?.userGroups[0].id
        )[0];
      }
    }
  }

  cancel() {
    this.router.navigate(['./users-setting']);
  }

  handleTeam(value: Role) {
    if (this.userService.getCurrentSystem() === 'DI_Milestones') {
      this.form.get('viewer')?.enable();
      this.form.get('viewer')?.setValue(false);
      this.form.get('teamDto')?.setValue([]);
      if (value.groupName === 'DT_Director') {
        this.hideDropdown = true;
        this.form.get('teamDto')?.setValidators(null);
        this.form.get('teamDto')?.updateValueAndValidity();
      } else {
        this.checkDtUserPermissions(value.groupName);
        this.hideDropdown = false;
        this.teams = this.userService.allTeams;
      }
    } else {
      this.form?.get('teamDto')?.setValue('');
      this.teams = this.userService
        .getTeams()
        .filter((x) => x.roleName == value.groupName);
    }
  }

  checkUserExist() {
    if (!this.form.get('email')?.errors) {
      this.showInputs = true;
      this.userService
        .getUserByUserName(this.form.get('email')?.value)
        .subscribe(
          (res) => {
            if (res.userGroups.length > 0) {
              this.dialogService.open('alert-modal');
            }
            this.addGroups = true;
            this.userId = res?.id || 0;
            this.restFormWithValue(res);
            this.enableFields();
          },
          () => {
            this.form?.get('name')?.enable();
            this.form?.get('jobTitle')?.enable();
            this.enableFields();
          }
        );
    }
  }

  checkDtUserPermissions(value: string) {
    if (value === 'DT_User') {
      this.form.get('viewer')?.setValue(true);
      this.form.get('editor')?.setValue(false);
      this.form.get('pmo')?.setValue(false);
    }
  }
  oncheckBoxSelect(ele: { name: string; value: boolean }) {
    if (ele.value) {
      this.viewerControl?.setValue(true);
      this.viewerControl?.disable();
    } else if (!this.editorControl?.value && !this.pmoControl?.value) {
      this.viewerControl?.setValue(false);
      this.viewerControl?.enable();
    }
  }

  keyDownFunction(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.checkUserExist();
    }
  }
  restFormWithValue(data: User) {
    if (!this.addGroups) {
      this.getTeams(data?.userGroups[0]);
      if (this.userService.getCurrentSystem() === 'DI_Management') {
        this.selectedGroup = this.data.userGroups
          .filter((s) => s.roles[0].system.name === 'DI_Management')
          .map((group: UserGroup) => group.id);
        this.selectedGroup = this.data.userGroups.map(
          (group: UserGroup) => group.id
        );
      } else if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        this.handleDI_Milestones();
      }
    }

    this.form?.get('email')?.setValue(data?.email);
    this.form?.get('email')?.disable();
    this.form?.get('name')?.setValue(data.name);
    this.form?.get('name')?.disable();
    this.form?.get('jobTitle')?.setValue(data.jobTitle);
  }

  /**
   * Handle data when current sys is 'DI_Milestones'
   */
  handleDI_Milestones() {
    if (this.data.userGroups.length > 1) {
      this.form?.get('viewer')?.setValue(true);

      // If user group contains DT_VP_Dashboard_Editor role, set editor to true
      if (
        this.searchGroupByName(this.data.userGroups, 'DT_VP_Dashboard_Editor')
          ?.groupName === 'DT_VP_Dashboard_Editor'
      ) {
        this.form?.get('editor')?.setValue(true);
        this.form?.get('viewer')?.disable();
      }

      // If user group contains PMO role, set pmo to true
      if (
        this.searchGroupByName(this.data.userGroups, 'PMO')?.groupName === 'PMO'
      ) {
        this.form?.get('pmo')?.setValue(true);
        this.form?.get('viewer')?.disable();
      }
    }
  }
  searchGroupByName(groups: UserGroup[], groupName: string) {
    return groups.find((group) => group.groupName === groupName);
  }
  disableFields() {
    this.form?.get('name')?.disable();
    this.form?.get('jobTitle')?.disable();
    this.form?.get('teamDto')?.disable();
    this.form?.get('userGroups')?.disable();
  }
  enableFields() {
    this.form?.get('teamDto')?.enable();
    this.form?.get('userGroups')?.enable();
  }

  handleGrouping() {
    this.userService.getAllTeams().subscribe((res) => {
      this.userService.allTeams = res;
    });
    this.userService.getGroups().subscribe((res: UserGroup[]) => {
      if (res) {
        this.userService.getGroups().subscribe((res: UserGroup[]) => {
          if (res) {
            this.userService.allGroups = res;
            this.getTeams(this.data?.userGroups[0]);
            this.getRoles();
          }
        });

        if (this.data) {
          this.selectedGroup = this.data.userGroups.map(
            (group: UserGroup) => group.id
          );
        }
      }
    });
  }
  getusersList() {
    this.userService.getUsers().subscribe((res) => {
      this.allUsers = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );

      if (this.isEditing && this.data) {
        this.userDelegate = this.allUsers.filter(
          (l) => l.email !== this.data?.email
        );
      } else {
        this.userDelegate = this.allUsers;
      }
    });
  }
}
