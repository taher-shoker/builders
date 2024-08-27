import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'stc-apps-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.cookieService.removeAll();
    this.loginForm();
  }

  loginForm() {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    this.createLogin();
  }

  keyDownFunction(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.createLogin();
    }
  }

  createLogin() {
    if (this.form.valid) {
      this.authService.isLoading = true;

      this.authService.login(this.form.value).subscribe(
        () => {
          this.authService.isLoading = false;
        },
        (err) => {
          if (err) {
            this.authService.isLoading = false;
          }
        }
      );
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  loginWithSSO() {
    window.location.href = environment.sso_url;
  }
}
