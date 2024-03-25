import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'stc-apps-update-progress-dialog',
  templateUrl: './updateProgressDialog.component.html',
  styleUrl: './updateProgressDialog.component.scss',
})
export class UpdateProgressDialogComponent {
  form: FormGroup = new FormGroup({
    overallProgress: new FormControl('', [Validators.required, Validators.max(100), Validators.min(0), Validators.pattern('^[0-9]*$')]),
    deliverable: new FormControl('', [Validators.required, Validators.maxLength(150)]),
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { msg: string }
  ) {}

  update() {
    this.dialogRef.close({
      overallProgress: this.form.get('overallProgress')?.value,
      deliverable: this.form.get('deliverable')?.value,
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
