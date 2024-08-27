import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const dataUploadGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const cookieService = inject(CookieService);
  const sectorName = cookieService.get('sectorName');
  let dataAdmin = false;
  const user = JSON.parse(cookieService.get('MODERN_SYSTEM_USER') || '');

  user.userGroups.map((group: any) => {
    if (group.groupName == 'Data_Admins') {
      console.log('hey inside guard');
      dataAdmin = true;
    }
  });

  if (dataAdmin) {
    return true;
  } else {
    router.navigate(['/sectorPage', sectorName]);
    return false;
  }
};
