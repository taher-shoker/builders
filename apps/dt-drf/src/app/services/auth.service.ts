import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoggedUser {
  id: number;
  email: string;
  name: string;
  jobTitle: string;
  roles: string[];
  teamName: null | string;
}
export interface AuthResponseData {
  token: string;
  displayName: string;
  expiresIn?: string;
}
export class User {
  constructor(public userName: string, private token: string) {}
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // baseUrl = `${window.location.origin}${environment.apiUrl}/fm`;
  baseUrl = `${environment.apiUrl}/fm`;

  user = new BehaviorSubject<any>(null);
  private tokenExpirationTimer: any;

  loggedInUser!: LoggedUser | null;

  loggedUserStream: BehaviorSubject<LoggedUser | null> =
    new BehaviorSubject<LoggedUser | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}
  reportStatus: { value: string; name: string }[] = [
    { value: 'pending', name: 'Pending' },
    { value: 'completed', name: 'Completed' },
    // { value: 'breached', name: 'Breached' },
    { value: 'deleted', name: 'Deleted' },
  ];
  getUserData() {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    const roles = user.userGroups
      .filter((g: any) => g.roles[0].system.name === 'Dynamic_Report_Flow')
      .map((t: any) => {
        return t.roles[0].roleName;
      });
    const teamName = user.userGroups
      .filter((g: any) => g.roles[0].system.name === 'Dynamic_Report_Flow')
      .map((t: any) => {
        return t.groupName;
      })[0];
    const mergedUser: LoggedUser = {
      roles: roles,
      teamName: teamName,
      ...user,
    };
    this.loggedUserStream.next(mergedUser);
    this.loggedInUser = mergedUser;
  }

  isAdminUser() {
    return this.loggedUserStream.getValue()?.roles.includes('ADMINS');
  }

  autoLogin() {
    const userData: {
      userName: string;
      token: string;
    } = JSON.parse(localStorage?.getItem('userData') || '');
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.userName, userData.token);

    if (loadedUser.userName) {
      this.user.next(loadedUser);
    }
  }

  logout() {
    this.user.next(null);
    this.cookieService.remove('token');
    this.tokenExpirationTimer = null;
    this.loggedInUser = null;
    this.navigateToLogin();
  }

  navigateToLogin() {
    window.location.href = window.location.origin + environment.loginPath;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  getLoggedInUser(): LoggedUser {
    return this.loggedInUser!;
  }

  setLoggedInUser(): void {
    this.http
      .get<LoggedUser>(`${this.baseUrl}/users/currentUser`)
      .subscribe((res: LoggedUser) => {
        this.loggedInUser = res;
        this.loggedUserStream.next(res);
        this.cookieService.put('fraud-roles', res.roles[0]);
        this.cookieService.put('fraud-user', JSON.stringify(res));
      });
  }

  private handleAuthentication(displayName: string, token: string) {
    const user = new User(displayName, token);
    this.user.next(user);
    this.cookieService.put('token', token);
    this.cookieService.put('displayName', displayName);
  }
}
