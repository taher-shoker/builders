import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-sector/src/environments/environment';
import { map, Observable } from 'rxjs';
import { logs } from '../models/logModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataUploadService {
  constructor(private http: HttpClient) {}
  baseURL = environment.apiUrl + 'v2/scrs/upload/';

  getLogHistory(): Observable<logs[]> {
    return this.http.get<logs[]>(this.baseURL + 'status');
  }

  uploadData(file: File): Observable<logs> {
    const formData = new FormData();
    formData.append(`file`, file);
    return this.http.post(this.baseURL + 'data', formData).pipe(
      map((response) => {
        return response as logs;
      })
    );
  }
}
