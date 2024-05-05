import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { customValidator } from './invalidValue.validator';

@Component({
  selector: 'stc-apps-update-progress-dialog',
  templateUrl: './updateProgressDialog.component.html',
  styleUrl: './updateProgressDialog.component.scss',
})
export class UpdateProgressDialogComponent {

  overallProgressFloor = 0;

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { overallProgress: string, milestoneName: string }
  ) {
    if(data.overallProgress){
      this.overallProgressFloor = Number(data.overallProgress) 
    }

    this.form = new FormGroup({
      overallProgress: new FormControl('', [Validators.required, customValidator(this.overallProgressFloor), Validators.pattern('^(?!.*[a-zA-Z]).*[0-9]+(.[0-9]+)?$')]),
      deliverable: new FormControl('', [Validators.maxLength(150)]),
    })
  }

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
