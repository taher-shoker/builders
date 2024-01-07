import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AgentService {

  isAgentFromMobileDevice() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // console.log("mobile device");
      return true;
    } else {
      // console.log("not mobile device");
      return false;
    }
  }
}
