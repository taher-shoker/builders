import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries

import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/strategic-dashboard/src/environments/environment';
import { logs } from '../models/logsModel';

@Injectable({
  providedIn: 'root',
})
export class DataUploadService {
  constructor(private http: HttpClient) {}
  baseURL = environment.apiUrl + 'v1/upload';

  getLogHistory(): Observable<logs[]> {
    return this.http.get<logs[]>(this.baseURL);
  }

  uploadData(file: File): Observable<logs> {
    const formData = new FormData();
    formData.append(`file`, file);
    return this.http.post(this.baseURL, formData).pipe(
      map((response) => {
        return response as logs;
      })
    );
  }
}
