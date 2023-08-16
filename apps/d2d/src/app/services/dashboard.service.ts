import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DashboardUsersCases  } from '../views/dashboard/dashboard.component';
import { DateRange, WeeklyDateObj } from '@stc-apps/shared-ui';
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

  getWeeklyTrendChartData(fromDate?: WeeklyDateObj, toDate?: WeeklyDateObj, username?:string , teamname?:string):Observable<WeeklyTrendChart>
  {
    if(teamname){
      return this.http.get<WeeklyTrendChart>(`${environment.apiUrl}/dashboard/trend?weekFrom=${fromDate?.week}&yearFrom=${fromDate?.year}&weekTo=${toDate?.week}&yearTo=${toDate?.year}&teamName=${teamname}`);
    }else{
      return this.http.get<WeeklyTrendChart>(`${environment.apiUrl}/dashboard/trend?weekFrom=22&yearFrom=2023&weekTo=50&yearTo=2023&username=${username}`);
    }
  }

  getProductivityChartData(fromDate?: string, toDate?: string):Observable<ProductivityChartData>
  {
    return this.http.get<ProductivityChartData>(`${environment.apiUrl}/dashboard/chart/fraud`);
  }

  getStatusChartData(fromDate?: string, toDate?: string):Observable<StatusChartData>
  {
    let params = undefined;

    if(fromDate && toDate){
      params = {startDate: fromDate, endDate: toDate}
    }

    return this.http.get<StatusChartData>(`${environment.apiUrl}/dashboard/chart/status`, {params});
  }

  getChartTypesData(fromDate?: string, toDate?: string):Observable<ChartTypesData>
  {

    let params = undefined;

    if(fromDate && toDate){
      params = {startDate: fromDate, endDate: toDate}
    }
    return this.http.get<ChartTypesData>(`${environment.apiUrl}/dashboard/chart/type`, {params});
  }

}
