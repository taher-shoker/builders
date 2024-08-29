import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const KPIGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const cookieService = inject(CookieService);
  const sectorName = cookieService.get('sectorName');
  const kpiCode = cookieService.get('kpiCode');

  router.navigate(['/sectors', sectorName, 'KPI', kpiCode]);
  return false;
};
