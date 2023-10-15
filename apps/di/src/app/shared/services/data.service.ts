import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  Filters,
  KpiDetailsResponse,
  LevelOneResponse,
  LevelTwoResponse,
  LevelZeroResponse,
  UnitSectorGroup,
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
    return this.http.get<LevelZeroResponse>(`${window.location.origin}${environment.apiUrl}/l0`);
  }

  /**
   * @param unitSectorGroup pass the role of the user, to which group he relates
   * @returns The Data of Level one (Di Dashboard)
   */
  getLevelOneData(
    unitSectorGroup: UnitSectorGroup
  ): Observable<LevelOneResponse> {
    const params = {
      params: new HttpParams().set('unitSectorGroup', unitSectorGroup),
    };
    return this.http.get<LevelOneResponse>(`${window.location.origin}${environment.apiUrl}/l1`, params);
  }

  /**
   * @param unitSector Pass the name of the unit sector to show its details
   * @returns The KPI details
   */
  getKPIsOfBusinessName(unitSector: string): Observable<LevelTwoResponse> {
    const params = { params: new HttpParams().set('unitSector', unitSector) };
    return this.http.get<LevelTwoResponse>(
      `${window.location.origin}${environment.apiUrl}/l2/kpi`,
      params
    );
  }

  /**
   * @param id Pass the ID of the KPI
   * @returns The KPI details for (Trend, goals & objectives, owners & definition)
   */

  getDetailsOfKPIs(id: string): Observable<KpiDetailsResponse> {
    const params = { params: new HttpParams().set('kpiId', id) };
    return this.http.get<KpiDetailsResponse>(
      `${window.location.origin}${environment.apiUrl}/l2/kpi/trend`,
      params
    );
  }

  getFilters(): Observable<Filters>{
    return this.http.get<Filters>(`${window.location.origin}${environment.apiUrl}/l2/kpi/list`)
  }


  formatDate(freq: number, yearNum: number): string {
    let month = `${freq}`;
    const year: string = yearNum.toString();
    if (month.length < 2) month = '0' + month;
    return [year, month, '01'].join('-');
  }
}
