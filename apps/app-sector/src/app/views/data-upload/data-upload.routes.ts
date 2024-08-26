import { Route } from '@angular/router';
import { DataUploadTableComponent } from './components/data-upload-table/data-upload-table.component';

export const appRoutes: Route[] = [
  // { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: DataUploadTableComponent },
];
