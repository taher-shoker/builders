import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'stc-apps-api-standard-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './api-standard-form.component.html',
  styleUrls: ['./api-standard-form.component.scss'],
})
export class ApiStandardFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  form: FormGroup = new FormGroup({});

  constructor() {
    this.form = this.fb.group({
      apiName: ['', Validators.required],
      businessArea: ['', Validators.required],
      type: ['', Validators.required],
      domain: ['', Validators.required],
      iprMode: ['', Validators.required],
      version: ['', Validators.required],
      overview: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newStandard = this.form.value;
      this.router.navigate(['api-standard-list'], { state: { newStandard } });
    }
  }

  onCancel(): void {
    this.router.navigate(['api-standard-list']);
  }
}
