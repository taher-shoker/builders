import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  kpiDetailsParams,
  kpiDetailsResponse,
} from '../views/details/models/kpiDetailsModel';

@Injectable({
  providedIn: 'root',
})
export class kpiInfoService {
  baseUrl = environment.apiUrl;
  httpParams!: HttpParams;
  constructor(private http: HttpClient) {}

  getKpiDetails(params: kpiDetailsParams): Observable<kpiDetailsResponse> {
    if (params.kpiCode) {
      this.httpParams = new HttpParams()
        .set('year', params.year)
        .set('quarter', params.quarter)
        .set('sectorName', params.sectorName)
        .set('scorecardTitle', params.scorecardTitle)
        .set('kpiCode', params.kpiCode);
    }

    return this.http.get<kpiDetailsResponse>(
      this.baseUrl + 'v2/scrs/dashboard/sector/kpi-details',
      {
        params: this.httpParams,
      }
    );
  }
}
