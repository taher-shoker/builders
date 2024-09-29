import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../dy-reports/dy-reports.service';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'stc-apps-category-dialog',
  templateUrl: './categoryDialog.component.html',
  styleUrl: './categoryDialog.component.scss',
})
export class CategoryDialogComponent implements OnInit {
  form!: FormGroup;
  customRangeSLA: { name: number; id: number }[] = [];

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { state: 'edit' | 'add'; category?: Category },
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    console.log('El data', this.data);
    this.form = new FormGroup({
      name: new FormControl(
        {
          value: this.data.category?.name ?? '',
          disabled: this.data.state === 'edit',
        },
        [
          Validators.required,
          Validators.maxLength(
            this.configService.getConfig()?.characterLimit.nameLength
          ),
        ]
      ),
      slaDuration: new FormControl(this.data.category?.slaDuration ?? '', [
        Validators.required,
      ]),
    });
    this.populateCustomSLA();
  }
  private populateCustomSLA() {
    const { min, max } = this.configService.getConfig().rangeForSLA;
    this.customRangeSLA = Array.from({ length: max - min + 1 }, (_, i) => ({
      name: min + i,
      id: min + i,
    }));
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
