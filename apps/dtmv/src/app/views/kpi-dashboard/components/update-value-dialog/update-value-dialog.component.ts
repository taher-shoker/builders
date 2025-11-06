import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
   
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kpi: KPI },
    private sanitizer: DomSanitizer,
    private kpiService: KpiService
  ) {
    this.form = this.createForm();
  }

    private createForm(): FormGroup {
    return this.fb.group({
      // Default to current month; still marked required, but has initial value
      date: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), [Validators.required]],
      // Require actual value entry; numeric validation handled by the numeric input component
      actualValue: ['', [Validators.required]],
      evidence: [[]]
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const isImage = file.type.startsWith('image');
        const previewUrl = isImage
          ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))
          : null;
        this.evidenceFiles.push({ file, previewUrl, isImage });
      }
      this.form.patchValue({
        evidence: this.evidenceFiles
      });
    }
  }

    removeFile(fileToRemove: EvidenceFile): void {
    this.evidenceFiles = this.evidenceFiles.filter(item => item !== fileToRemove);
    this.form.patchValue({
      evidence: this.evidenceFiles
    });
    // To allow re-uploading the same file after removing it
    (document.getElementById('evidence_upload') as HTMLInputElement).value = '';
  }

  ngOnDestroy(): void {
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
