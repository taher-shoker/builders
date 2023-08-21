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
import { UsersService, teamsOptions } from '../../users.service';

@Component({
  selector: 'stc-apps-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() isEditing!: boolean;
  @Input() data!: any;

  form!: FormGroup;

  privilages = [];
  teams: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userService: UsersService,
    private toastr: ToastrService,
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
        userGroups: [{ id: this.form.controls['userGroups'].value.id }],
        teamDto: { id: this.form.controls['teamDto'].value.id },
        email: this.form.controls['email'].value,
        name: this.form.controls['name'].value,
        jobTitle: this.form.controls['jobTitle'].value,
      };
      if (this.isEditing) {
        this.userService
          .updateUser({ id: this.data.id, ...dataForm })
          .subscribe((res) => {
            const msgOfToaster =
              this.languageManagerService.getSavedLanguage() == 'ar'
                ? 'تم تعديل المستخدم بنجاح'
                : 'User is edit successfully';

            if (res) {
              this.toastr.success(msgOfToaster);
              this.form.reset();
              this.router.navigate(['./users-setting']);
            }
          });
      } else {
        this.userService.createUser(dataForm).subscribe((res) => {
          const msgOfToaster =
            this.languageManagerService.getSavedLanguage() == 'ar'
              ? 'تم إضافة المستخدم بنجاح'
              : 'User is added successfully';

          if (res) {
            this.toastr.success(msgOfToaster);
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
  getGroups() {
    this.userService.getGroups().subscribe((res) => {
      res.pop();
      this.privilages = res;
      if (this.data) {
        this.data.userGroup = this.privilages.filter(
          (p: any) => p.id === this.data?.userGroups[0]?.id
        )[0];
      }
    });
  }

  getTeams(userGroup: any) {
    this.userService.getTeams().subscribe((res) => {
      if (userGroup?.id === 1) {
        this.teams = res.filter((t: any) => t.id !== 4);
      } else {
        this.teams = res.filter((t: any) => t.id === 4);
      }
      this.data.teamDto = this.teams.filter(
        (x: any) => x.id === this.data.teamDto.id
      )[0];
    });
  }

  cancel() {
    this.router.navigate(['./users-setting']);
  }
  handleTeam(value: any) {
    this.form?.get('teamDto')?.setValue('');
    if (value.id === 1) {
      this.teams = teamsOptions.filter((t: any) => t.id !== 4);
    } else {
      this.teams = teamsOptions.filter((t: any) => t.id === 4);
    }
  }
  restFormWithValue(data: any) {
    this.getGroups();
    this.getTeams(data?.userGroups[0]);
    this.form?.get('email')?.setValue(data.email);
    this.form?.get('email')?.disable();
    this.form?.get('name')?.setValue(data.name);
    this.form?.get('name')?.disable();
    this.form?.get('jobTitle')?.setValue(data.jobTitle);
  }
  ngOnInit() {
    this.userform();
    this.getGroups();
  }
}
