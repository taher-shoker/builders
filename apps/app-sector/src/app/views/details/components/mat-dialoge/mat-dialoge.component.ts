import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'stc-apps-mat-dialoge',
  templateUrl: './mat-dialoge.component.html',
  styleUrl: './mat-dialoge.component.scss',
})
export class MatDialogeComponent {
  constructor(private dialogRef: MatDialogRef<MatDialogeComponent>){}
  delete() {
    this.dialogRef.close('confirmed');
    console.log('delete');
  }
}
