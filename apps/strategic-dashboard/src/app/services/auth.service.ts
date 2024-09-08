import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoggedUser {
  id: number;
  email: string;
  name: string;
  jobTitle: string;
  roles: string[];
  userGroups: any[];
  teamName: null | string;
}
export interface AuthResponseData {
  token: string;
  displayName: string;
  expiresIn?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // baseUrl = `${window.location.origin}${environment.apiUrl}/fm`;
  baseUrl = `${environment.apiUrl}`;

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

  getUserData() {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    const roles = user.userGroups
      .filter((g: any) => g.roles[0].system.name === 'DI_Milestones')
      .map((t: any) => {
        return t.roles[0].roleName;
      });
    const teamName = user.userGroups
      .filter((g: any) => g.roles[0].system.name === 'DI_Milestones')
      .map((t: any) => {
        return t.groupName;
      })[0];
    const fraudUser: LoggedUser = {
      roles: roles,
      teamName: teamName,
      ...user,
    };
    this.loggedUserStream.next(fraudUser);
    this.loggedInUser = fraudUser;
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
    this.cookieService.removeAll();
    this.tokenExpirationTimer = null;
    //  this.loggedUserStream.next(null);
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

    //localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
