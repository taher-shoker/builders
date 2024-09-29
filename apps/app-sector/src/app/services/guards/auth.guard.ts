import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  const token = cookieService.get('token') || '';

  if (!token) {
    authService.navigateToLogin();
    return false;
  } else if (!authService.isAdminUser()) {
    return true;
  }

  return false;
};
