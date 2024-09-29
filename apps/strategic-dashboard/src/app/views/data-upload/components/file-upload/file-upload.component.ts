import { Component } from '@angular/core';
import { DataUploadService } from '../../services/data-upload.service';
import { LogService } from '../../services/logs.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'stc-apps-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  constructor(
    private dataUploadService: DataUploadService,
    private logService: LogService
  ) {}
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.dataUploadService.uploadData(file).subscribe({
        next: (result) => {
          this.logService.addLog(result);
        },
        error: (httpError: HttpErrorResponse) => {
          this.logService.logFailedSubject.next(true);
        },
      });
      input.value = '';
    }
  }
}
