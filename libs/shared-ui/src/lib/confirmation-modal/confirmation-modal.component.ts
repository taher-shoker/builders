import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedUiModule } from '../shared-ui.module';

@Component({
  selector: 'stc-apps-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
  imports: [SharedUiModule],
})
export class ConfirmationModalComponent {
  title = '';
  message = '';
  approveLabel = 'Yes, Delete';
  cancelLabel = 'Cancel';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title?: string;
      message: string;
      approveLabel?: string;
      cancelLabel?: string;
    }
  ) {
    this.title = data.title ?? '';
    this.message = data.message;
    this.approveLabel = data.approveLabel ?? this.approveLabel;
    this.cancelLabel = data.cancelLabel ?? this.cancelLabel;
  }

  approve(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}