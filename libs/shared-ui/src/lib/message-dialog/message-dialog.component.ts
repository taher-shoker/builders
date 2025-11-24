/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedUiModule } from '../shared-ui.module';

@Component({
  selector: 'stc-apps-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
  standalone: true,
  imports: [SharedUiModule],
})
export class MessageDialogComponent {
  message: string = '';
  title?: string;
  icon?: string;
  isLoading!: boolean;
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      msg: string;
      isLoading: boolean;
      title?: string;
      icon?: string;
    }
  ) {
    this.message = data.msg;
    this.title = data.title;
    this.icon = data.icon;
    this.isLoading = data.isLoading;
  }

  approve() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
