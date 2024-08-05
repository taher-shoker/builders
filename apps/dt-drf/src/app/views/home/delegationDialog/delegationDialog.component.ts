import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ReportsService } from '../../dy-reports/dy-reports.service';
import { User } from '../../../services/models/user';

interface UserDelegate {
  delegateName: string;
  systemName: string;
}
@Component({
  selector: 'stc-apps-delegation-dialog',
  templateUrl: './delegationDialog.component.html',
  styleUrl: './delegationDialog.component.scss',
})
export class DelegationDialogComponent implements OnInit {
  users!: User[];
  form!: FormGroup;
  userDelegate!: UserDelegate;

  constructor(
    public dialogRef: MatDialogRef<DelegationDialogComponent>,
    private reportsService: ReportsService // @Inject(MAT_DIALOG_DATA) public data: { overallProgress: string, milestoneName: string }
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl(''),
    });

    this.getUsersListing();
  }

  getUsersListing() {
    this.reportsService.getUsers().subscribe((res) => {
      this.getUser();
      this.users = res.filter(
        (l) =>
          l.userGroups[0].roles[0].roleName !== 'ADMINS' &&
          l.email !== this.reportsService.getCurrentUser().email
      );
    });
  }

  update() {
    this.dialogRef.close({
      user: this.form.get('user')?.value,
    });
  }
  getUser() {
    const userDelegate = this.reportsService.getCurrentUser()?.userDelegates[0];
    this.form.get('user')?.setValue(userDelegate?.delegateName);
  }
  cancel() {
    this.dialogRef.close(undefined);
  }
}
