import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService, System } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

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
    private router: Router
  ) {}
  ngOnInit(): void {
    // this.authService.getUserData();
    this.apps = this.authService.availableSystems || [];

    if (this.apps.length == 0) {
      // the user has access to legacy systems TP or CEO
      const gratnedSystems: string[] = JSON.parse(
        this.cookieService.get('granted-systems') || ''
      );
      if (gratnedSystems.length > 1) {
        if (gratnedSystems) {
          gratnedSystems.forEach((system) => {
            switch (system) {
              case 'TP_DashboardUsers':
                this.apps.push({
                  systemUrl: environment.systems.tp_system,
                  name: 'TP Dashboard',
                  displayName: 'TP Dashboard',
                });
                break;
              case 'CEO_DashboardUsers':
                this.apps.push({
                  systemUrl:
                    environment.systems.ceo_system +
                    this.cookieService.get('ceo-username'),
                  name: 'CCEX Workspace',
                  displayName: 'CCEX Workspace',
                });
                break;
              case 'FRAUD_ManagementUsers':
                this.authService.setLoggedInUser();
                this.apps.push({
                  systemUrl: environment.systems.fraud_system,
                  name: 'Fraud Management Workspace',
                  displayName: 'Fraud Management Workspace',
                });
                break;
              case 'DI_Management':
                this.authService.setLoggedInUser();
                this.apps.push({
                  systemUrl: environment.systems.di_system,
                  name: 'DT Workspace',
                  displayName: 'DT Workspace',
                });
                break;
              default:
                break;
            }
          });
        }
      } else {
        // navigate to the system directly after checking the user role
        if (gratnedSystems[0] === 'TP_DashboardUsers') {
          // the user is related to the TP only
          if (this.cookieService.get('tp-role') === 'ADMIN_TECHNICAL') {
            // navigate to the admin module
            window.location.href = environment.systems.tp_admin_system;
          } else {
            // navigate to the app
            window.location.href = environment.systems.tp_system;
          }
        }

        if (gratnedSystems[0] === 'CEO_DashboardUsers') {
          // the user is related to the CEO only
          // navigate to the CEO Link
          window.location.href =
            environment.systems.ceo_system +
            this.cookieService.get('ceo-username');
        }

        if (gratnedSystems[0] === 'FRAUD_ManagementUsers') {
          // the user is related to the Fraud only
          if (
            this.authService.getLoggedInUser().getValue()?.userGroups[0]
              .roles[0].roleName === 'ADMINS'
          ) {
            this.router.navigate(['users-setting']);
          } else {
            window.location.href = environment.systems.fraud_system; //'http://localhost:9001/';
          }
        }

        if (gratnedSystems[0] === 'DI_Management') {
          // the user is related to the Fraud only
          if (
            this.authService.getLoggedInUser().getValue()?.userGroups[0]
              .roles[0].roleName === 'ADMINS'
          ) {
            this.router.navigate(['users-setting']);
          } else {
            window.location.href = environment.systems.di_system; //'http://localhost:9001/';
          }
        }
      }
    }
  }
}
