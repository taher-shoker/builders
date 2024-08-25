import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-data-upload-table',
  templateUrl: './data-upload-table.component.html',
  styleUrls: ['./data-upload-table.component.scss'],
})
export class DataUploadTableComponent {
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file.name);
    }
  }
}
