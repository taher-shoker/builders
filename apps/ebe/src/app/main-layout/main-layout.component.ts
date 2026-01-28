import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import {
  NavLinks,
  UserGroup,
  UserGroupRoles,
  UserModel,
} from '../models/scorecard.model';
import { AuthService } from '../services/auth.service';
import { DeviceService } from '../services/device.service';
import { ScorecardService } from '../services/scorecard.service';
@Component({
  selector: 'stc-apps-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  logoSrc!: string;
  userName!: string;
  userNameLogo!: string;
  isChanged = false;
  scorecardService = inject(ScorecardService);
  authService = inject(AuthService);
  router = inject(Router);
  currentSystem!: string;
  navItems!: NavLinks[];
  userData!: UserModel;
  userRoles!: UserGroup;
  isAllowed!: boolean;
  isPMO!: boolean;
  isMobile = signal<boolean>(false);
  deviceService = inject(DeviceService);
  ngOnInit(): void {
    this.currentSystem = this.scorecardService.getCurrentSystem();
    if (this.scorecardService.getUserGroups()) {
      this.userData = JSON.parse(
        decodeURIComponent(this.scorecardService.getUserGroups())
      );
    }
    this.isMobile.set(this.deviceService.isMobile());
    // console.log(this.isMobile());
    this.scorecardService.setUsername(this.userData?.name);
    this.logoSrc = 'assets/images/stc-logo.svg';
    this.userNameLogo = 'assets/images/username-logo.svg';
    // this.navItems = this.scorecardService.getNavLinks();
    this.router.events.subscribe({
      next: (res) => {
        if (res instanceof NavigationStart) {
          this.scorecardService.setEditMode('viewMode');
        }
      },
    });
    if (this.userData && this.userData.userGroups) {
      this.userRoles = this.checkSystem(this.userData.userGroups);
    }
    if (this.userRoles && this.userRoles.roles) {
      this.isAllowed = this.userRoles.roles.some(
        (role) => role.roleName === 'BE_EDITORS' || role.roleName === 'ADMINS'
      );
    }
    this.authService.userRoles.next(this.userRoles);
    if (this.userRoles && this.userRoles.roles) {
      this.isPMO = this.userRoles.roles.some(
        (role) => role.roleName === 'BE_PMO'
      );
    }
    this.pageAccessPermision();
    this.scorecardService.userRoles = this.userRoles;
  }
  pageAccessPermision() {
    this.navItems = this.userData?.pageAccess.map((p: any) => {
      return { ...p, url: `/${p.slug}` };
    });

    const currentPath = window.location.pathname;
    const hasHash = window.location.hash && window.location.hash !== '#/';

    const baseAttr = document.querySelector('base')?.getAttribute('href') || '/';
    const baseWithSlash = baseAttr.endsWith('/') ? baseAttr : baseAttr + '/';
    const pathWithSlash = currentPath.endsWith('/') ? currentPath : currentPath + '/';
    const atBase =
      pathWithSlash === baseWithSlash ||
      currentPath === '/index.html' ||
      currentPath === baseWithSlash + 'index.html';

    if (atBase && !hasHash) {
      if (!this.isMobile()) {
        this.router.navigate([this.navItems[0].url]);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }
  private checkSystem(groups: UserGroup[]): UserGroup {
    const matchingGroup = groups.find((group: UserGroup) => {
      return group.roles.some((role: UserGroupRoles) => {
        return this.currentSystem === role.system.name;
      });
    });
    if (matchingGroup) {
      return matchingGroup;
    } else {
      throw new Error('No user group found for the current system');
    }
  }
  toggleSwitchBtn() {
    this.scorecardService.toggleSwitchBtn.next(true);
  }
  getCurrentMode(mode: 'editMode' | 'viewMode') {
    this.scorecardService.setEditMode(mode);
  }
  logout() {
    this.authService.logout();
  }
}
