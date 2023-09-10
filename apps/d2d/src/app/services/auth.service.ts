import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from './user.model';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
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

  login(data: any) {
    return this.http
      .post<AuthResponseData>(
        `${environment.authUrl}/cem/reporting-api/user/authenticate`,
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(resData.displayName, resData.token);
          this.getUserData();
        })
      );
  }
  getUserData() {
    this.http
      .get<LoggedUser>(`${environment.apiUrl}/users/currentUser`)
      .subscribe((res: LoggedUser) => {
        this.cookieService.set('fraud-roles', res?.roles[0]);
        if (res.roles.includes('ADMINS')) {
          this.router.navigate(['/users-setting']);
        } else {
          this.router.navigate(['/home']);
        }
      });
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
    this.router.navigate([environment?.loginPath]);
    this.cookieService.deleteAll();
    this.tokenExpirationTimer = null;
    this.loggedUserStream.next(null);
    this.loggedInUser = null;
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
      .get<LoggedUser>(`${environment.apiUrl}/users/currentUser`)
      .subscribe((res: LoggedUser) => {
        this.loggedInUser = res;
        this.loggedUserStream.next(res);
        this.cookieService.set('fraud-roles', JSON.stringify(res.roles));
        // if(this.loggedInUser.roles.includes("APPROVERS")){
        //   this.setSystemTeams(); // Since the user is of team APPROVERS, we need to feed the teams to the system. else don't !
        // }
      });
  }

  private handleAuthentication(displayName: string, token: string) {
    const user = new User(displayName, token);
    this.user.next(user);
    this.cookieService.set('token', token);
    this.cookieService.set('displayName', displayName);

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
