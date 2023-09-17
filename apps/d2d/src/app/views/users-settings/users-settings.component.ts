import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-users-settings',
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss'],
})
export class UsersSettingsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}

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
      roles: ['APPROVERS,CREATORS'],
      urlHome: '/home',
    },
    {
      name: 'dashboard',
      url: '/dashboard',
      icon: 'fa-chart-line',
      roles: ['APPROVERS'],
      urlHome: '/home',
    },
    {
      name: 'users_setting',
      url: '/users-setting',
      icon: '  fa-user-friends',
      roles: ['ADMINS'],
      urlHome: '/users-setting',
    },
  ];
  ngOnInit() {
    this.authService.getUserData();

    this.userName = this.cookieService.get('displayName') || '';
    this.authService.loggedUserStream.subscribe((res) => {
      if (res?.roles) {
        const items = [];
        for (let i = 0; i < this.navItems.length; i++) {
          const similar = this.navItems[i].roles.filter((element) =>
            element.includes(res.roles[0])
          );
          if (similar.length > 0) {
            items.push(this.navItems[i]);
            this.urlHome = this.navItems[i].urlHome;
          }
        }
        this.navItems = items;
      }
    });
  }

  backToHome() {
    this.router.navigate([this.urlHome]);
  }
  logOut() {
    this.authService.logout();
  }
}
