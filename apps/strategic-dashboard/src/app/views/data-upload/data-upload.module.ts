import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataUploadComponent } from './data-upload.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LogsTableComponent } from './components/logs-table/logs-table.component';

@NgModule({
  declarations: [DataUploadComponent, FileUploadComponent, LogsTableComponent],
  imports: [CommonModule],
})
export class DataUploadModule {}
