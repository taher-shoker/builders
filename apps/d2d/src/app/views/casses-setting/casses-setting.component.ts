import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BannerDataService } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-casses-setting',
  templateUrl: './casses-setting.component.html',
  styleUrls: ['./casses-setting.component.scss'],
})
export class CassesSettingComponent {
  title = { title: 'home', text: '' };
  userName = 'taher shoker';
  logoSrc = 'assets/images/brand/stc-logo.png';
  navItems = [];
}
