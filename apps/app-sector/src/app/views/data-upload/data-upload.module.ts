import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { appRoutes } from './data-upload.routes';
import { RouterModule } from '@angular/router';
import { UploadFileComponent } from './data-upload.component';
import { DataUploadTableComponent } from './components/data-upload-table/data-upload-table.component';

const components = [UploadFileComponent, DataUploadTableComponent];
const modules = [CommonModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [components],
  imports: [modules],
})
export class UploadFileModule {}
