import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { SharedUiModule } from '@stc-apps/shared-ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiTestIconComponent } from 'apps/aquila/src/assets/icons/api-test-icon/api-test-icon.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SecurityIconComponent } from 'apps/aquila/src/assets/icons/security-icon/security-icon.component';
import { TopBannerComponent } from '../components/top-banner/top-banner.component';
import { LoaderService } from '../../core/services/loader.service';
import { LoaderComponent } from '../components/loader/loader.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PresentionIconComponent } from 'apps/aquila/src/assets/icons/presention-icon/presention-icon.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SettingsIconComponent } from 'apps/aquila/src/assets/icons/settings-icon/settings-icon.component';
import { ThemeService } from '../../core/services/theme.service';

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
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  loaderService = inject(LoaderService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  themeService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  logoSrc!: string;
  isAllowed!: boolean;
  isSidebarVisible = false;
  private mediaQuery?: MediaQueryList;
  private mediaQueryListener?: (event: MediaQueryListEvent) => void;
  private readonly mobileBreakpoint = 768;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  ngAfterViewInit(): void {
    this.loaderService.isLoading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cdr.detectChanges();
      });

    this.mediaQuery = window.matchMedia(
      `(min-width: ${this.mobileBreakpoint}px)`
    );
    this.mediaQueryListener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.isSidebarVisible = true;
      }
    };
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  ngOnInit(): void {
    this.logoSrc = this.themeService.getAppLogoPath();
    this.themeService.appLogoPath$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((path) => {
        this.logoSrc = path;
      });
    this.isSidebarVisible = window.innerWidth > this.mobileBreakpoint;

    this.router.events
      .pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (window.innerWidth <= this.mobileBreakpoint) {
          this.isSidebarVisible = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
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
    {
      id: 3,
      name: 'Activity Monitoring',
      url: 'activity-monitoring',
      iconPath: PresentionIconComponent,
    },
    {
      id: 4,
      name: 'Settings',
      url: 'settings',
      iconPath: SettingsIconComponent,
    },
  ];

  onNotification() {
    console.log('Notification icon clicked!');
  }

  onLogout() {
    console.log('Logout clicked!');
  }
}
