import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SharedFormService {
  form: FormGroup = new FormGroup({});
  currentDate = new Date();
  year = `${this.currentDate.getFullYear()}`;
  quarter = `FY`;
  constructor(private fb: FormBuilder) {
    console.log('this.year', this.year);

    this.form = this.fb.group({
      year: new FormControl(this.year),
      quarter: new FormControl(this.quarter),
    });
  }

  initializeForm(params: any): void {

    this.form.setValue({
      year: params.year,
      quarter: params.quarter,
    });
  }

  getForm(): FormGroup {
    return this.form;
  }
}
