import { Component } from '@angular/core';
import { DataUploadService } from '../../services/data-upload.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'stc-apps-data-upload-table',
  templateUrl: './data-upload-table.component.html',
  styleUrls: ['./data-upload-table.component.scss'],
})
export class DataUploadTableComponent {
  constructor(
    private dataUploadService: DataUploadService,
    private logService: LogService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.dataUploadService.uploadData(file).subscribe((result) => {
        this.logService.addLog(result);
      });
      input.value = '';
    }
  }
}
