import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    public router: Router
  ) {}

  urlHome!: string;
  title = { title: 'home', text: '' };
  userName = '';
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

    this.userName = this.cookieService.get('USER_FULLNAME') || '';
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
