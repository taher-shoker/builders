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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { DialogService } from '@stc-apps/shared-ui';
import {
  User,
  Team,
  Role,
  UserGroup,
  UserTeam,
} from '../../../../shared/models/users-settings.model';
import { UsersService } from '../../users.service';
import { HttpParams } from '@angular/common/http';

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
  selectedPrivilege!: Role;
  selectedTeam!: { id: number; name: string };
  selectedGroup: number[] = [];
  addGroups = false;
  showInputs = true;
  hideDropdown = false;
  userTeam = '';
  userId = 0;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;
      if (this.data) {
        this.restFormWithValue(this.data);
      }
    }
  }

  userform() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', Validators.required),
      jobTitle: new FormControl('', Validators.required),
      userGroups: new FormControl(
        '',
        this.userService.getCurrentSystem() === 'DI_Management'
          ? Validators.nullValidator
          : Validators.required
      ),
      teamDto: new FormControl([], Validators.required),
      viewer: new FormControl(''),
    });
  }
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      let dataForm;
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        dataForm = {
          userGroups: [{ id: this.form.get('userGroups')?.value.id }],
          teams: this.form.get('teamDto')?.value.map((e: any) => {
            return { id: e };
          }),
          email: this.form.get('email')?.value,
          name: this.form.get('name')?.value,
          jobTitle: this.form.get('jobTitle')?.value,
        };
        if (this.form.get('viewer')?.value) {
          const viewerObj = this.userService
            .getRoles()
            .filter((r) => r.groupName === 'DT_VP_Dasboard_Viewer')[0];
          dataForm.userGroups.push({ id: viewerObj.id });
        }
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
        this.toastr.success(message);
        this.form.reset();
        this.router.navigate(['./users-setting']);
      };

      const handleError = (error: unknown) => {
        console.error('Error:', error);
      };

      if (this.isEditing) {
        this.userService
          .updateUser({ id: this.data.id, ...dataForm })
          .subscribe(
            () => onSuccess('User is edited successfully'),
            handleError
          );
      } else if (this.addGroups) {
        let queryParams = new HttpParams();

        if (this.userService.getCurrentSystem() === 'DI_Milestones') {
          queryParams = queryParams.set(
            'teamId',
            this.form.get('teamDto')?.value
          );
        }
        this.userService
          .addUserGroup(
            this.userId,
            this.userService.getCurrentSystem() === 'DI_Milestones'
              ? this.form.get('userGroups')?.value.id
              : this.form.get('teamDto')?.value,
            {},
            queryParams
          )
          .subscribe(
            () => onSuccess('User Group is added successfully'),
            handleError
          );
      } else {
        this.userService
          .createUser(dataForm)
          .subscribe(
            () => onSuccess('User is added successfully'),
            handleError
          );
      }
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  getRoles() {
    this.privilages = this.userService
      .getRoles()
      .filter((r) => r.groupName !== 'DT_VP_Dasboard_Viewer');
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
          (p) => p.id === this.data?.userGroups[0]?.roles[0]?.id
        )[0];
      }
    }
  }
  checkSystem(groups: UserGroup[]) {
    return groups.find((group: UserGroup) => {
      return group.roles.some((role: any) => {
        return role.system.name === this.userService.getCurrentSystem();
      });
    });
  }
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
          this.selectedGroup = this.data.teams.map((t: any) => t.id);
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
      if (value.groupName === 'DT_Director') {
        this.hideDropdown = true;
        this.form.get('teamDto')?.setValidators(null);
        this.form.get('teamDto')?.updateValueAndValidity();
      } else {
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
          (error) => {
            this.form?.get('name')?.enable();
            this.form?.get('jobTitle')?.enable();
            this.enableFields();
          }
        );
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
        if (this.data.userGroups.length > 1) {
          this.form?.get('viewer')?.setValue(true);
        }
      }
    }

    this.form?.get('email')?.setValue(data?.email);
    this.form?.get('email')?.disable();
    this.form?.get('name')?.setValue(data.name);
    this.form?.get('name')?.disable();
    this.form?.get('jobTitle')?.setValue(data.jobTitle);
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
  ngOnInit() {
    this.userform();
    if (!this.isEditing) {
      this.disableFields();
      this.showInputs = false;
    }
    this.handleGrouping();
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
}
