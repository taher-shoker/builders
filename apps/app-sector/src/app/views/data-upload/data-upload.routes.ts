import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { DataUploadTableComponent } from './components/data-upload-table/data-upload-table.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'data-upload', pathMatch: 'full' },
  { path: 'data-upload', component: DataUploadTableComponent },
];
