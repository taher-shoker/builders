import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogeComponent } from '../confirmation-dialoge/confirmationDialoge.component';

@Injectable({ providedIn: 'root' })
export class dialogeService {
  constructor(private dialog: MatDialog) {}
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    dialogeDesc: string,
    dialogeConfirmationBtn: string,
    func: () => void
  ): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(ConfirmationDialogeComponent, {
      width: '750px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    // eslint-disable-next-line prefer-const
    let instance = dialogRef.componentInstance;
    instance.dialogeDesc = dialogeDesc;
    instance.confirmationBtnDesc = dialogeConfirmationBtn;
    dialogRef.afterClosed().subscribe((data) => {
      console.log('Dialog output:', data);
      if (data == 'confirmed') {
        console.log('hi');
        func();
        dialogRef.close();
      }
    });
  }
}
