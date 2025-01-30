import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserGroup } from '../models/scorecard.model';
import { HttpClient } from '@angular/common/http';
import { ActivityLogData, ActivityLogRes } from '../models/activity-logs';
import { DeletedProgram } from '../models/deleted-items';
import { PSRProjectDetailsModel } from '../models/psr.model';
import { StrategyProgramKpiDetailsModel } from '../models/strategy-program.model';
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
  getSpecificActivityLog(moduleName:string , activityType:string , subModule?:string , projectName?:string , entity?:string):Observable<ActivityLogData[]>
  {
    let url = `${environment.apiUrl}/business-excellence/log/recent?module=${moduleName}&activityType=${activityType}`;
    if(subModule)
    {
      const subMod = encodeURIComponent(subModule);
      url += `&subModule=${subMod}`;
    }
    if(projectName)
    {
      const proj = encodeURIComponent(projectName);
      url += `&attribute=${proj}`;
    }
    if(entity)
    {
      url += `&entity=${entity}`;
    }
    return this.http.get<ActivityLogData[]>(url);
  }
  getDeletedPrograms(moduleName:string , isDetails:boolean):Observable<DeletedProgram[]>
  {
    return this.http.get<DeletedProgram[]>(`${environment.apiUrl}/business-excellence/log/deleted?module=${moduleName}&isDetails=${isDetails}`);
  }
  getPSRDeletedProjects(moduleName:string , isDetails:boolean):Observable<PSRProjectDetailsModel[]>
  {
    return this.http.get<PSRProjectDetailsModel[]>(`${environment.apiUrl}/business-excellence/log/deleted?module=${moduleName}&isDetails=${isDetails}`);
  }
  getCADDeletedProjects(moduleName:string , isDetails:boolean):Observable<StrategyProgramKpiDetailsModel[]>
  {
    return this.http.get<StrategyProgramKpiDetailsModel[]>(`${environment.apiUrl}/business-excellence/log/deleted?module=${moduleName}&isDetails=${isDetails}`);
  }
}
