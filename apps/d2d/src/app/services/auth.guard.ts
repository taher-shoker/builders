import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.cookieService.get('token')
      ? this.cookieService.get('token')
      : '';

    if (!token) {
      this.authService.navigateToLogin();
      return false;
    } else if (!this.authService.isAdminUser()) {
      return true;
    }
    return false;
  }
}
