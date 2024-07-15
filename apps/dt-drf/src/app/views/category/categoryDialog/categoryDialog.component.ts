import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'stc-apps-category-dialog',
  templateUrl: './categoryDialog.component.html',
  styleUrl: './categoryDialog.component.scss',
})
export class CategoryDialogComponent implements OnInit{

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { state: 'edit' | 'add', category? : any }
  )
  {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      sla: new FormControl(''),
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
