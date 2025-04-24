/* eslint-disable @typescript-eslint/no-inferrable-types */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
// import { environment } from 'apps/d2d/src/environments/environment';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  AvgReportChart,
  CategoryReportChart,
  SLAReportChart,
} from './models/report-flow.model';

export interface Category {
  id: number;
  name: string;
  slaDuration: number;
  isDeletable: boolean;
}
export interface ReportData {
  year: number;
  month: number;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.apiUrl;
  dtUrl = `${this.baseUrl}v2/report-flow-service/`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private createHttpParams(
    filterData?: Record<string, string | number | undefined>
  ): HttpParams {
    const cleanedData = Object.fromEntries(
      Object.entries(filterData || {}).filter(
        ([, value]) => value !== undefined && value !== '' && value !== null
      )
    ) as Record<string, string | number>;

    return new HttpParams({ fromObject: cleanedData });
  }

  /**
   *
   * @param filterData Filtration data of the search request
   * @returns Reports either filtered or none if no filters passed.
   */

  getDashboardStatistics(filterData?: any) {
    // Convert filterData to HttpParams
    let params = new HttpParams();
    if (filterData) {
      Object.entries(filterData).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== '' &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          params = params.append(key, value);
        }
      });
    }
    // Perform the GET request with the params
    return this.http.get<any>(`${this.dtUrl}dashboard/reports-count`, {
      params,
    });
  }
  getAllReportsChart(
    filterData?: Record<string, string | number | undefined>
  ): Observable<ReportData[]> {
    const params = this.createHttpParams(filterData);

    return this.http.get<ReportData[]>(
      `${this.dtUrl}dashboard/reports-per-months`,
      {
        params,
      }
    );
  }

  getReportsSLA(
    filterData?: Record<string, string | number | undefined>
  ): Observable<SLAReportChart[]> {
    const params = this.createHttpParams(filterData);

    // Perform the GET request with the params
    return this.http.get<SLAReportChart[]>(
      `${this.dtUrl}dashboard/reports-sla`,
      {
        params,
      }
    );
  }

  getReportsCategory(
    filterData?: Record<string, string | number | undefined>
  ): Observable<CategoryReportChart[]> {
    const params = this.createHttpParams(filterData);

    return this.http.get<CategoryReportChart[]>(
      `${this.dtUrl}dashboard/reports-per-category`,
      {
        params,
      }
    );
  }

  getReportsAvgReponse(
    filterData?: Record<string, string | number | undefined>
  ): Observable<AvgReportChart[]> {
    const params = this.createHttpParams(filterData);

    return this.http.get<AvgReportChart[]>(
      `${this.dtUrl}dashboard/reports-avg-response`,
      {
        params,
      }
    );
  }
}
