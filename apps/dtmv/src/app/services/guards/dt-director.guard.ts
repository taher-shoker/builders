import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MilestonesService } from '../../views/milestones-setting/milestones.service';

export const dtDirectorGuard: CanActivateFn = (route, state): boolean => {
  const milestoneService: MilestonesService = inject(MilestonesService);

  if (milestoneService.checkIsDirector()) {
    return false;
  } else {
    return true;
  }
};
