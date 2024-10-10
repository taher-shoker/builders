import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { FileUploadDialogComponent } from '../file-upload-dialog/file-upload-dialog.component';
import { DashboardNameEnum } from '../../enums/DashboardName.enum';

@Component({
  selector: 'stc-apps-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  showList = false;
  items = Object.keys(DashboardNameEnum).map((key) => ({
    name: DashboardNameEnum[key as keyof typeof DashboardNameEnum], // Use enum value
    key: DashboardNameEnum[key as keyof typeof DashboardNameEnum], // Set key same as value
  }));

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
