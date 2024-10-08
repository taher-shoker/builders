import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SharedFormService {
  form: FormGroup = new FormGroup({});
  currentDate = new Date();
  year = `${this.currentDate.getFullYear()}-FY`;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      year: new FormControl(this.year),
    });
  }

  initializeForm(params: any): void {
    console.log(params,+(params.year).split('-')[0]);
    
    this.form.setValue({
      year: params.year,
    });
  }

  getForm(): FormGroup {
    return this.form;
  }
}
