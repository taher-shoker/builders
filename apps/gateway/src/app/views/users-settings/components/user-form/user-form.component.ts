import {
  Component,
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
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { ToastrService } from 'ngx-toastr';

import { DialogService } from '@stc-apps/shared-ui';
import {
  User,
  Team,
  Role,
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
  selectedPrivilege!: Role;
  selectedTeam!: { id: number; name: string };
  addGroups = false;
  showInputs = true;
  userTeam = '';
  userId = 0;
  constructor(
    private formBuilder: FormBuilder,
    protected router: Router,
    public userService: UsersService,
    private toastr: ToastrService,
    protected dialogService: DialogService,
    private languageManagerService: LanguageManagerService
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
      userGroups: new FormControl('', Validators.required),
      teamDto: new FormControl('', Validators.required),
    });
  }
  onSubmit() {
    if (this.form.valid) {
      const dataForm = {
        userGroups: [{ id: this.form.get('teamDto')?.value.id }],
        email: this.form.get('email')?.value,
        name: this.form.get('name')?.value,
        jobTitle: this.form.get('jobTitle')?.value,
      };

      const onSuccess = (message: string) => {
        this.toastr.success(message);
        this.form.reset();
        this.router.navigate(['./users-setting']);
      };

      const handleError = (error: any) => {
        console.error('Error:', error);
        // Handle error as needed
      };

      if (this.isEditing) {
        this.userService
          .updateUser({ id: this.data.id, ...dataForm })
          .subscribe(
            () => onSuccess('User is edited successfully'),
            handleError
          );
      } else if (this.addGroups) {
        this.userService
          .addUserGroup(this.userId, this.form.get('teamDto')?.value.id, {})
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
    this.privilages = this.userService.getRoles();
    if (this.data) {
      this.selectedPrivilege = this.privilages.filter(
        (p) => p.id === this.data?.userGroups[0]?.roles[0]?.id
      )[0];
    }
  }

  getTeams(userGroup: UserGroup) {
    switch (userGroup?.roles[0].roleName) {
      case 'CREATORS':
        this.teams = this.userService
          .getTeams()
          .filter((t) => t.roleName == 'CREATORS'); //

        break;
      case 'APPROVERS':
        this.teams = this.userService
          .getTeams()
          .filter((t) => t.roleName == 'APPROVERS');
        break;
      default:
        this.teams = this.userService
          .getTeams()
          .filter((x) => x.roleName == userGroup?.roles[0].roleName);
        break;
    }

    if (this.data) {
      this.selectedTeam = this.teams.filter(
        (p: Team) => p.id === this.data?.userGroups[0].id
      )[0];
    }
  }

  cancel() {
    this.router.navigate(['./users-setting']);
  }

  handleTeam(value: Role) {
    this.form?.get('teamDto')?.setValue('');
    this.teams = this.userService
      .getTeams()
      .filter((x) => x.roleName == value.groupName);
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
            } else {
              this.addGroups = true;
              this.userId = res?.id || 0;
              this.restFormWithValue(res);
              this.enableFields();
            }
          },
          (error) => {
            this.userService.getGroups();
            this.getRoles();
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
    this.getRoles();
    if (!this.addGroups) {
      this.getTeams(data?.userGroups[0]);
    }
    this.form?.get('email')?.setValue(data.email);
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
    this.userService.getGroups();
    this.getRoles();
  }
}
