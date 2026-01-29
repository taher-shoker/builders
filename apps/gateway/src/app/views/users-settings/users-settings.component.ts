import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth.service';
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
  title = 'Users settings';
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';

  navItems = [
    {
      name: 'Users Setting',
      url: '/users-setting',
      icon: 'fa-user-cog',
      isExtrnal: false,
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
        isExtrnal: false,
      });
    } else if (this.userService.getCurrentSystem() === 'DI_Milestones') {
      this.navItems.push({
        name: 'DT Milestones',
        url: window.location.origin + environment.systems.di_milestones_system,
        icon: 'fa-database',
        isExtrnal: true,
      });

      this.navItems.push({
        name: 'Action Log',
        url:
          window.location.origin +
          environment.systems.di_milestones_system +
          '#/action-log',
        icon: 'fa fa-list-alt',
        isExtrnal: true,
      });
    } else if (this.userService.getCurrentSystem() === 'GRC_Dashboard') {
      this.navItems.push({
        name: 'GRC Dashboard',
        url: window.location.origin + environment.systems.grc_dashboard,
        icon: 'fa-database',
        isExtrnal: true,
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
