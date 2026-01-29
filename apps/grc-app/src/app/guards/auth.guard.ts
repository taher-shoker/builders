import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ScorecardService } from "../services/scorecard.service";
export const AuthGuard:CanActivateFn = () => {
    const scorecardService = inject(ScorecardService);
    const router = inject(Router);
    const userRoles = scorecardService.userRoles;
    const isAdmin = userRoles.roles.some(role => role.roleName === 'BE_EDITORS' || role.roleName === "ADMINS"  || role.roleName === "BE_PMO");
    return isAdmin ? true : router.navigateByUrl("/")
}