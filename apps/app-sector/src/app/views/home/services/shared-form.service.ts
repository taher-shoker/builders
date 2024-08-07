import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OverallScoreParams } from '../../models/overallScore.model';

@Injectable({
  providedIn: 'root',
})
export class SharedFormService {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      year: new FormControl(''),
      quarter: new FormControl(''),
      sectorName: new FormControl(''),
    });
  }

  initializeForm(params: OverallScoreParams): void {
    this.form.setValue({
      year: params.year,
      quarter: params.quarter,
      sectorName: params.sectorName,
    });
  }

  getForm(): FormGroup {
    return this.form;
  }
}
