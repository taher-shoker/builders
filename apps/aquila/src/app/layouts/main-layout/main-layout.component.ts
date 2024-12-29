import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@stc-apps/shared-ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiTestIconComponent } from 'apps/aquila/src/assets/icons/api-test-icon/api-test-icon.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SecurityIconComponent } from 'apps/aquila/src/assets/icons/security-icon/security-icon.component';
import { TopBannerComponent } from '../components/top-banner/top-banner.component';

@Component({
  selector: 'stc-apps-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [SharedUiModule, RouterModule, TopBannerComponent],
})
export class MainLayoutComponent implements OnInit {
  logoSrc!: string;
  isAllowed!: boolean;

  ngOnInit(): void {
    this.logoSrc = 'assets/images/stc-logo.svg';
  }

  navItems = [
    {
      id: 1,
      name: 'API test',
      url: 'api-test',
      iconPath: ApiTestIconComponent,
    },
    {
      id: 2,
      name: 'Administration',
      url: 'api-standard-list',
      iconPath: SecurityIconComponent,
    },
  ];

  onNotification() {
    console.log('Notification icon clicked!');
  }

  onLogout() {
    console.log('Logout clicked!');
  }
}
