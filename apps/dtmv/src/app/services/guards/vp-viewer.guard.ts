import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MilestonesService } from '../../views/milestones-setting/milestones.service';

export const VpViewerGuard: CanActivateFn = (route, state): boolean => {
  const milestoneService: MilestonesService = inject(MilestonesService);

  if (!milestoneService.isVPViewer) {
    return false;
  } else {
    return true;
  }
};
