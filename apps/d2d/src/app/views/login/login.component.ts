import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'stc-apps-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm();
  }

  loginForm() {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }
  onSubmit(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe((res: any) => {
        // if(res.result === "SUCCESS"){
        //   this.authService.setLoggedInUser();
        // }
      });
    }
  }
}
