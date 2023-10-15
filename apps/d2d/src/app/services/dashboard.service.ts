import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DashboardUsersCases } from '../views/dashboard/dashboard.component';
import { DateRange, WeeklyDateObj } from '@stc-apps/shared-ui';
interface ProductivityChartData {
  data: {
    fraudUserDisplayName: string;
    productivityFrequency: number;
  }[];
}
interface StatusChartData {
  data: {
    caseStatus: string;
    caseCount: number;
  }[];
}
interface ChartTypesData {
  d2DCaseTypeCountDtoList: {
    caseType: string;
    caseCount: number;
  }[];
}
interface WeeklyTrendChart {
  data: {
    yearNum: number;
    weekNum: number;
    casesCount: number;
  }[];
}
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = `${window.location.origin}${environment.apiUrl}/fm`;

  constructor(private http: HttpClient) {}

  getDashboardUsersData(): Observable<DashboardUsersCases> {
    return this.http.get<DashboardUsersCases>(`${this.baseUrl}/dashboard`);
  }

  getInsightsCards(fromDate: string, toDate: string) {
    return this.http.get<StatusChartData>(
      `${this.baseUrl}/dashboard/chart/status/user?startDate=${fromDate}&endDate=${toDate}`
    );
  }

  getWeeklyTrendChartData(
    username?: string,
    teamname?: string,
    fromDate?: WeeklyDateObj,
    toDate?: WeeklyDateObj
  ): Observable<WeeklyTrendChart> {
    if (fromDate && toDate) {
      if (teamname) {
        return this.http.get<WeeklyTrendChart>(
          `${this.baseUrl}/dashboard/trend?weekFrom=${fromDate?.week}&yearFrom=${fromDate?.year}&weekTo=${toDate?.week}&yearTo=${toDate?.year}&teamName=${teamname}`
        );
      } else {
        return this.http.get<WeeklyTrendChart>(
          `${this.baseUrl}/dashboard/trend?weekFrom=${fromDate?.week}&yearFrom=${fromDate?.year}&weekTo=${toDate?.week}&yearTo=${toDate?.year}&username=${username}`
        );
      }
    } else {
      if (teamname) {
        return this.http.get<WeeklyTrendChart>(
          `${this.baseUrl}/dashboard/trend?teamName=${teamname}`
        );
      } else {
        return this.http.get<WeeklyTrendChart>(
          `${this.baseUrl}/dashboard/trend?username=${username}`
        );
      }
    }
  }

  getProductivityChartData(
    fromDate?: string,
    toDate?: string
  ): Observable<ProductivityChartData> {
    if (fromDate && toDate) {
      return this.http.get<ProductivityChartData>(
        `${this.baseUrl}/dashboard/chart/fraud?startDate=${fromDate}&endDate=${toDate}`
      );
    } else {
      return this.http.get<ProductivityChartData>(
        `${this.baseUrl}/dashboard/chart/fraud`
      );
    }
  }

  getStatusChartData(
    fromDate?: string,
    toDate?: string
  ): Observable<StatusChartData> {
    let params = undefined;

    if (fromDate && toDate) {
      params = { startDate: fromDate, endDate: toDate };
    }

    return this.http.get<StatusChartData>(
      `${this.baseUrl}/dashboard/chart/status`,
      { params }
    );
  }

  getChartTypesData(
    fromDate?: string,
    toDate?: string
  ): Observable<ChartTypesData> {
    let params = undefined;

    if (fromDate && toDate) {
      params = { startDate: fromDate, endDate: toDate };
    }
    return this.http.get<ChartTypesData>(
      `${this.baseUrl}/dashboard/chart/type`,
      { params }
    );
  }
}
