import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { KPI } from '../../models/kpi.model';
import { KpiService, UpdateKpiProgressPayload } from '../../kpi.service';
import { firstValueFrom } from 'rxjs';

export interface EvidenceFile {
  file: File;
  previewUrl: SafeUrl | null;
  isImage: boolean;
}

@Component({
  selector: 'stc-apps-update-value-dialog',
  templateUrl: './update-value-dialog.component.html',
  styleUrls: ['./update-value-dialog.component.scss'],
})
export class UpdateValueDialogComponent implements OnDestroy {
   form!: FormGroup;
   evidenceFiles: EvidenceFile[] = [];
   loading = false;
   errorMessage: string | null = null;
   oversizedFilesCount = 0;
   private hideErrorTimer: any = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kpi: KPI, year?: number | null },
    private sanitizer: DomSanitizer,
    private kpiService: KpiService
  ) {
    this.form = this.createForm();
  }

  yearMinDate: Date = new Date(new Date().getFullYear(), 0, 1);
  yearMaxDate: Date = new Date(new Date().getFullYear(), 11, 31);

  private createForm(): FormGroup {
    const selectedYear = typeof this.data?.year === 'number' && Number.isFinite(this.data.year)
      ? this.data.year as number
      : new Date().getFullYear();
    this.yearMinDate = new Date(selectedYear, 0, 1);
    this.yearMaxDate = new Date(selectedYear, 11, 31);
    const defaultMonth = new Date().getMonth();
    const defaultDate = new Date(selectedYear, defaultMonth, 1);
    return this.fb.group({
      date: [defaultDate, [Validators.required]],
      actualValue: ['', [Validators.required]],
      evidence: [[], [this.maxFileSizeArrayValidator(30 * 1024 * 1024)]]
    });
  }

  private maxFileSizeArrayValidator(maxBytes: number): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value as any[];
      if (!Array.isArray(value) || value.length === 0) return null;
      const oversized = value.filter((item) => {
        const f = (item && item.file instanceof File) ? item.file : item as any;
        return f && typeof f.size === 'number' && f.size > maxBytes;
      });
      return oversized.length ? { maxFileSize: { maxBytes, count: oversized.length } } : null;
    };
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files) {
      const maxBytes = 30 * 1024 * 1024;
      let oversizedCount = 0;
      for (const file of files) {
        if (file.size > maxBytes) {
          oversizedCount++;
          continue;
        }
        const isImage = file.type.startsWith('image');
        const previewUrl = isImage
          ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))
          : null;
        this.evidenceFiles.push({ file, previewUrl, isImage });
      }
      this.form.patchValue({
        evidence: this.evidenceFiles
      });
      const evCtrl = this.form.get('evidence');
      this.oversizedFilesCount = oversizedCount;
      if (oversizedCount > 0) {
        this.errorMessage = null;
        const existing = evCtrl?.errors || {};
        evCtrl?.setErrors({ ...existing, maxFileSize: { maxBytes: maxBytes, count: oversizedCount } });
        if (this.hideErrorTimer) {
          clearTimeout(this.hideErrorTimer);
        }
        this.hideErrorTimer = setTimeout(() => {
          this.oversizedFilesCount = 0;
          if (evCtrl?.hasError('maxFileSize')) {
            const { maxFileSize, ...rest } = evCtrl.errors || {};
            evCtrl.setErrors(Object.keys(rest).length ? rest : null);
            evCtrl.updateValueAndValidity();
          }
          this.hideErrorTimer = null;
        }, 5000);
      } else {
        this.errorMessage = null;
        if (evCtrl?.hasError('maxFileSize')) {
          const { maxFileSize, ...rest } = evCtrl.errors || {};
          evCtrl.setErrors(Object.keys(rest).length ? rest : null);
        }
        this.oversizedFilesCount = 0;
      }
      evCtrl?.updateValueAndValidity();
    }
  }

  removeFile(fileToRemove: EvidenceFile): void {
    this.evidenceFiles = this.evidenceFiles.filter(item => item !== fileToRemove);
    this.form.patchValue({
      evidence: this.evidenceFiles
    });
    // To allow re-uploading the same file after removing it
    (document.getElementById('evidence_upload') as HTMLInputElement).value = '';
    const evCtrl = this.form.get('evidence');
    this.errorMessage = null;
    evCtrl?.setErrors(null);
    evCtrl?.updateValueAndValidity();
    if (this.hideErrorTimer) {
      clearTimeout(this.hideErrorTimer);
      this.hideErrorTimer = null;
    }
  }

  ngOnDestroy(): void {
    if (this.hideErrorTimer) {
      clearTimeout(this.hideErrorTimer);
      this.hideErrorTimer = null;
    }
    // Revoke the object URLs to avoid memory leaks
    this.evidenceFiles.forEach(item => {
      if (item.isImage && item.previewUrl) {
        const url = this.sanitizer.sanitize(4, item.previewUrl) as string;
        URL.revokeObjectURL(url);
      }
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    // Extract KPI ID safely
    const rawId = this.data?.kpi?.id;
    const kpiId = typeof rawId === 'number' ? rawId : Number(rawId);
    if (!Number.isFinite(kpiId)) {
      this.errorMessage = 'Invalid KPI identifier.';
      return;
    }

    // Prepare payload: ensure MM/YYYY format and value as string
    const dateObj: Date = this.form.get('date')?.value;
    const progressDate = this.formatMonthYear(dateObj);
    const valueInput = this.form.get('actualValue')?.value;

    this.loading = true;
    this.errorMessage = null;

    // Upload attachments sequentially and gather IDs
    this.uploadEvidenceAndGetIds()
      .then((attachmentIds) => {
        const payload: UpdateKpiProgressPayload = {
          value: String(valueInput ?? ''),
          progressDate,
          attachmentIds: attachmentIds && attachmentIds.length > 0 ? attachmentIds : undefined,
        };
        return firstValueFrom(this.kpiService.updateKpiProgress(kpiId, payload));
      })
      .then((res) => {
        this.loading = false;
        this.dialogRef.close({ success: true, action: 'save', data: res });
      })
      .catch((err) => {
        this.loading = false;
        this.errorMessage = 'Failed to upload evidence or update progress. Please try again.';
        console.error('[UpdateValueDialog] Submit failed', err);
      });
  }

  onCancel(): void {
    this.dialogRef.close({
      success: false,
      action: 'cancel',
    });
  }

  private formatMonthYear(date: Date): string {
    const d = date instanceof Date ? date : new Date(date);
    const month = String((d.getMonth() + 1)).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${month}/${year}`;
  }

  private async uploadEvidenceAndGetIds(): Promise<number[]> {
    const files = this.evidenceFiles?.map((f) => f.file) || [];
    const ids: number[] = [];
    for (const file of files) {
      const resp = await firstValueFrom(this.kpiService.uploadKpiProgressAttachment(file));
      if (resp && typeof resp.id === 'number') {
        ids.push(resp.id);
      } else {
        throw new Error('Attachment upload failed without id');
      }
    }
    return ids;
  }
}
