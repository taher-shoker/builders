import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const sectorsPageGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const cookieService = inject(CookieService);
  const sectorName = cookieService.get('sectorName');

  const user = JSON.parse(cookieService.get('MODERN_SYSTEM_USER') || '');

  router.navigate(['/sectorPage', sectorName]);
  return true;
};
