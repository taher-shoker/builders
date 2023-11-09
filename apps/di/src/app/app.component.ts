import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { ReportingService } from './shared/services/reporting.service';

@Component({
  selector: 'stc-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  _reportingService = inject(ReportingService);

  urlHome!: string;
  title = { title: 'home', text: '' };
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';
  navItems = [
    {
      name: 'Home',
      url: '/home',
      icon: 'fa-home',
      // roles: ['APPROVERS,CREATORS'],
      // urlHome: '/home',
    },
    {
      name: 'Trends',
      url: '/trend',
      icon: 'fa-chart-line',
      // roles: ['APPROVERS'],
      // urlHome: '/home',
    },
    // {
    //   name: 'users_setting',
    //   url: '/users-setting',
    //   icon: '  fa-user-friends',
    //   roles: ['ADMINS'],
    //   urlHome: '/users-setting',
    // },
  ];

  ngOnInit(): void {
    this._reportingService.postReport('Authenticcation-Done').subscribe(() => {
      console.log('init login');
    });

    this.authService.displayName;
    this.authService.displayName.subscribe((res) => {
      this.userName = res;
    });
  }

  logOut() {
    // this.authService.logout();
    this.authService.logout();
  }

  backToHome() {
    // this.router.navigate([this.urlHome]);
  }
}
