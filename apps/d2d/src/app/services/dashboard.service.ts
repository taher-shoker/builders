import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DashboardUsersCases  } from '../views/dashboard/dashboard.component';
interface ProductivityChartData {
  data : {
    fraudUserDisplayName:string;
    productivityFrequency:number;
  }[]
}
interface StatusChartData {
  data : {
    caseStatus:string;
    caseCount:number;
  }[]
}
interface ChartTypesData {
  d2DCaseTypeCountDtoList: {
    caseType:string;
    caseCount:number;
  }[]
}
interface WeeklyTrendChart {
  data: {
    yearNum:number;
    weekNum:number;
    casesCount:number
  }[]
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient){}
  getDashboardUsersData():Observable<DashboardUsersCases>
  {
    return this.http.get<DashboardUsersCases>(`${environment.apiUrl}/dashboard`);
  }
  getWeeklyTrendChartData(username?:string , teamname?:string):Observable<WeeklyTrendChart>
  {
    return this.http.get<WeeklyTrendChart>(`${environment.apiUrl}/dashboard/trend?username=${username}`);
  }
  getProductivityChartData():Observable<ProductivityChartData>
  {
    return this.http.get<ProductivityChartData>(`${environment.apiUrl}/dashboard/chart/fraud`);
  }
  getStatusChartData():Observable<StatusChartData>
  {
    return this.http.get<StatusChartData>(`${environment.apiUrl}/dashboard/chart/status`);
  }
  getChartTypesData():Observable<ChartTypesData>
  {
    return this.http.get<ChartTypesData>(`${environment.apiUrl}/dashboard/chart/type`);
  }
}
