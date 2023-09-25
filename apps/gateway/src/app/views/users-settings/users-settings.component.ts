import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
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
  title = 'users settings';
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';

  navItems = [
    {
      name: 'Users Setting',
      url: '/users-setting',
      icon: 'fa-user-cog',
    },
  ];
  backToHome() {
    this.router.navigate(['/users-setting']);
  }
  logOut() {
    this.authService.logout();
  }
  ngOnInit(): void {
    this.userName = this.cookieService.get('USER_FULLNAME') || '';
  }
}
