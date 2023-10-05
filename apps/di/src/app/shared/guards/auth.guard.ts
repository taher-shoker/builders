import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = (route, state): boolean => {
  const auth = inject(AuthService);
  // const router = inject(Router);
  const cookiesService = inject(CookieService);

  // return auth.isLoggedIn.pipe(
  //   // map(isLoggedIn => isLoggedIn || router.createUrlTree(['login']))
  //   map(isLoggedIn => isLoggedIn )
  // );

  const token = cookiesService.get('token');

  if (!token) {
    console.log(environment.loginPath);
    window.location.href = environment.loginPath;
    return false;
  } else if (auth.isDiUser()) {
    return true;
  }
  window.location.href = environment.loginPath;
  return false;
};
