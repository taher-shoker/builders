import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService, System } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AgentService } from '../../shared/services/agent.service';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  apps: System[] = [];
  constructor(
    private cookieService: CookieService,
    public authService: AuthService,
    private router: Router,
    private agentService: AgentService
  ) {}
  ngOnInit(): void {
    if (this.cookieService.get('granted-systems')) {
      if (
        (JSON.parse(this.cookieService.get('granted-systems') || '').length ==
          0 ||
          this.apps.length == 0) &&
        !this.authService.isAdminUser()
      ) {
        this.authService.getUserData();
      }
    } else {
      this.authService.getUserData();
    }
  }

  getGrantedSystems() {
    if (this.apps.length == 0) {
      this.apps = this.authService.handleUserSystems();
    }
    if (this.agentService.isAgentFromMobileDevice()) {
      this.apps = this.apps.filter(
        (x) =>
          !x.displayName?.includes('DT') && !x.displayName?.includes('Fraud')
      );
    }
    return this.apps.length > 0;
  }
}
