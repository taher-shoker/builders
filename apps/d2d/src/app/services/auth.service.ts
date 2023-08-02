import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from './user.model';

export interface AuthResponseData {
  token: string;
  displayName: string;
  expiresIn?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<any>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login(data: any) {
    return this.http
      .post<AuthResponseData>(
        'http://localhost:9084/cem/reporting-api/user/authenticate',
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(resData.displayName, resData.token);
          this.router.navigate(['/home']);
        })
      );
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
    this.router.navigate(['/login']);
    this.cookieService.deleteAll();
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(displayName: string, token: string) {
    const user = new User(displayName, token);
    this.user.next(user);
    this.cookieService.set('fraud-token', JSON.stringify(token));
    this.cookieService.set('fraud-user', JSON.stringify(displayName));

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
