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
  showList = false;
  items = [
    { name: 'Strategic KPIs', key: 'Strategic KPIs' },
    { name: 'Strategic Program', key: 'Strategic Program' },
    {
      name: 'Strategic Program KPIs Details',
      key: 'Strategic Program KPIs Details',
    },
  ];

  selectedKey = '';

  constructor(
    private dataUploadService: DataUploadService,
    private logService: LogService
  ) {}

  toggleList() {
    this.showList = !this.showList;
  }

  onItemSelected(item: any, fileInput: HTMLInputElement) {
    this.selectedKey = item.key;
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const dashboardName = this.selectedKey;

      this.dataUploadService.uploadData(file, dashboardName).subscribe({
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
