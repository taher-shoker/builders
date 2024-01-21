import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

@Component({
  selector: 'stc-apps-users-settings',
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss'],
})
export class UsersSettingsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public userService: UsersService,
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

  ngOnInit() {
    this.userService.getLabels();
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');

    if (this.userService.getCurrentSystem() === 'DI_Management') {
      this.navItems.push({
        name: 'Data Upload',
        url: '/data-upload',
        icon: 'fa-database',
      });
    }

    this.userName = user.name;
  }

  backToHome() {
    this.router.navigate(['/users-setting']);
  }
  logOut() {
    this.authService.logout();
  }
}
