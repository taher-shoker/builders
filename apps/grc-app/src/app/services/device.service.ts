import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class DeviceService {
  isMobile(): boolean {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
  isDesktop(): boolean {
    return !this.isMobile();
  }
  getDefaultRedirect() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
      ? 'home'
      : 'scorecard';
  }
}
