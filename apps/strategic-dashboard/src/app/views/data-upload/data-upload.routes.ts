import { Route } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

export const appRoutes: Route[] = [
    // { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: FileUploadComponent },
  ];
  