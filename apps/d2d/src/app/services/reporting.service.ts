import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie';

export interface DatesQuery {
  yearFrom: string;
  yearTo: string;
  monthFrom: string;
  monthTo: string;
  dayFrom: string;
  dayTo: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportingService {
  constructor(private http: HttpClient, private _cookieService:CookieService) {}

  postReport(pageName: string) {
    const user= JSON.parse(
      this._cookieService.get('MODERN_SYSTEM_USER') || ''
    );

    const payload = {
      pageName: pageName,
      systemName: 'Fraud Management',
      userName: user.username,
      userDisplayName: user.name,
      userJobTitle: user.jobTitle,
    };
    // const bodyObj = { pageName, systemName: 'Fraud Management' };
    return this.http.post(`${environment.reportApiUrl}/report/page`, payload);
  }

  // getReport(datesObj? : DatesQuery){
  //   if(datesObj){
  //     return this.http.get(`${environment.apiUrl}/report/page?dateFrom=${datesObj.yearFrom}-${datesObj.monthFrom}-${datesObj.dayFrom}&dateTo=${datesObj.yearTo}-${datesObj.monthTo}-${datesObj.dayTo}`)
  //   }else{
  //     return this.http.get(`${environment.apiUrl}/report/page`)
  //   }
  // }

  // getLogin(datesObj? : DatesQuery){
  //   if(datesObj){
  //     return this.http.get(`${environment.apiUrl}/report/page?pageName=Authenticcation-Done&dateFrom=${datesObj.yearFrom}-${datesObj.monthFrom}-${datesObj.dayFrom}&dateTo=${datesObj.yearTo}-${datesObj.monthTo}-${datesObj.dayTo}`)
  //   }else{
  //     return this.http.get(`${environment.apiUrl}/report/page?pageName=Authenticcation-Done`)
  //   }
  // }
}
