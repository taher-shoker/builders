import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { UserRoles } from '../models/role.model';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const userRolesResolver: ResolveFn<UserRoles> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(AuthService).getCurrentUserRoles();
};
