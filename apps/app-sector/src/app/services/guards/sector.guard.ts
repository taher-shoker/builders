import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SectorService } from '../sector.service';

export const sectorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sectorService = inject(SectorService);

  const sectorName = sectorService.getSectorName();

  if (sectorName) {
    // User has selected a sector, allow navigation
    return true;
  } else {
    // No sector selected, redirect to welcome
    router.navigate(['/welcome']);
    return false;
  }
};
