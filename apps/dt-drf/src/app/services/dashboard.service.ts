/* eslint-disable @typescript-eslint/no-inferrable-types */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
// import { environment } from 'apps/d2d/src/environments/environment';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
  slaDuration: number;
  isDeletable: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.apiUrl;
  dtUrl = `${this.baseUrl}v2/report-flow-service/`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

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
  getAllReportsChart(filterData?: any) {
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
    return this.http.get<any>(`${this.dtUrl}dashboard/reports-per-months`, {
      params,
    });
  }
  getReportsSLA(filterData?: any) {
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
    return this.http.get<any>(`${this.dtUrl}dashboard/reports-sla`, {
      params,
    });
  }

  getReportsCategory(filterData?: any) {
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
    return this.http.get<any>(`${this.dtUrl}dashboard/reports-per-category`, {
      params,
    });
  }

  getReportsAvgReponse(filterData?: any) {
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
    return this.http.get<any>(`${this.dtUrl}dashboard/reports-per-category`, {
      params,
    });
  }
}
