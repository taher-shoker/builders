import { Component, inject, OnInit, signal } from '@angular/core';
import { ScorecardService } from '../services/scorecard.service';
import {
  NavLinks,
  UserGroup,
  UserGroupRoles,
  UserModel,
} from '../models/scorecard.model';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DeviceService } from '../services/device.service';
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
    this.userData = JSON.parse(
      decodeURIComponent(this.scorecardService.getUserGroups())
    );
    this.isMobile.set(this.deviceService.isMobile());
    console.log(this.isMobile());
    this.scorecardService.setUsername(this.userData.name);
    this.logoSrc = 'assets/images/stc-logo.svg';
    this.userNameLogo = 'assets/images/username-logo.svg';
    this.navItems = this.scorecardService.getNavLinks();
    this.router.events.subscribe({
      next: (res) => {
        if (res instanceof NavigationStart) {
          this.scorecardService.setEditMode('viewMode');
        }
      },
    });
    this.userRoles = this.checkSystem(this.userData.userGroups);
    this.isAllowed = this.userRoles.roles.some(
      (role) => role.roleName === 'BE_EDITORS' || role.roleName === 'ADMINS'
    );
    console.log(this.userRoles);
    this.authService.userRoles.next(this.userRoles);
    this.isPMO = this.userRoles.roles.some(
      (role) => role.roleName === 'BE_PMO'
    );
    this.scorecardService.userRoles = this.userRoles;
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
  toggleSwitchBtn()
  {
    this.scorecardService.toggleSwitchBtn.next(true);
  }
  getCurrentMode(mode: 'editMode' | 'viewMode') {
    this.scorecardService.setEditMode(mode);
  }
  logout() {
    this.authService.logout();
  }
}
