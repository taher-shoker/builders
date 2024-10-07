import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { FileUploadDialogComponent } from '../file-upload-dialog/file-upload-dialog.component';

@Component({
  selector: 'stc-apps-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  showList = false;
  items = [
    { name: 'ALL', key: 'ALL' },
    { name: 'Strategic KPIs', key: 'Strategic KPIs' },
    { name: 'Strategic Program', key: 'Strategic Program' },
    {
      name: 'Strategic Program KPIs Details',
      key: 'Strategic Program KPIs Details',
    },
  ];

  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      width: '600px',
      data: { items: this.items },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog result:', result);
      }
    });
  }
}
