import { inject, Injectable } from '@angular/core';
import {
  NavLinks,
  ScorecardModel,
  UserGroup,
  UserGroupRoles,
  UserModel,
} from '../models/scorecard.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
@Injectable({ providedIn: 'root' })
export class ScorecardService {
  private currMode: BehaviorSubject<'editMode' | 'viewMode'> =
    new BehaviorSubject<'editMode' | 'viewMode'>('viewMode');
  toggleSwitchBtn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private currUsername = '';
  userRoles!: UserGroup;
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  private navItems: NavLinks[] = [
    {
      id: 1,
      name: 'sector scorecards',
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
      name: 'AI&DS strategy programs',
      url: '/strategy-program',
    },
    {
      id: 6,
      name: 'Activity Log Center',
      url: '/activity-logs',
    },
    {
      id: 7,
      name: 'Digital Transformation',
      url: '/digital-transformation',
    },
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
    // {
    //   id: 3,
    //   name: 'raqami',
    //   url: '/raqami',
    // },
  ];
  getUserGroups(): string {
    return this.cookieService.get('MODERN_SYSTEM_USER') || '';
  }
  getCurrentSystem(): string {
    if (this.cookieService.get('granted-systems')) {
      const systemName =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (
          JSON.parse(this.cookieService.get('granted-systems')!) as string[]
        ).find((x) => x === 'Business_Excellence_Dashboard');
      return systemName ? systemName : '';
    }
    return '';
  }
  getNavLinks(): NavLinks[] {
    if (this.getUserGroups()) {
      const allNavs: NavLinks[] = [
        {
          id: 1,
          name: 'sector scorecards',
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
          name: 'AI&DS strategy programs',
          url: '/strategy-program',
        },
        {
          id: 7,
          name: 'Digital Transformation',
          url: '/digital-transformation',
        },
      ];
      const userGroup = JSON.parse(this.getUserGroups());
      const matchingGroup = userGroup.userGroups.find((group: UserGroup) => {
        return group.roles.some((role: UserGroupRoles) => {
          return this.getCurrentSystem() === role.system.name;
        });
      });
      const isAllowed = matchingGroup.roles.some(
        (role: any) =>
          role.roleName === 'BE_EDITORS' || role.roleName === 'ADMINS'
      );
      // console.log(isAllowed);
      return isAllowed ? this.navItems : allNavs;
    }
    return [];
  }
  setUsername(name: string) {
    this.currUsername = name;
  }
  getUsername(): string {
    return this.currUsername;
  }
  getScorecardData(
    month?: number,
    year?: number,
    groupName?: string
  ): Observable<ScorecardModel[]> {
    if (groupName && month && year) {
      return this.http.get<ScorecardModel[]>(
        `${environment.apiUrl}/business-excellence/scorecards?month=${month}&year=${year}&group=${groupName}`
      );
    } else if (month && year && !groupName) {
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
  downloadTemplate(
    tabName?: string,
    month?: number,
    year?: number
  ): Observable<string> {
    if (tabName && month && year) {
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
  getCurrentUserInfo(): Observable<UserModel> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get<UserModel>(
      'http://localhost:9084/cem/reporting-api/user/getCurrentUserData',
      headers
    );
  }
}
