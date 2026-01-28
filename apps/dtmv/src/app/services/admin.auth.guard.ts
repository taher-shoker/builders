import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';
import { MilestonesService } from '../views/milestones-setting/milestones.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    public cookieService: CookieService,
    private milestonesService: MilestonesService
  ) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.cookieService.get('token')
      ? this.cookieService.get('token')
      : '';

    if (!token) {
      this.authService.navigateToLogin();
      return false;
    }

    const isAdminByRole = this.authService.isAdminUser();
    const isAdminByGroup = this.milestonesService.checkIsAdmin();

    if (isAdminByRole || isAdminByGroup) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
