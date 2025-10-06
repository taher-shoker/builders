import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
   
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateValueDialogComponent,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.createForm();
  }

    private createForm(): FormGroup {
    return this.fb.group({
      date: [new Date()],
      actualValue: [''],
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
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close({
      success: false,
      action: 'cancel',
    });
  }
}
