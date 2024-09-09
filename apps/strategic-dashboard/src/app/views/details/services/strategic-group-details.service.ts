import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StrategicGroupDetails } from '../models/strategic-group-details.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StrategicGroupDetailsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllStrategicGroupKpiDetails(params: {
    strategicName: string;
    year: number;
  }): Observable<StrategicGroupDetails> {
    const httpParams = new HttpParams()
      .set('strategicName', params.strategicName)
      .set('year', params.year.toString());

    return this.http.get<StrategicGroupDetails>(
      this.baseUrl + 'v1/dashboard/strategic/detail',
      {
        params: httpParams,
      }
    );
  }
}
