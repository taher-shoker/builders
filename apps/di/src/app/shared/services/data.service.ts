import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  KpiDetails,
  KpiDetailsResponse,
  LevelOneResponse,
  LevelTwoResponse,
  LevelZeroResponse,
} from '../models/http-response.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  http = inject(HttpClient);

  /**
   * @returns The data of the level zero (DI Dashboard), a LevelZeroResponse object.
   */
  getLevelZeroData(): Observable<LevelZeroResponse> {
    return this.http.get<LevelZeroResponse>(`${environment.apiUrl}/l0`);
  }

  /**
   * @returns The Data of Level one (Di Dashboard)
   */
  getLevelOneData(): Observable<LevelOneResponse> {
    return this.http.get<LevelOneResponse>(`${environment.apiUrl}/l1`);
  }

  /**
   * @returns The KPI details
   */
  getKPIsOfBusinessName(): Observable<LevelTwoResponse> {
    // const params = {params: new HttpParams().set('kpiId', kpiId)}
    return this.http.get<LevelTwoResponse>(`${environment.apiUrl}/l2/kpi`);
  }

  /**
   * @param id Pass the ID of the KPI
   * @returns The KPI details for (Trend, goals & objectives, owners & definition)
   */

  getDetailsOfKPIs(id: string): Observable<KpiDetailsResponse> {
    const params = {params: new HttpParams().set('kpiId', id)}
    return this.http.get<KpiDetailsResponse>(`${environment.apiUrl}/l2/kpi/trend`, params);
  }
}
