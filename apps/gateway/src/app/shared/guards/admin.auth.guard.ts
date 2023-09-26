import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard {
  constructor(
    public authService: AuthService,
    public router: Router,
    public cookieService: CookieService
  ) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // debugger;
    if (this.authService.isAdminUser()) {
      return true;
    } else {
      return true;
    }
  }
}
