import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataUploadService } from '../../services/data-upload.service';
import { LogService } from '../../services/logs.service';

@Component({
  selector: 'stc-apps-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
})
export class FileUploadDialogComponent {
  selectedItem: any = { name: 'ALL', key: 'ALL' };
  selectedFile: File[] = [];
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { items: any[] },
    private dataUploadService: DataUploadService,
    private logService: LogService
  ) {}

  onItemSelected(item: any): void {
    const selectedValue = (item.target as HTMLSelectElement).value;
    const selectedItem = this.data.items.find(
      (item: any) => item.key === selectedValue
    );
    if (selectedItem != 'All') {
      this.selectedItem = selectedItem;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  upload(): void {
    if (this.selectedFile.length === 0) {
      this.errorMessage = 'Please select a file to upload.';
      return;
    }

    let dashboardName;
    if (this.selectedItem?.key !== 'ALL') {
      dashboardName = this.selectedItem?.key;
    }
    this.dataUploadService
      .uploadData(this.selectedFile[0], dashboardName)
      .subscribe({
        next: (result) => {
          this.logService.addLog(result);
          this.dialogRef.close(this.selectedItem);
        },
        error: (httpError: HttpErrorResponse) => {
          console.error('Upload Failed:', httpError);
          this.logService.logFailedSubject.next(true);
          this.dialogRef.close();
        },
      });
  }

  onFileSelected(files: File[]): void {
    console.log(files);
    if (files && files.length > 0) {
      this.selectedFile = [];
      this.selectedFile.push(files[0]);
      this.errorMessage = '';
    }
    console.log(this.selectedFile[0]);
  }

  onDeleteFile(deletedFile: File): void {
    this.selectedFile = [];
  }
}
