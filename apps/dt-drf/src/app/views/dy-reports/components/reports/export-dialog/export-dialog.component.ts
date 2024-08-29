import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';

@Component({
  selector: 'stc-apps-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss'], // Note: Changed to "styleUrls"
})
export class ExportDialogComponent implements OnInit {
  form!: FormGroup;
  fromDate: any;
  toDate: any;

  startDate!: Date | null;
  endDate!: Date | null;

  constructor(public dialogRef: MatDialogRef<ExportDialogComponent>) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      from: new FormControl('', Validators.required),
      to: new FormControl({ value: '', disabled: true }, Validators.required), // Initially disable 'to' date
    });

    // Watch for changes on fromDate and update toDate validation
    this.form.get('from')?.valueChanges.subscribe((fromValue) => {
      if (fromValue) {
        this.startDate = fromValue;
        const toControl = this.form.get('to');
        if (toControl?.value) {
          toControl.reset();
        }
        this.form.get('to')?.enable(); // Enable 'to' date after 'from' date is selected

        // this.form.get('to')?.setValidators((control) => {
        //   const toDate = control.value;
        //   return toDate && toDate < fromValue
        //     ? { invalidDateRange: true }
        //     : ;
        // });
      } else {
        this.startDate = null;
        this.form.get('to')?.disable(); // Disable 'to' date if 'from' date is cleared
      }
      this.form.get('to')?.updateValueAndValidity();
    });
  }

  FilterEndDate = (d: Date | null): boolean => {
    if (d === null) return false;
    return !this.startDate || d >= this.startDate;
  };

  handleDateChange(event: MatDatepickerInputEvent<Date>, type: string) {
    if (type === 'from') {
      this.fromDate = moment(event.value).format('YYYY-MM-DD');
      this.form.get('to')?.reset(); // Reset 'to' date if 'from' date changes
      this.toDate = null; // Clear toDate value
    } else {
      this.toDate = moment(event.value).format('YYYY-MM-DD');
    }

    console.log('fromDate:', this.fromDate);
    console.log('toDate:', this.toDate);
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
