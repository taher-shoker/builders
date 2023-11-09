import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
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
  [x: string]: any;
  reportService(arg0: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private http: HttpClient,
    private _cookieService: CookieService
  ) {}

  postReport(pageName: string) {
    const user = JSON.parse(
      this._cookieService.get('MODERN_SYSTEM_USER') || ''
    );

    const payload = {
      pageName: pageName,
      systemName: 'DI Dashboard',
      userName: user.username,
      userDisplayName: user.name,
      userJobTitle: user.jobTitle,
    };
    // const bodyObj = {pageName, systemName: "DI Dashboard"}
    return this.http.post(`${environment.reportApiUrl}/report/page`, payload);
  }
}
