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
    if (environment.production) {
      this.authService.navigateToLogin();
    } else {
      this.loginForm();
    }
  }

  loginForm() {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    this.authService.isLoading = true;
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe((res: any) => {
        this.authService.isLoading = false;
      });
    }
  }

  keyDownFunction(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.authService.isLoading = true;
      if (this.form.valid) {
        this.authService.login(this.form.value).subscribe((res: any) => {
          this.authService.isLoading = false;
        });
      }
    }
  }

  loginWithSSO() {
    window.location.href = environment.sso_url;
  }
}
