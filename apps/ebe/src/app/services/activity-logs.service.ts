import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserGroup } from '../models/scorecard.model';
import { HttpClient } from '@angular/common/http';
import { ActivityLogData, ActivityLogRes } from '../models/activity-logs';
@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  http = inject(HttpClient);
  getActivityLogsData(moduleName:string , page:number , pageSize:number , username?:string , activityType?:string , startDate?:string , endDate?:string):Observable<ActivityLogRes>
  {
    let url = `${environment.apiUrl}/business-excellence/log?module=${moduleName}&page=${page}&pageSize=${pageSize}`
    if(username)
    {
      url += `&username=${username}`;
    }
    if(activityType)
    {
      url += `&activityType=${activityType}`;
    }
    if(startDate)
    {
      url += `&startDate=${startDate}`;
    }
    if(endDate)
    {
      url += `&endDate=${endDate}`;
    }
    return this.http.get<ActivityLogRes>(url);
  }
  getSpecificActivityLog(moduleName:string , subModule?:string , projectName?:string , entity?:string):Observable<ActivityLogData[]>
  {
    let url;
    if(moduleName === 'CAD')
    {
      url = `${environment.apiUrl}/business-excellence/log/recent?module=${moduleName}&activityType=Import,Export`;
    }
    else if(moduleName === 'PSR')
    {
      url = `${environment.apiUrl}/business-excellence/log/recent?module=${moduleName}&activityType=Add,Import,Export,Delete`;
    } else {
      url = `${environment.apiUrl}/business-excellence/log/recent?module=${moduleName}`;
    }
    if(subModule)
    {
      url += `&subModule=${subModule}`;
    }
    if(projectName)
    {
      url += `&attribute=${projectName}`;
    }
    if(entity)
    {
      url += `&entity=${entity}`;
    }
    return this.http.get<ActivityLogData[]>(url);
  }
}
