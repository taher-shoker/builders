import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-users-settings',
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss'],
})
export class UsersSettingsComponent {
  title = 'users settings';
  userName = 'taher shoker';
  logoSrc = 'assets/images/brand/stc-logo.png';
  navItems = [
    {
      name: 'home',
      url: '/home',
      icon: 'fa-home',
    },
    {
      name: 'settings',
      url: '/settings',
      icon: ' fa-cog',
    },
  ];
}
