import { CanActivateFn,Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('inside auth guard');
  
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  const token = cookieService.get('token') || '';

  if (!token) {
    console.log('navigate to login');

    authService.navigateToLogin();
    return false;
  } else if (!authService.isAdminUser()) {
    return true;
  }

  return false;
};
