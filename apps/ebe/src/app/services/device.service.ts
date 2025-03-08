import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class DeviceService {
  private mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i; 
  constructor() {}
  // isMobile(): boolean {
  //   return this.mobileRegex.test(navigator.userAgent);
  // }
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
}
