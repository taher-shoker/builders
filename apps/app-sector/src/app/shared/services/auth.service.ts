import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from '../models/user.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-sector/src/environments/environment';

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

  getUserData() {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');

    const fraudUser: LoggedUser = {
      ...user,
    };
    this.loggedUserStream.next(fraudUser);
  }
  logout() {
    this.user.next(null);
    this.cookieService.remove('token');
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
}
