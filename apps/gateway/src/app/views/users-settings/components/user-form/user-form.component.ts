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
  Page,
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
  pages!: Page[];
  filterPages!: Page[];
  selectedPage!: string[];
  teams: Team[] = [];
  allUsers: User[] = [];
  //userDelegate: any[] = [];
  userDelegate: WritableSignal<any[]> = signal([]);

  escaltionManager: WritableSignal<any[]> = signal([]);
  selectedPrivilege!: Role;
  selectedTeam!: { id: number; name: string };
  selectedDelegates: any;
  selectedGroup: number[] = [];
  selectedPages: any = [];
  addGroups = false;
  showInputs = true;
  userTeam = '';
  userId = 0;
  isSubmitLoader = false;
  private initializing = true;
  private dataReady = false;
  private rolesReady = false;
  private initialBindingDone = false;
  private rebindingPrivilege = false;
  private userSelectedPrivilege = false;

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
  ) {
    if (!this.form) {
      this.initializeUserForm();
    }
  }

  ngOnInit() {
    if (!this.form) {
      this.initializeUserForm();
    }
    if (!this.isEditing) {
      this.disableFields();
      this.showInputs = false;
    }
    this.handleGrouping();
    if (this.userService.getCurrentSystem() !== 'DI_Milestones') {
      this.getUsersList();
    }
    this.getAccessPages();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;
      if (!this.form) {
        this.initializeUserForm();
      }
      if (this.data && this.form) {
        this.restFormWithValue(this.data);
        this.dataReady = true;
        if (
          this.rolesReady &&
          !this.initialBindingDone &&
          !this.userSelectedPrivilege
        ) {
          this.getRoles();
          this.initialBindingDone = true;
        }
        if (this.data.pageAccess) {
          this.selectedPages = this.data.pageAccess.map((p: Page) => p.id);
        }
      }
    }
  }
  getAccessPages() {
    this.userService.getPages().subscribe((res) => {
      if (!res) return;
      this.pages = res;
      this.filterPages = res;
      if (this.data) {
        if (this.data.pageAccess) {
          this.handlePageAccess();
        }
      }
    });
  }
  private handlePageAccess(): void {
    const pageAccess = this.data?.pageAccess;
    const roleName = this.checkSystem(this.data.userGroups)?.roles?.[0]
      ?.roleName;
    const pageName = pageAccess?.[0]?.name;

    if (pageAccess?.length) {
      if (roleName === 'BE_PM' && pageName === 'Project Execution') {
        this.form.get('pageAccess')?.disable();
      }

      this.selectedPages = pageAccess.map((p: Page) => p.id);
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
        this.userService.getCurrentSystem() === 'ChatBI' ||
        this.userService.getCurrentSystem() === 'Strategic_Dashboard' ||
        this.userService.getCurrentSystem() === 'TU_BRAIN' ||
        this.userService.getCurrentSystem() === 'FNI_Nokia'
          ? Validators.nullValidator
          : Validators.required,
      ],
      userDelegates: [[]],
      manager: [{}],
      viewer: [false],
      editor: [false],
      DT_Governance_Approver: [false],
      ticketAdmin: [false],
      edit_delete: [false],
      pageAccess: [
        '',
        this.userService.getCurrentSystem() === 'Business_Excellence_Dashboard'
          ? Validators.required
          : Validators.nullValidator,
      ],
    });
  }

  // handleUserDelegate(item: any) {
  //   this.escaltionManager.update((managers) =>
  //     managers.filter((manager) => manager.email !== item.email)
  //   );
  // }
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
    return this.form.get('DT_Governance_Approver');
  }

  get ticketAdminControl(): AbstractControl | null {
    return this.form.get('ticketAdmin');
  }
  get dtUserEdit_Delete_Control(): AbstractControl | null {
    return this.form.get('edit_delete');
  }
  get groupName(): string | null {
    return this.form?.get('userGroups')?.value?.groupName ?? null;
  }

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
    const pageAccess =
      this.form.get('pageAccess')?.value.length > 0
        ? this.form.get('pageAccess')?.value.map((p: number) => {
            return { id: p };
          })
        : [];

    if (currentSystem === 'DI_Milestones') {
      dataForm = { userGroups, teams, email, name, jobTitle };
      if (this.viewerControl?.value) {
        const viewerObj = this.userService
          .getRoles()
          .find((r) => r.groupName === 'VP_VIEWER');
        viewerObj && dataForm.userGroups.push({ id: viewerObj.id });
      }
      if (this.editorControl?.value) {
        const editorObj = this.userService
          .getRoles()
          .find((r) => r.groupName === 'VP_EDITOR');
        editorObj && dataForm.userGroups.push({ id: editorObj.id });
      }
      if (this.pmoControl?.value) {
        const pmoObj = this.userService
          .getRoles()
          .find((r) => r.groupName === 'DT_Governance_Approver');
        pmoObj && dataForm.userGroups.push({ id: pmoObj.id });
      }
      if (this.ticketAdminControl?.value) {
        const ticketAdminObj = this.userService
          .getRoles()
          .find((r) => r.groupName === 'TICKET_ADMIN');

        ticketAdminObj && dataForm.userGroups.push({ id: ticketAdminObj.id });
      }

      if (this.dtUserEdit_Delete_Control?.value) {
        const dtUserEdit_DeleteObj = this.userService
          .getRoles()
          .find((r) => r.groupName === 'DT_User_Edit_Delete');

        dtUserEdit_DeleteObj &&
          dataForm.userGroups.push({ id: dtUserEdit_DeleteObj.id });
      }
    } else if (currentSystem === 'Dynamic_Report_Flow') {
      const userDelegates = this.form.get('userDelegates')?.value || [];
      const UserEscaltion = this.form.get('manager')?.value || 0;
      dataForm = {
        userGroups,
        email,
        name,
        jobTitle,
        userDelegates: userDelegates.length
          ? [{ delegateName: userDelegates, systemName: currentSystem }]
          : [],
        manager: UserEscaltion > 0 ? { id: UserEscaltion } : null,
      };
    } else if (currentSystem === 'DI_Management') {
      dataForm = { userGroups: teams, email, name, jobTitle };
    } else if (currentSystem === 'Score_Card_Report_DB') {
      dataForm = { userGroups, teams, email, name, jobTitle };
    } else if (currentSystem === 'Strategic_Dashboard') {
      dataForm = { userGroups, email, name, jobTitle };
    } else if (currentSystem === 'Business_Excellence_Dashboard') {
      dataForm = { userGroups, email, name, jobTitle, pageAccess };
    } else if (
      currentSystem === 'ChatBI' ||
      currentSystem === 'TU_BRAIN' ||
      currentSystem === 'FNI_Nokia'
    ) {
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
      const baseData = { id: this.userId, userGroups, teams };
      let data: any;

      switch (currentSystem) {
        case 'Score_Card_Report_DB':
          data = { ...baseData, teams: teams?.length > 0 ? teams : undefined };
          break;

        case 'Strategic_Dashboard':
          data = { ...baseData, teams: null };
          break;

        case 'Dynamic_Report_Flow':
        case 'ChatBI':
        case 'TU_BRAIN':
        case 'FNI_Nokia':
          data = { ...baseData, userGroups }; // omit teams directly
          break;

        case 'Business_Excellence_Dashboard':
          data = {
            ...baseData,
            userGroups: userGroups,
            pageAccess,
          };
          delete data.teams; // optional if you want to guarantee no teams
          break;

        case 'DI_Management':
          data = { ...baseData, userGroups: teams, teams: userGroups };
          delete data.teams;
          break;

        default:
          data = baseData;
      }

      this.userService.addUserGroup(data).subscribe(() => {
        const delegateEmail = this.form.get('userDelegates')?.value;
        if (delegateEmail) {
          this.updateUserDelegate(delegateEmail);
        }

        const escaltionManager = this.form.get('manager')?.value;
        if (escaltionManager) {
          this.updateUserEscalationManger({ id: escaltionManager });
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
  updateUserEscalationManger(data: any) {
    if (this.addGroups) {
      this.userService.updateUserManager(this.userId, data).subscribe((res) => {
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
          r.groupName !== 'VP_VIEWER' &&
          r.groupName !== 'VP_EDITOR' &&
          r.groupName !== 'DT_Governance_Approver' &&
          r.groupName !== 'TICKET_ADMIN' &&
          r.groupName !== 'DT_User_Edit_Delete'
      );

    if (filteredRoles.length >= 2) {
      const lastIndex = filteredRoles.length - 1;
      const secondLastIndex = filteredRoles.length - 2;
      // Swap the last two elements
      [filteredRoles[lastIndex], filteredRoles[secondLastIndex]] = [
        filteredRoles[secondLastIndex],
        filteredRoles[lastIndex],
      ];
    }

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
      if (this.userSelectedPrivilege) {
        this.initialBindingDone = true;
        return;
      }
      const currentSystem = this.userService.getCurrentSystem();
      if (currentSystem === 'DI_Milestones') {
        const options = this.privilages();
        const candidateIds = options.map((p) => p.id);
        const preferredOrder = [
          'DT_User',
          'DT_Director',
          'PMO',
          'DT_Governance',
          'DT_Executive',
        ];
        const preferredMatch = preferredOrder
          .map((name) => this.searchGroupByName(this.data.userGroups, name))
          .find((g) => g && candidateIds.includes(g.id));
        const fallbackMatch = this.data.userGroups.find(
          (g) =>
            g.roles?.some((r) => r.system?.name === currentSystem) &&
            candidateIds.includes(g.id)
        );
        const activeGroup = preferredMatch || fallbackMatch;
        this.selectedPrivilege = options.find((p) => p.id === activeGroup?.id);
        if (this.selectedPrivilege) {
          this.form
            .get('userGroups')
            ?.setValue(this.selectedPrivilege, { emitEvent: false });
          this.rebindingPrivilege = true;
          this.handleTeam(this.selectedPrivilege as unknown as Role);
          this.rebindingPrivilege = false;
        }
      } else if (currentSystem === 'DI_Management') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.roles[0].id
        )[0];
        if (this.selectedPrivilege) {
          this.form
            .get('userGroups')
            ?.setValue(this.selectedPrivilege, { emitEvent: false });
          this.rebindingPrivilege = true;
          this.handleTeam(this.selectedPrivilege as unknown as Role);
          this.rebindingPrivilege = false;
        }
      } else if (currentSystem === 'Score_Card_Report_DB') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.id
        )[0];
        if (this.selectedPrivilege) {
          this.form
            .get('userGroups')
            ?.setValue(this.selectedPrivilege, { emitEvent: false });
          this.rebindingPrivilege = true;
          this.handleTeam(this.selectedPrivilege as unknown as Role);
          this.rebindingPrivilege = false;
        }
      } else if (currentSystem === 'Strategic_Dashboard') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.id
        )[0];
        if (this.selectedPrivilege) {
          this.form
            .get('userGroups')
            ?.setValue(this.selectedPrivilege, { emitEvent: false });
          this.rebindingPrivilege = true;
          this.handleTeam(this.selectedPrivilege as unknown as Role);
          this.rebindingPrivilege = false;
        }
      } else if (currentSystem === 'FRAUD_ManagementUsers') {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.roles[0].id
        )[0];
        if (this.selectedPrivilege) {
          this.form
            .get('userGroups')
            ?.setValue(this.selectedPrivilege, { emitEvent: false });
          this.rebindingPrivilege = true;
          this.handleTeam(this.selectedPrivilege as unknown as Role);
          this.rebindingPrivilege = false;
        }
      } else {
        this.selectedPrivilege = this.privilages().filter(
          (p) => p.id === this.checkSystem(this.data.userGroups)?.id
        )[0];
        if (this.selectedPrivilege) {
          this.form
            .get('userGroups')
            ?.setValue(this.selectedPrivilege, { emitEvent: false });
          this.rebindingPrivilege = true;
          this.handleTeam(this.selectedPrivilege as unknown as Role);
          this.rebindingPrivilege = false;
        }
      }
    }
    if (this.data) {
      this.initialBindingDone = true;
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
          this.form
            .get('teamDto')
            ?.setValue(this.selectedGroup, { emitEvent: false });
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
          this.form
            .get('teamDto')
            ?.setValue(this.selectedGroup, { emitEvent: false });
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
            this.data = res;
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
      this.form.get('DT_Governance_Approver')?.setValue(false);
      this.form.get('ticketAdmin')?.setValue(false);
      this.form.get('edit_delete')?.setValue(false);
      this.cdr.detectChanges();
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
    if (!this.form) {
      return;
    }
    this.form.patchValue({
      email: data.email,
      name: data.name,
      jobTitle: data.jobTitle,
      userDelegates: this.data?.userDelegates?.[0]?.delegateName,
      manager: this.data?.manager?.id,
    });

    if (!this.addGroups) {
      this.getTeams(data?.userGroups[0]);
      if (this.userService.getCurrentSystem() === 'DI_Management') {
        this.selectedGroup = this.data.userGroups
          .filter((s) => s.roles[0].system.name === 'DI_Management')
          .map((group: UserGroup) => group.id);
        // this.selectedGroup = this.data.userGroups.map(
        //   (group: UserGroup) => group.id
        // );
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
      if (this.searchGroupByName(this.data.userGroups, 'VP_VIEWER')) {
        this.form?.get('viewer')?.setValue(true);
      }

      // If user group contains DT_VP_Dashboard_Editor role, set editor to true
      if (
        this.searchGroupByName(this.data.userGroups, 'VP_EDITOR')?.groupName ===
        'VP_EDITOR'
      ) {
        this.form?.get('editor')?.setValue(true);
        this.form?.get('viewer')?.disable();
      }

      // If user group contains PMO role, set pmo to true
      if (
        this.searchGroupByName(this.data.userGroups, 'DT_Governance_Approver')
          ?.groupName === 'DT_Governance_Approver'
      ) {
        this.form?.get('DT_Governance_Approver')?.setValue(true);
        this.form?.get('viewer')?.disable();
      }
      if (
        this.searchGroupByName(this.data.userGroups, 'TICKET_ADMIN')
          ?.groupName === 'TICKET_ADMIN'
      ) {
        this.form?.get('ticketAdmin')?.setValue(true);
      }
      if (
        this.searchGroupByName(this.data.userGroups, 'DT_User_Edit_Delete')
          ?.groupName === 'DT_User_Edit_Delete'
      ) {
        this.form?.get('edit_delete')?.setValue(true);
      }
      this.cdr.detectChanges();
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
    forkJoin([
      this.userService.getAllTeams(),
      this.userService.getGroups(),
    ]).subscribe(([teams, groups]) => {
      this.userService.allTeams = teams || [];
      this.userService.allGroups = groups || [];
      this.rolesReady = true;
      if (this.data) {
        this.getTeams(this.data.userGroups[0]);
      }
      if (this.dataReady && !this.initialBindingDone) {
        this.getRoles();
      }

      if (this.isEditing === false) {
        this.getTeams(this.data?.userGroups[0]);
        this.getRoles();
      }
      // Do not override team selections with group IDs
      this.initializing = false;
    });
  }
  getUsersList() {
    this.userService.getUsers().subscribe((res) => {
      if (!res) return;

      this.allUsers = res.filter(
        (user) => user.userGroups?.[0]?.roles?.[0]?.roleName !== 'ADMINS'
      );

      const updatedUsers =
        this.isEditing && this.data
          ? this.allUsers.filter((user) => user.email !== this.data.email)
          : this.allUsers;

      this.userDelegate.set(updatedUsers); // Update the signal
      this.escaltionManager.set(updatedUsers);
    });
  }
  closeDialog() {
    this.dialogService.close();
    this.router.navigate(['/users-setting']);
  }
  // Suppress form value changes on initial privilege binding
  // Avoid clearing team selections set from existing user data
  handleTeam(value: Role) {
    if (!this.rebindingPrivilege && !this.initializing) {
      this.userSelectedPrivilege = true;
    }
    if (this.initializing) {
      return;
    }
    this.resetPrivilegeCheckboxes();
    if (this.userService.getCurrentSystem() === 'DI_Milestones') {
      this.form.get('viewer')?.enable();
      this.checkDtUserPermissions(value.groupName);
      this.teams = this.userService.allTeams;
    } else if (this.userService.getCurrentSystem() === 'Score_Card_Report_DB') {
      this.teams = this.userService.getTeams();
    } else if (
      this.userService.getCurrentSystem() === 'Business_Excellence_Dashboard'
    ) {
      this.form.get('pageAccess')?.reset();
      if (value.groupName === 'BE_EDITORS') {
        this.filterPages = this.pages;
      } else if (value.groupName === 'BE_PM') {
        this.form.get('pageAccess')?.setValue([3]);
        this.form.get('pageAccess')?.disable();
      } else {
        this.form.get('pageAccess')?.enable();
        this.filterPages = this.pages.filter(
          (r) => r.name !== 'Activity Log Center'
        );
      }
    } else {
      this.teams = this.userService
        .getTeams()
        .filter((x) => x.roleName == value.groupName);
      if (this.initializing) {
        return;
      }
      const current = this.form?.get('teamDto')?.value;
      const availableIds = (this.teams || []).map((t) => t.id);
      if (Array.isArray(current)) {
        const preserved = current.filter((id: number) =>
          availableIds.includes(id)
        );
        this.form.get('teamDto')?.setValue(preserved, { emitEvent: false });
      } else if (current && typeof current === 'object' && 'id' in current) {
        const id = (current as any).id;
        if (!availableIds.includes(id)) {
          this.form.get('teamDto')?.setValue([], { emitEvent: false });
        }
      }
    }
  }

  private resetPrivilegeCheckboxes(): void {
    this.form.get('viewer')?.setValue(false, { emitEvent: false });
    this.form.get('editor')?.setValue(false, { emitEvent: false });
    this.form
      .get('DT_Governance_Approver')
      ?.setValue(false, { emitEvent: false });
    this.form.get('ticketAdmin')?.setValue(false, { emitEvent: false });
    this.form.get('edit_delete')?.setValue(false, { emitEvent: false });
    this.viewerControl?.enable();
    this.cdr.detectChanges();
  }
}
