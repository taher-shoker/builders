import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '../../dy-reports/dy-reports.service';
import { User } from '../../../services/models/user';

@Component({
  selector: 'stc-apps-delegation-dialog',
  templateUrl: './delegationDialog.component.html',
  styleUrl: './delegationDialog.component.scss',
})
export class DelegationDialogComponent implements OnInit{

  users!: User[];
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DelegationDialogComponent>,
    private reportsService: ReportsService
  ) // @Inject(MAT_DIALOG_DATA) public data: { overallProgress: string, milestoneName: string }
  {}

  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl('')
    })

    this.getUsersListing();
  }

  getUsersListing() {
    this.reportsService.getUsers().subscribe((res) => {
      this.users = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
    });
  }

  update() {
    this.dialogRef.close({
      user: this.form.get('users')?.value,
      deliverable: this.form.get('deliverable')?.value,
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
