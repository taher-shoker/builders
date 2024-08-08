import { inject, Injectable } from '@angular/core';
import {
  NavLinks,
  ScorecardModel,
  ScorecardTaps,
  UserModel,
} from '../models/scorecard.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class ScorecardService {
  private currMode: BehaviorSubject<'editMode' | 'viewMode'> = new BehaviorSubject<'editMode' | 'viewMode'>('viewMode');
  private currUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');
  http = inject(HttpClient);
  private readonly scorecardsTaps: ScorecardTaps[] = [
    {
      id: 1,
      name: 'financial',
      value : 'financial'
    },
    {
      id: 2,
      name: 'strategic',
      value : 'strategic'
    },
    {
      id: 3,
      name: 'relational',
      value : 'relational'
    },
    {
      id: 4,
      name: 'operational',
      value : 'operational'
    },
    {
      id: 5,
      name: 'corporate priorities',
      value : 'corporate'
    },
  ];
  private readonly navItems: NavLinks[] = [
    {
      id: 1,
      name: 'scorecard',
      url: '/scorecard',
    },
    // {
    //   id: 2,
    //   name: 'CAD strategy program',
    //   url: '/strategy-program',
    // },
    // {
    //   id: 3,
    //   name: 'raqami',
    //   url: '/raqami',
    // },
    // {
    //   id: 4,
    //   name: 'PSR',
    //   url: '/psr',
    // },
  ];
  getScorecardsTaps(): ScorecardTaps[] {
    return this.scorecardsTaps;
  }
  getNavLinks(): NavLinks[] {
    return this.navItems;
  }
  getScorecardData(groupName: string, month: number, year: number): Observable<ScorecardModel[]> {
    return this.http.get<ScorecardModel[]>(
      `${environment.apiUrl}/business-excellence/scorecards?month=${month}&year=${year}&group=${groupName}`
    );
  }
  setEditMode(mode: 'editMode' | 'viewMode') {
    this.currMode.next(mode);
  }
  getCurrentMode(): BehaviorSubject<'editMode' | 'viewMode'> {
    return this.currMode;
  }
  setUsername(username:string) {
    this.currUsername.next(username);
  }
  getUsername(): BehaviorSubject<string> {
    return this.currUsername;
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
