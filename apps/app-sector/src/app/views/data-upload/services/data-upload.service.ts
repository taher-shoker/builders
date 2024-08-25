import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-sector/src/environments/environment';
import { Observable } from 'rxjs';
import { logs } from '../models/logModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataUploadService {
  constructor(private http: HttpClient) {}
  logsURL = environment.apiUrl + 'v2/scrs/upload/status';
  getLogHistory(): Observable<logs[]> {
    return this.http.get<logs[]>(this.logsURL);
  }
}
