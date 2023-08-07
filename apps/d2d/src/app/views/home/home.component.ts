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
    },
    {
      name: 'users_setting',
      url: '/users-setting',
      icon: '  fa-user-friends',
    },
  ];

  ngOnInit(): void {
    this.userName = JSON.parse(this.cookieService.get('fraud-user'));
    this.authService.setLoggedInUser();

  }
  logOut() {
    this.authService.logout();
  }
}
