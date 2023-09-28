import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  urlHome!: string;
  title = { title: 'home', text: '' };
  userName = 'taher shoker';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';
  navItems = [
    {
      name: 'home',
      url: '/home',
      icon: 'fa-home',
      // roles: ['APPROVERS,CREATORS'],
      // urlHome: '/home',
    },
    {
      name: 'trend',
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

  logOut() {
    // this.authService.logout();
  }

  backToHome() {
    // this.router.navigate([this.urlHome]);
  }

}
