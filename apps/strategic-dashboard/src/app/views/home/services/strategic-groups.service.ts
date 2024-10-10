import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { StrategicGroup } from '../models/strategic-group.model';

@Injectable({
  providedIn: 'root',
})
export class StrategicGroupsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllStrategicGroups(params: {
    year: string;
    quarter: string;
  }): Observable<StrategicGroup[]> {
    const httpParams = new HttpParams()
      .set('year', params.year)
      .set('quarter', params.quarter);

    return this.http.get<StrategicGroup[]>(
      this.baseUrl + 'dashboard/strategic',
      {
        params: httpParams,
      }
    );
  }
}
