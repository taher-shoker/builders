import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KPI, KpiFormDialogData } from '../../models/kpi.model';
import { KpiService, CreateKpiPayload, UpdateKpiPayload } from '../../kpi.service';

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
    if (this.isEditMode && this.data.kpi && this.data.kpi.id != null) {
      const idNum = Number(this.data.kpi.id);
      if (Number.isFinite(idNum)) {
        this.loading = true;
        this.kpiService.getKpiById(idNum).subscribe({
          next: (res) => {
            this.populateFormFromResponse(res);
            this.loading = false;
          },
          error: (err) => {
            console.error('[KPI] getKpiById error', err);
            this.loading = false;
          },
        });
      } else {
        // Fallback to minimal populate if id is not numeric
        this.populateForm(this.data.kpi);
      }
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      kpiName: ['', [Validators.required, Validators.maxLength(255)]],
      dimension: ['', Validators.required],
      direction: [null, Validators.required],
      kpiFormula: ['', [Validators.required, Validators.maxLength(255)]],
      weight: ['', Validators.required],
      baseline: ['', Validators.required],
      target: ['', Validators.required],
      ambition: ['', Validators.required],
    });
  }

  private populateForm(kpi: KPI): void {
    // Minimal populate using available fields on KPI model
    this.kpiForm.patchValue({
      kpiName: kpi.name ?? '',
      dimension: kpi.description ?? '',
    });
  }

  private populateFormFromResponse(res: import('../../kpi.service').KpiDetailsResponse): void {
    // Convert numeric values to strings to align with form payload expectations
    const toStr = (v: number | string | undefined | null) =>
      v == null ? '' : String(v);

    this.kpiForm.patchValue({
      kpiName: res.name ?? '',
      dimension: res.dimension ?? '',
      direction: res.direction,
      kpiFormula: res.formula ?? '',
      weight: toStr(res.weight ?? ''),
      baseline: toStr(res.baseline ?? ''),
      target: toStr(res.target ?? ''),
      ambition: toStr(res.ambition ?? ''),
    });
  }

  onSubmit(): void {
    if (!this.kpiForm.valid || this.loading) return;

    const formValue = this.kpiForm.value;
    if (this.isEditMode) {
      const idNum = Number(this.data?.kpi?.id);
      if (!Number.isFinite(idNum)) {
        this.errorMessage = 'Invalid KPI ID.';
        return;
      }

      const unitIdRaw = this.data?.unitId ?? this.kpiService.getCurrentUnitId();
      const unitId = typeof unitIdRaw === 'number' ? unitIdRaw : Number(unitIdRaw);
      if (!Number.isFinite(unitId)) {
        this.errorMessage = 'No unit selected. Please select a unit tab first.';
        return;
      }

      const rawDim = formValue.dimension;
      const dimensionStr = typeof rawDim === 'string' ? rawDim : (rawDim?.name ?? rawDim?.id ?? '');
      const rawDir = formValue.direction;
      const directionNum = typeof rawDir === 'number' ? rawDir : Number(rawDir?.id ?? rawDir);

      const payload: UpdateKpiPayload = {
        name: String(formValue.kpiName || '').trim(),
        ambition: String(formValue.ambition ?? ''),
        formula: String(formValue.kpiFormula ?? ''),
        dimension: String(dimensionStr ?? ''),
        weight: String(formValue.weight ?? ''),
        baseline: String(formValue.baseline ?? ''),
        target: String(formValue.target ?? ''),
        unitId: unitId,
        direction: directionNum
      };

      this.loading = true;
      this.errorMessage = '';
      // console.log(idNum)
      // console.log(payload)
      this.kpiService.updateKpi(idNum, payload).subscribe({
        next: (res) => {
          this.loading = false;
          this.dialogRef.close({ success: true, action: 'save', data: res });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Failed to update KPI. Please try again.';
          console.error('[KPI] updateKpi error', err);
        },
      });
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
      baseline: String(formValue.baseline ?? ''),
      target: String(formValue.target ?? ''),
      unitId: unitId,
      direction: directionNum,
      year: this.data?.year ?? new Date().getFullYear(),
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
