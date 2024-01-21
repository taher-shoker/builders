import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { UploadedFile } from '../../shared/models/data-upload.model';

@Injectable({
  providedIn: 'root',
})
export class DataUploadService {
  endpoint = environment.apiUrl.replace('admin', 'di');

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getDataUpload(): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(`${this.endpoint}/upload/status`);
  }
  addFileDataMonthly(
    file: FormData,
    myParams: { from: string; to: string; year: string }
  ): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(
      `${this.endpoint}/upload/monthly`,
      file,
      {
        params: myParams,
      }
    );
  }
  addFileDataLookup(file: FormData): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(
      `${this.endpoint}/upload/lookup`,
      file
    );
  }
}
