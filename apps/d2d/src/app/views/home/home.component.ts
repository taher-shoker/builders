import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private authService: AuthService
  ) {}

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
    },
    {
      name: 'dashboard',
      url: '/dashboard',
      icon: 'fa-chart-line',
      roles: ['APPROVERS'],
    },
    {
      name: 'users_setting',
      url: '/users-setting',
      icon: '  fa-user-friends',
      roles: ['ADMINS'],
    },
  ];

  ngOnInit(): void {
    this.userName = JSON.parse(this.cookieService.get('fraud-user'));
    this.authService.setLoggedInUser();
    this.authService.loggedUserStream.subscribe((res) => {
      if (res?.roles) {
        const items = [];
        for (let i = 0; i < this.navItems.length; i++) {
          const similar = this.navItems[i].roles.filter((element) =>
            element.includes(res.roles[0])
          );
          if (similar.length > 0) {
            items.push(this.navItems[i]);
          }
        }
        this.navItems = items;
      }
    });
  }
  logOut() {
    this.authService.logout();
  }
}
