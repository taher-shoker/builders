import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AgentService } from '../../shared/services/agent.service';
import { System } from '../../shared/models/auth.model';

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
    this.checkAndFetchUserData();
    this.getGrantedSystems();
  }

  private checkAndFetchUserData(): void {
    const grantedSystemsExist = this.cookieService.get('granted-systems');
    const isAdminUser = this.authService.isAdminUser();

    if (!grantedSystemsExist || (grantedSystemsExist && !isAdminUser)) {
      this.authService.getUserData();
    }
  }

  getGrantedSystems() {
    const grantedSystemsExist = this.cookieService.get('granted-systems');
    if (this.apps.length === 0 && grantedSystemsExist) {
      this.apps = this.authService.handleUserSystems();

      if (this.agentService.isAgentFromMobileDevice()) {
        this.filterAppsForMobile();
      }
    }
    return this.isGrantedSystemSettled();
  }

  private filterAppsForMobile(): void {
    this.apps = this.apps.filter(
      (app) =>
        !app.displayName?.includes('DT') && !app.displayName?.includes('Fraud')
    );
  }

  public isGrantedSystemSettled(): boolean {
    return !!this.cookieService.get('granted-systems');
  }
}
