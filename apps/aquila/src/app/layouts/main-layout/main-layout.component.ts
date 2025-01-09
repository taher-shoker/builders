import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@stc-apps/shared-ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiTestIconComponent } from 'apps/aquila/src/assets/icons/api-test-icon/api-test-icon.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SecurityIconComponent } from 'apps/aquila/src/assets/icons/security-icon/security-icon.component';
import { TopBannerComponent } from '../components/top-banner/top-banner.component';
import { LoaderService } from '../../core/services/loader.service';
import { LoaderComponent } from '../components/loader/loader.component';

@Component({
  selector: 'stc-apps-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule,
    TopBannerComponent,
    LoaderComponent,
  ],
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  loaderService = inject(LoaderService);
  cdr = inject(ChangeDetectorRef);
  logoSrc!: string;
  isAllowed!: boolean;

  ngAfterViewInit(): void {
    this.loaderService.isLoading$.subscribe((res) => {
      this.cdr.detectChanges();
      console.log(res);
    });
  }

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
      name: 'Standard Management',
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
