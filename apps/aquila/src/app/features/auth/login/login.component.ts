import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'stc-apps-login',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatError,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private renderer = inject(Renderer2);

  @ViewChild('emailInput') emailInput!: ElementRef;
  form!: FormGroup;

  ngOnInit(): void {
    this.loginForm();
  }

  loginForm() {
    this.form = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        this.emailValidator.bind(this),
      ]),
      password: new FormControl('', Validators.required),
    });
  }

  private emailValidator(control: FormControl): { [key: string]: any } | null {
    const email = control.value;
    if (!email) return null;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return { email: true }; // Invalid email format
    }

    const domainPattern = /@stc\.(com\.sa|\w+)$/i;
    if (!domainPattern.test(email)) {
      return { stcDomain: true }; // Valid email but wrong domain
    }

    return null;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const params = {
        email: this.form.value.email,
        password: this.form.value.password,
      };

      this.authService.login(params).subscribe({
        error: (error) => {
          console.error('Login error:', error);
          this.handleLoginError(error);
        },
      });
    } else {
      this.form.markAllAsTouched();
      this.manageErrorStyles();
    }
  }

  private handleLoginError(error: any): void {
    if (error.error?.errorMessage && error.error?.errorDetailsMessage) {
      this.toastr.error(
        `${error.error.errorMessage}<br>${error.error.errorDetailsMessage}`,
        '',
        { enableHtml: true }
      );
    } else if (error.error?.message) {
      this.toastr.error(error.error.message, 'Error');
    }
  }

private manageErrorStyles() {
  if (!this.emailInput?.nativeElement) return;
  
  const emailControl = this.form.get('email');
  const hasStcDomainError = emailControl?.touched && emailControl?.hasError('stcDomain');
  const hasEmailFormatError = emailControl?.touched && emailControl?.hasError('email');
  const hasOtherErrors = emailControl?.touched && emailControl?.invalid && 
                        !hasStcDomainError && !hasEmailFormatError;
  
  const inputElement = this.emailInput.nativeElement;
  
  if (hasStcDomainError) {
    this.renderer.addClass(inputElement, 'hide-internal-errors');
    this.renderer.removeClass(inputElement, 'show-internal-errors');
  } else if (hasEmailFormatError || hasOtherErrors) {
    this.renderer.removeClass(inputElement, 'hide-internal-errors');
    this.renderer.addClass(inputElement, 'show-internal-errors');
  } else {
    this.renderer.removeClass(inputElement, 'hide-internal-errors');
    this.renderer.removeClass(inputElement, 'show-internal-errors');
  }
}
}
