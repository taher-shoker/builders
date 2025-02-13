import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetStandardsResponse } from '../models/standards.models';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.stage';

@Injectable({
  providedIn: 'root',
})
export class StandardsService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/standard`;
  private readonly http = inject(HttpClient);

  getStandards(): Observable<GetStandardsResponse> {
    return this.http.get<GetStandardsResponse>(this.apiUrl);
  }

  uploadStandard(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      responseType: 'text',
    });
  }

  deleteStandard(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
