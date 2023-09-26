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
import { User, UsersService } from '../../users.service';
import { DialogService } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() isEditing!: boolean;
  @Input() data!: User;

  form!: FormGroup;
  privilages: { id: number; groupName: string }[] | any[] = [];
  teams: any[] = [];
  selectedPrivilege!: { id: number; groupName: string };
  selectedTeam!: { id: number; name: string };
  addGroups = false;
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
        userGroups: [{ id: this.form.controls['teamDto'].value.id }],
        email: this.form.controls['email'].value,
        name: this.form.controls['name'].value,
        jobTitle: this.form.controls['jobTitle'].value,
      };
      if (this.isEditing) {
        this.userService
          .updateUser({ id: this.data.id, ...dataForm })
          .subscribe((res) => {
            if (res) {
              this.toastr.success('User is edit successfully');
              this.form.reset();
              this.router.navigate(['./users-setting']);
            }
          });
      } else if (this.addGroups) {
        this.userService
          .addUserGroup(this.userId, this.form.get('teamDto')?.value.id, {})
          .subscribe((res) => {
            if (res) {
              this.toastr.success('User Group  is added successfully');
              this.form.reset();
              this.router.navigate(['./users-setting']);
            }
          });
      } else {
        this.userService.createUser(dataForm).subscribe((res) => {
          if (res) {
            this.toastr.success('User is added successfully');
            this.form.reset();
            this.router.navigate(['../users-setting']);
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

  getRoles() {
    this.privilages = this.userService.getRoles();
    if (this.data) {
      this.selectedPrivilege = this.privilages.filter(
        (p: any) => p.id === this.data?.userGroups[0]?.roles[0]?.id
      )[0];
    }
  }

  getTeams(userGroup: any) {
    if (userGroup?.roles[0].id === 2) {
      this.teams = this.userService
        .getTeams()
        .filter((t: any) => t.id !== 5 && t.name);
    } else {
      this.teams = this.userService
        .getTeams()
        .filter((t: any) => t.id === 5 && t.name);
    }
    if (this.data) {
      this.selectedTeam = this.teams.filter(
        (p: any) => p.id === this.data?.userGroups[0].id
      )[0];
    }
  }

  cancel() {
    this.router.navigate(['./users-setting']);
  }

  handleTeam(value: any) {
    this.form?.get('teamDto')?.setValue('');
    if (value.id === 2) {
      this.teams = this.userService.getTeams().filter((t: any) => t.id !== 5);
    } else {
      this.teams = this.userService.getTeams().filter((t: any) => t.id === 5);
    }
  }

  checkUserExist() {
    if (!this.form.get('email')?.errors) {
      this.userService
        .getUserByUserName(this.form.get('email')?.value)
        .subscribe({
          next: (res) => {
            if (res.userGroups.length > 0) {
              this.dialogService.open('alert-modal');
            } else {
              this.addGroups = true;
              this.userId = res?.id || 0;
              this.restFormWithValue(res);
              this.enableFields();
            }
          },
          error: (e) => console.error(e),
        });
    }
  }

  restFormWithValue(data: any) {
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
    }
    this.userService.getGroups();
    this.getRoles();
  }
}
