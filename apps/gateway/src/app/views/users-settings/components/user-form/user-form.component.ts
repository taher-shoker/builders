import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal,
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

import { DialogService } from '@stc-apps/shared-ui';
import { forkJoin } from 'rxjs';
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
  // privilages: Role[] = [];
  privilages: WritableSignal<any[]> = signal([]);

  teams: Team[] = [];
  allUsers: User[] = [];
  userDelegate: any[] = [];
  selectedPrivilege!: Role;
  selectedTeam!: { id: number; name: string };
  selectedDelegates: any;
  selectedGroup: number[] = [];
  addGroups = false;
  showInputs = true;
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
    private el: ElementRef,
    private cdr: ChangeDetectorRef
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
        this.userService.getCurrentSystem() === 'Dynamic_Report_Flow' ||
        this.userService.getCurrentSystem() ===
          'Business_Excellence_Dashboard' ||
        this.userService.getCurrentSystem() === 'Strategic_Dashboard'
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

  // onSubmit() {
  //   if (this.form.valid) {
  //     let dataForm;
  //     this.isSubmitLoader = true;
  //     // Check the current system
  //     if (this.userService.getCurrentSystem() === 'DI_Milestones') {
  //       dataForm = {
  //         userGroups: [{ id: this.form.get('userGroups')?.value.id }],
  //         teams: this.form.get('teamDto')?.value.map((e: number) => {
  //           return { id: e };
  //         }),
  //         email: this.form.get('email')?.value,
  //         name: this.form.get('name')?.value,
  //         jobTitle: this.form.get('jobTitle')?.value,
  //       };
  //       if (this.viewerControl?.value) {
  //         const viewerObj = this.userService
  //           .getRoles()
  //           .filter((r) => r.groupName === 'DT_VP_Dashboard_Viewer')[0];
  //         dataForm.userGroups.push({ id: viewerObj.id });
  //         if (this.editorControl?.value) {
  //           const editorObj = this.userService
  //             .getRoles()
  //             .filter((r) => r.groupName === 'DT_VP_Dashboard_Editor')[0];
  //           dataForm.userGroups.push({ id: editorObj.id });
  //         }
  //         if (this.pmoControl?.value) {
  //           const pmoObj = this.userService
  //             .getRoles()
  //             .filter((r) => r.groupName === 'PMO')[0];
  //           dataForm.userGroups.push({ id: pmoObj.id });
  //         }
  //       }
  //     } else if (
  //       this.userService.getCurrentSystem() === 'Dynamic_Report_Flow'
  //     ) {
  //       console.log(this.form.get('userDelegates')?.value);
  //       dataForm = {
  //         userGroups: [{ id: this.form.get('userGroups')?.value.id }],
  //         email: this.form.get('email')?.value,
  //         name: this.form.get('name')?.value,
  //         jobTitle: this.form.get('jobTitle')?.value,
  //         userDelegates:
  //           this.form.get('userDelegates')?.value &&
  //           this.form.get('userDelegates')?.value.length > 0
  //             ? [
  //                 {
  //                   delegateName: this.form.get('userDelegates')?.value,
  //                   systemName: this.userService.getCurrentSystem(),
  //                 },
  //               ]
  //             : [],
  //       };
  //     } else if (this.userService.getCurrentSystem() === 'DI_Management') {
  //       dataForm = {
  //         userGroups: this.form
  //           .get('teamDto')
  //           ?.value.map((g: { id: number; name: string }) => ({ id: g })),
  //         email: this.form.get('email')?.value,
  //         name: this.form.get('name')?.value,
  //         jobTitle: this.form.get('jobTitle')?.value,
  //       };
  //     } else if (
  //       this.userService.getCurrentSystem() === 'Score_Card_Report_DB'
  //     ) {
  //       dataForm = {
  //         userGroups: [{ id: this.form.get('userGroups')?.value.id }],
  //         teams: this.form.get('teamDto')?.value.map((e: number) => {
  //           return { id: e };
  //         }),
  //         email: this.form.get('email')?.value,
  //         name: this.form.get('name')?.value,
  //         jobTitle: this.form.get('jobTitle')?.value,
  //       };
  //     } else {
  //       dataForm = {
  //         userGroups: [{ id: this.form.get('teamDto')?.value.id }],
  //         email: this.form.get('email')?.value,
  //         name: this.form.get('name')?.value,
  //         jobTitle: this.form.get('jobTitle')?.value,
  //       };
  //     }

  //     const onSuccess = (message: string) => {
  //       this.isSubmitLoader = false;
  //       this.toastr.success(message);
  //       this.form.reset();
  //       this.router.navigate(['./users-setting']);
  //     };

  //     const handleError = (error: unknown) => {
  //       this.isSubmitLoader = false;
  //       console.error('Error:', error);
  //     };

  //     if (this.isEditing) {
  //       this.updateUser(
  //         { id: this.data.id, ...dataForm },
  //         onSuccess,
  //         handleError
  //       );
  //     } else if (this.addGroups) {
  //       let data = {
  //         id: this.userId,
  //         userGroups: [{ id: this.form.get('userGroups')?.value.id }],
  //         teams: [{ id: this.form.get('teamDto')?.value.id }],
  //       };

  //       const currentSystem = this.userService.getCurrentSystem();
  //       const teamDtoValue = this.form
  //         .get('teamDto')
  //         ?.value.map((t: number) => ({
  //           id: t,
  //         }));
  //       if (currentSystem === 'Score_Card_Report_DB') {
  //         if (teamDtoValue?.length > 0) {
  //           data = {
  //             ...data,
  //             teams: teamDtoValue,
  //           };
  //         }
  //       } else if (currentSystem === 'DI_Milestones') {
  //         if (teamDtoValue?.length > 0) {
  //           data = {
  //             ...data,
  //             teams: teamDtoValue,
  //             userGroups: [{ id: this.form.get('userGroups')?.value.id }],
  //           };
  //           if (this.viewerControl?.value) {
  //             const viewerObj = this.userService
  //               .getRoles()
  //               .filter((r) => r.groupName === 'DT_VP_Dashboard_Viewer')[0];
  //             dataForm.userGroups.push({ id: viewerObj.id });
  //             if (this.editorControl?.value) {
  //               const editorObj = this.userService
  //                 .getRoles()
  //                 .filter((r) => r.groupName === 'DT_VP_Dashboard_Editor')[0];
  //               dataForm.userGroups.push({ id: editorObj.id });
  //             }
  //             if (this.pmoControl?.value) {
  //               const pmoObj = this.userService
  //                 .getRoles()
  //                 .filter((r) => r.groupName === 'PMO')[0];
  //               dataForm.userGroups.push({ id: pmoObj.id });
  //             }
  //           }
  //         }
  //       } else if (
  //         currentSystem === 'DI_Management' ||
  //         currentSystem === 'FRAUD_ManagementUsers'
  //       ) {
  //         data = {
  //           id: this.userId,
  //           userGroups: [{ id: this.form.get('teamDto')?.value.id }],
  //           teams: [],
  //         };
  //       }
  //       this.userService.addUserGroup(data).subscribe(() => {
  //         const email = this.form.get('userDelegates')?.value;
  //         if (email) {
  //           this.updateUserDelegate(email);
  //         }
  //         onSuccess('User Group is added successfully');
  //       }, handleError);
  //     } else {
  //       this.createUser(dataForm, onSuccess, handleError);
  //     }
  //   } else {
  //     this.markFormFieldsAsTouched();
  //   }
  // }
  onSubmit() {
    if (!this.form.valid) {
      this.markFormFieldsAsTouched();
      return;
    }

    let dataForm;
    this.isSubmitLoader = true;
    const currentSystem = this.userService.getCurrentSystem();
    const userGroups = [{ id: this.form.get('userGroups')?.value.id }];
    const teamDtoControl = this.form.get('teamDto')?.value;
    const teams = Array.isArray(teamDtoControl)
      ? this.form.get('teamDto')?.value?.map((e: number) => ({ id: e }))
      : [{ id: this.form.get('teamDto')?.value?.id }];
    const email = this.form.get('email')?.value;
    const name = this.form.get('name')?.value;
    const jobTitle = this.form.get('jobTitle')?.value;

    if (currentSystem === 'DI_Milestones') {
      dataForm = { userGroups, teams, email, name, jobTitle };
      if (this.viewerControl?.value) {
        const viewerObj = this.userService
          .getRoles()
          .find((r) => r.groupName === 'DT_VP_Dashboard_Viewer');
        viewerObj && dataForm.userGroups.push({ id: viewerObj.id });
      }
      if (this.editorControl?.value) {
        const editorObj = this.userService
          .getRoles()
          .find((r) => r.groupName === 'DT_VP_Dashboard_Editor');
        editorObj && dataForm.userGroups.push({ id: editorObj.id });
      }
      if (this.pmoControl?.value) {
        const pmoObj = this.userService
          .getRoles()
          .find((r) => r.groupName === 'PMO');
        pmoObj && dataForm.userGroups.push({ id: pmoObj.id });
      }
    } else if (currentSystem === 'Dynamic_Report_Flow') {
      const userDelegates = this.form.get('userDelegates')?.value || [];
      dataForm = {
        userGroups,
        email,
        name,
        jobTitle,
        userDelegates: userDelegates.length
          ? [{ delegateName: userDelegates, systemName: currentSystem }]
          : [],
      };
    } else if (currentSystem === 'DI_Management') {
      dataForm = { userGroups: teams, email, name, jobTitle };
    } else if (currentSystem === 'Score_Card_Report_DB') {
      dataForm = { userGroups, teams, email, name, jobTitle };
    } else if (currentSystem === 'Strategic_Dashboard') {
      dataForm = { userGroups, email, name, jobTitle };
    } else if (currentSystem === 'Business_Excellence_Dashboard') {
      dataForm = { userGroups, email, name, jobTitle };
    } else {
      dataForm = { userGroups: teams, email, name, jobTitle };
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
      let data = { id: this.userId, userGroups, teams };
      if (currentSystem === 'Score_Card_Report_DB' && teams?.length > 0) {
        data.teams = teams;
      }
      if (currentSystem === 'Strategic_Dashboard' && teams?.length > 0) {
        data.teams = null;
      }
      console.log(userGroups);

      if (
        currentSystem === 'Dynamic_Report_Flow' ||
        currentSystem === 'Business_Excellence_Dashboard'
      ) {
        data = { ...data, teams, userGroups };
        delete data.teams;
        // if (this.viewerControl?.value) {
        //   const viewerObj = this.userService
        //     .getRoles()
        //     .find((r) => r.groupName === 'DT_VP_Dashboard_Viewer');
        //   viewerObj && data.userGroups.push({ id: viewerObj.id });
        // } else if (this.editorControl?.value) {
        //   const editorObj = this.userService
        //     .getRoles()
        //     .find((r) => r.groupName === 'DT_VP_Dashboard_Editor');
        //   editorObj && data.userGroups.push({ id: editorObj.id });
        // } else if (this.pmoControl?.value) {
        //   const pmoObj = this.userService
        //     .getRoles()
        //     .find((r) => r.groupName === 'PMO');
        //   pmoObj && data.userGroups.push({ id: pmoObj.id });
        // }
      }
      if (currentSystem === 'DI_Management') {
        data = { ...data, userGroups: teams, teams: userGroups };
        delete data.teams;
      }
      this.userService.addUserGroup(data).subscribe(() => {
        const delegateEmail = this.form.get('userDelegates')?.value;
        if (delegateEmail) {
          this.updateUserDelegate(delegateEmail);
        }
        onSuccess('User Group is added successfully');
      }, handleError);
    } else {
      this.createUser(dataForm, onSuccess, handleError);
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
    const filteredRoles = this.userService
      .getRoles()
      .filter(
        (r) =>
          r.groupName !== 'DT_VP_Dashboard_Viewer' &&
          r.groupName !== 'DT_VP_Dashboard_Editor' &&
          r.groupName !== 'PMO'
      );

    if (
      this.userService.getCurrentSystem() === 'Business_Excellence_Dashboard'
    ) {
      this.privilages.set(
        this.userService.allGroups
          .filter((g) => g.roles[0].roleName !== 'ADMINS')
          .map((t) => {
            return { id: t.id, groupName: t.roles[0].roleName };
          })
      );
    } else {
      this.privilages.set(filteredRoles);
    }
    if (this.data) {
      const currentSystem = this.userService.getCurrentSystem();
      if (currentSystem === 'DI_Milestones') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.id
        )[0];
      } else if (currentSystem === 'DI_Management') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.roles[0].id
        )[0];
      } else if (currentSystem === 'Score_Card_Report_DB') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.id
        )[0];
      } else if (currentSystem === 'Strategic_Dashboard') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.id
        )[0];
      } else if (currentSystem === 'FRAUD_ManagementUsers') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.roles[0].id
        )[0];
      } else {
        this.selectedPrivilege = this.privilages().filter(
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
        }
      } else if (this.userService.getCurrentSystem() === 'DI_Management') {
        this.teams = this.userService
          .getTeams()
          .filter(
            (s) =>
              s.roleName ===
              this.checkSystem(this.data.userGroups)?.roles[0].roleName
          );
      }
      // else if (
      //   this.userService.getCurrentSystem() === 'Score_Card_Report_DB'
      // ) {
      //   this.teams = this.userService.getTeams();
      //   if (this.data?.teams && this.data.teams.length > 0) {
      //     this.selectedGroup = this.data.teams.map(
      //       (t: { name: string; id: number }) => t.id
      //     );
      //     this.form.get('teamDto')?.setValidators(null);
      //     this.form.get('teamDto')?.updateValueAndValidity();
      //   }
      // }
      else if (this.userService.getCurrentSystem() === 'Strategic_Dashboard') {
        this.teams = this.userService.getTeams();
        if (this.data?.teams && this.data.teams.length > 0) {
          this.selectedGroup = this.data.teams.map(
            (t: { name: string; id: number }) => t.id
          );
          this.form.get('teamDto')?.setValidators(null);
          this.form.get('teamDto')?.updateValueAndValidity();
        }
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
      this.checkDtUserPermissions(value.groupName);
      this.teams = this.userService.allTeams;
    } else if (this.userService.getCurrentSystem() === 'Score_Card_Report_DB') {
      this.teams = this.userService.getTeams();
    }
    // else if (this.userService.getCurrentSystem() === 'Strategic_Dashboard') {
    //   this.teams = this.userService.getTeams();
    // }
    else {
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
    this.getusersList();
    forkJoin([this.userService.getUsers()]).subscribe(() => {
      this.form.patchValue({
        email: data.email,
        name: data.name,
        jobTitle: data.jobTitle,
        userDelegates: this.data?.userDelegates?.[0]?.delegateName,
      });
    });

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
      } else if (
        this.userService.getCurrentSystem() === 'Score_Card_Report_DB'
      ) {
        this.form?.get('jobTitle')?.disable();
      } else if (
        this.userService.getCurrentSystem() === 'Strategic_Dashboard'
      ) {
        this.form?.get('jobTitle')?.disable();
      }
    }

    this.form?.get('email')?.disable();
    this.form?.get('name')?.disable();
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
      if (res) {
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
      }
    });
  }
  closeDialog() {
    this.dialogService.close();
    this.router.navigate(['/users-setting']);
  }
}
