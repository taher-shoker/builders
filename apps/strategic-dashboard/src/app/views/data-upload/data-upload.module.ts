import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataUploadComponent } from './data-upload.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LogsTableComponent } from './components/logs-table/logs-table.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './data-upload.routes';
const components = [DataUploadComponent, FileUploadComponent, LogsTableComponent];
const modules = [CommonModule,FormsModule,MatTableModule,MatPaginatorModule,SharedModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [components],
  imports: [modules],
})
export class DataUploadModule {}
