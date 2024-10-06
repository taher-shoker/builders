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
  baseURL = environment.apiUrl + 'upload';

  getLogHistory(): Observable<logs[]> {
    return this.http.get<logs[]>(this.baseURL);
  }

  uploadData(file: File, dashboardName: string): Observable<logs> {
    const formData = new FormData();
    formData.append('file', file);

    const urlWithParams = `${this.baseURL}?dashboardName=${dashboardName}`;

    return this.http.post<logs>(urlWithParams, formData).pipe(
      map((response) => {
        return response as logs;
      })
    );
  }
}
