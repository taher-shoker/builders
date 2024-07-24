import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../dy-reports/dy-reports.service';

@Component({
  selector: 'stc-apps-category-dialog',
  templateUrl: './categoryDialog.component.html',
  styleUrl: './categoryDialog.component.scss',
})
export class CategoryDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { state: 'edit' | 'add'; category?: Category }
  ) {}

  ngOnInit(): void {
    console.log("El data", this.data)
    this.form = new FormGroup({
      name: new FormControl(this.data.category?.name ?? '', Validators.required),
      slaDuration: new FormControl(this.data.category?.slaDuration ?? '', [
        Validators.pattern('^[0-9]+$'),
        Validators.required,
      ]),
    });
  }

  save() {
    this.dialogRef.close({
      name: this.form.get('name')?.value,
      slaDuration: this.form.get('slaDuration')?.value,
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
