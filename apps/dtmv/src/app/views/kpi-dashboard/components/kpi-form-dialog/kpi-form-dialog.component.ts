import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KPI, KpiFormDialogData } from '../../models/kpi.model';
import { KpiService, CreateKpiPayload } from '../../kpi.service';

@Component({
  selector: 'stc-apps-kpi-form-dialog',
  templateUrl: './kpi-form-dialog.component.html',
  styleUrls: ['./kpi-form-dialog.component.scss'],
})
export class KpiFormDialogComponent implements OnInit {
  kpiForm!: FormGroup;
  isEditMode!: boolean;
  dialogTitle!: string;
  loading = false;
  errorMessage = '';
  dimensionOptions = [
    { id: 'Capability Building', name: 'Capability Building' },
    { id: 'Capability Utilization', name: 'Capability Utilization' },
    { id: 'Digital Experience & Impact', name: 'Digital Experience & Impact' },
  ];
  directionOptions = [
    { id: 1, name: 'Increase' },
    { id: -1, name: 'Decrease' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<KpiFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KpiFormDialogData,
    private kpiService: KpiService
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
      kpiName: ['', Validators.required],
      dimension: ['', Validators.required],
      direction: [null, Validators.required],
      currentValue: ['', Validators.required],
      kpiFormula: ['', Validators.required],
      weight: ['', Validators.required],
      baseline: ['', Validators.required],
      target: ['', Validators.required],
      ambition: ['', Validators.required],
    });
  }

  private populateForm(kpi: KPI): void {
    this.kpiForm.patchValue({});
  }

  onSubmit(): void {
    if (!this.kpiForm.valid || this.loading) return;

    const formValue = this.kpiForm.value;
    if (this.isEditMode) {
      // Placeholder for edit flow; not implemented yet
      this.dialogRef.close({ success: false, action: 'save' });
      return;
    }

    const unitIdRaw = this.data?.unitId ?? this.kpiService.getCurrentUnitId();

    const unitId =
      typeof unitIdRaw === 'number' ? unitIdRaw : Number(unitIdRaw);
    if (!Number.isFinite(unitId)) {
      this.errorMessage = 'No unit selected. Please select a unit tab first.';
      return;
    }

    const rawDim = formValue.dimension;
    const dimensionStr =
      typeof rawDim === 'string'
        ? rawDim
        : rawDim && typeof rawDim === 'object'
        ? rawDim.name ?? rawDim.id ?? ''
        : '';
    if (!dimensionStr) {
      this.errorMessage = 'Please select Dimension';
      return;
    }

    const rawDir = formValue.direction;
    const directionNum =
      typeof rawDir === 'number'
        ? rawDir
        : rawDir && typeof rawDir === 'object'
        ? Number(rawDir.id)
        : Number(rawDir);
    if (
      !Number.isFinite(directionNum) ||
      (directionNum !== 1 && directionNum !== -1)
    ) {
      this.errorMessage = 'Please select Direction';
      return;
    }

    const payload: CreateKpiPayload = {
      name: String(formValue.kpiName || '').trim(),
      ambition: String(formValue.ambition ?? ''),
      formula: String(formValue.kpiFormula ?? ''),
      dimension: String(dimensionStr ?? ''),
      weight: String(formValue.weight ?? ''),
      currentValue: String(formValue.currentValue ?? ''),
      baseline: String(formValue.baseline ?? ''),
      target: String(formValue.target ?? ''),
      unitId: unitId,
      direction: directionNum,
    };

    this.loading = true;
    this.errorMessage = '';
    this.kpiService.createKpi(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.dialogRef.close({ success: true, action: 'save', data: res });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to create KPI. Please try again.';
        console.error('[KPI] createKpi error', err);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      success: false,
      action: 'cancel',
    });
  }
}
