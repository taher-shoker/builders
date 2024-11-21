import { inject, Injectable } from '@angular/core';
import {
  NavLinks,
  ScorecardModel,
  UserGroup,
  UserModel,
} from '../models/scorecard.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
@Injectable({ providedIn: 'root' })
export class ScorecardService {
  private currMode: BehaviorSubject<'editMode' | 'viewMode'> = new BehaviorSubject<'editMode' | 'viewMode'>('viewMode');
  private currUsername = "";
  userRoles!:UserGroup;
  http = inject(HttpClient);
  cookieService = inject(CookieService)
  private readonly navItems: NavLinks[] = [
    {
      id: 1,
      name: 'sector scorecard',
      url: '/scorecard',
    },
    {
      id: 5,
      name: 'Financial Status',
      url: '/financial-reporting',
    },
    {
      id: 4,
      name: 'project execution',
      url: '/psr',
    },
    {
      id: 2,
      name: 'CAD strategy program',
      url: '/strategy-program',
    },
    // {
    //   id: 3,
    //   name: 'raqami',
    //   url: '/raqami',
    // },
  ];
  getUserGroups(): string {
    return this.cookieService.get('MODERN_SYSTEM_USER') || '';
  //   return '%7B%22id%22%3A148%2C%22name%22%3A%22Fahad%22%2C%22email%22%3A%22frawan.c%40stc.com.sa%22%2C%22jobTitle%22%3A%22PMO%22%2C%22userGroups%22%3A%5B%7B%22id%22%3A43%2C%22groupName%22%3A%22Business_Excellence_Dashboard_Editors%22%2C%22roles%22%3A%5B%7B%22id%22%3A23%2C%22roleName%22%3A%22BE_EDITORS%22%2C%22system%22%3A%7B%22id%22%3A7%2C%22name%22%3A%22Business_Excellence_Dashboard%22%7D%7D%5D%7D%5D%2C%22teams%22%3A%5B%5D%2C%22userDelegates%22%3A%5B%5D%2C%22username%22%3A%22frawan.c%40stc.com.sa%22%7D';
  }
  // getUserGroups(): UserModel {
  //   return JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
  // }
  // getCurrentSystem(): string {
  //   return JSON.parse(this.cookieService.get('granted-systems') || '')[0];
  // }
  getCurrentSystem(): string {
    return this.cookieService.get('granted-systems') || '';
    // return '%5B%22Jira_Dahsboard%22%2C%22DI_Management%22%2C%22CEO_DashboardUsers%22%2C%22FRAUD_ManagementUsers%22%2C%22Business_Excellence_Dashboard%22%5D';
  }
  getNavLinks(): NavLinks[] {
    return this.navItems;
  }
  setUsername(name:string)
  {
    this.currUsername = name;
  }
  getUsername():string
  {
    return this.currUsername;
  }
  getScorecardData(month?: number, year?: number , groupName?: string): Observable<ScorecardModel[]> {
    if(groupName && month && year)
    {
      return this.http.get<ScorecardModel[]>(
        `${environment.apiUrl}/business-excellence/scorecards?month=${month}&year=${year}&group=${groupName}`
      );
    }
    else if(month && year && !groupName)
    {
      return this.http.get<ScorecardModel[]>(
        `${environment.apiUrl}/business-excellence/scorecards?month=${month}&year=${year}`
      );
    }
    return this.http.get<ScorecardModel[]>(
      `${environment.apiUrl}/business-excellence/scorecards`
    );
  }
  setEditMode(mode: 'editMode' | 'viewMode') {
    this.currMode.next(mode);
  }
  getCurrentMode(): BehaviorSubject<'editMode' | 'viewMode'> {
    return this.currMode;
  }
  uploadFile(selectedFile: any): Observable<any> {
    const formData = new FormData();
    formData.append('multipartFile', selectedFile, selectedFile.name);
    return this.http.post<any>(
      `${environment.apiUrl}/business-excellence/scorecards/upload`,
      formData
    );
  }
  downloadTemplate(tabName?: string , month?:number , year?:number): Observable<string> {
    if(tabName && month && year)
    {
      return this.http.get<string>(
        `${environment.apiUrl}/business-excellence/scorecards/download?month=${month}&year=${year}&group=${tabName}`,
        { observe: 'body', responseType: 'text' as 'json' }
      );
    } else {
      return this.http.get<string>(
        `${environment.apiUrl}/business-excellence/scorecards/download`,
        { observe: 'body', responseType: 'text' as 'json' }
      );
    }
  }
  getCurrentUserInfo():Observable<UserModel>
  {
    const headers={
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }
    return this.http.get<UserModel>('http://localhost:9084/cem/reporting-api/user/getCurrentUserData' , headers);
  }
}
