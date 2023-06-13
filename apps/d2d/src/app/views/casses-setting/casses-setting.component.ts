import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-casses-setting',
  templateUrl: './casses-setting.component.html',
  styleUrls: ['./casses-setting.component.scss'],
})
export class CassesSettingComponent {
  title = 'users settings';
  userName = 'taher shoker';
  logoSrc = 'assets/images/brand/stc-logo.png';
  navItems = [];
}
