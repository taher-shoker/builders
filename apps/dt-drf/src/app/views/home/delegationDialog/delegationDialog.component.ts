import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'stc-apps-delegation-dialog',
  templateUrl: './delegationDialog.component.html',
  styleUrl: './delegationDialog.component.scss',
})
export class DelegationDialogComponent implements OnInit{

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DelegationDialogComponent>
  ) // @Inject(MAT_DIALOG_DATA) public data: { overallProgress: string, milestoneName: string }
  {}

  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl('')
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
