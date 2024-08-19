import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';

@Component({
  selector: 'stc-apps-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss',
})
export class ExportDialogComponent implements OnInit {
  form!: FormGroup;
  fromDate: any;
  toDate: any;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent> // @Inject(MAT_DIALOG_DATA) public data: { overallProgress: string, milestoneName: string }
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      from: new FormControl(''),
      to: new FormControl(''),
    });
  }

  handelChangeDate(event: MatDatepickerInputEvent<Date>, type: string) {
    if (type === 'from') {
      this.fromDate = null;
      this.toDate = null;
      this.fromDate = moment(event.value).format('YYYY-MM-DD');
      this.form.get('toDate')?.reset();
    } else {
      this.toDate = moment(event.value).format('YYYY-MM-DD');
    }

    console.log('in fromDate:', this.fromDate);
    console.log('in toDate:', this.toDate);
  }
  update() {
    this.dialogRef.close({
      from: this.fromDate,
      to: this.toDate,
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
