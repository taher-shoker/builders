import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ScorecardService } from "../services/scorecard.service";

export const AgileTransformationGuard: CanActivateFn = () => {
  const scorecardService = inject(ScorecardService);
  const router = inject(Router);
  try {
    const raw = scorecardService.getUserGroups();
    if (!raw) return router.navigateByUrl("/home");
    const user = JSON.parse(decodeURIComponent(raw));
    const hasAccess =
      Array.isArray(user.pageAccess) &&
      user.pageAccess.some((p: any) => p.slug === "agile-transformation");
    return hasAccess ? true : router.navigateByUrl("/home");
  } catch {
    return router.navigateByUrl("/home");
  }
};
