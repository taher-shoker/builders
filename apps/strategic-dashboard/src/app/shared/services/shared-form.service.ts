import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SharedFormService {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      year: new FormControl(''),
    });
  }

  initializeForm(params: any): void {
    this.form.setValue({
      year: params.year,
    });
  }

  getForm(): FormGroup {
    return this.form;
  }
}
