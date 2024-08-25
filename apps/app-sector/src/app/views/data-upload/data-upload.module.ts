import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appRoutes } from './data-upload.routes';
import { RouterModule } from '@angular/router';
import { UploadFileComponent } from './data-upload.component';
import { DataUploadTableComponent } from './components/data-upload-table/data-upload-table.component';
import { LogsTableComponent } from './components/logs-table/logs-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


const components = [UploadFileComponent, DataUploadTableComponent,LogsTableComponent];
const modules = [CommonModule,MatTableModule,MatPaginatorModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [components],
  imports: [modules],
})
export class UploadFileModule {}
