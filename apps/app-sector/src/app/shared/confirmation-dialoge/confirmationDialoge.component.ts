import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'stc-apps-confirmation-dialoge',
  templateUrl: './confirmationDialoge.component.html',
  styleUrl: './confirmationDialoge.component.scss',
})
export class ConfirmationDialogeComponent {
  
 @Input() dialogeDesc = '';
  @Input() confirmationBtnDesc = '';
  // confirmBtnTitle: InputSignal<string> = input('');
  constructor(private dialogRef: MatDialogRef<ConfirmationDialogeComponent>) {}
  delete() {
    this.dialogRef.close('confirmed');
    console.log('delete');
  }
}
