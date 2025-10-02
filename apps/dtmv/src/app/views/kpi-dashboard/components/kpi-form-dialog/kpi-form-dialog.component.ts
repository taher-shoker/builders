import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KPI, KpiFormDialogData } from '../../models/kpi.model';

@Component({
  selector: 'stc-apps-kpi-form-dialog',
  templateUrl: './kpi-form-dialog.component.html',
  styleUrls: ['./kpi-form-dialog.component.scss'],
})
export class KpiFormDialogComponent implements OnInit {
  kpiForm!: FormGroup;
  isEditMode!: boolean;
  dialogTitle!: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<KpiFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KpiFormDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.dialogTitle = this.isEditMode ? 'Edit KPI' : 'Add New KPI';
    this.kpiForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.kpi) {
      this.populateForm(this.data.kpi);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      kpiName: [''],
      dimension: [''],
      currentValue: [''],
      kpiFormula: [''],
      weight: [''],
      baseline: [''],
      target: [''],
      ambition: [''],
    });
  }

  private populateForm(kpi: KPI): void {
    this.kpiForm.patchValue({});
  }

  onSubmit(): void {
    if (this.kpiForm.valid) {
      const formValue = this.kpiForm.value;
    }
  }

  onCancel(): void {
    this.dialogRef.close({
      success: false,
      action: 'cancel',
    });
  }
}
