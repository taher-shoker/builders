import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ScorecardService } from "../services/scorecard.service";
import { DeviceService } from "../services/device.service";
export const IsNotMobileGuard:CanActivateFn = () => {
    const deviceService = inject(DeviceService);
    const router = inject(Router);
    return !deviceService.isMobile() ? true : router.navigateByUrl("/")
}