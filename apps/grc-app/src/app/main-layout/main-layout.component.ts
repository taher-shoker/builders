import { Component, inject, OnInit, signal } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavLinks, UserGroup, UserGroupRoles, UserModel } from '../models';
import { DeviceService } from '../services';

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
  currentSystem!: string;
  navItems!: NavLinks[];
  userRoles!: UserGroup;
  isAllowed!: boolean;
  isPMO!: boolean;

  isMobile = signal<boolean>(false);
  authService = inject(AuthService);
  router = inject(Router);
  deviceService = inject(DeviceService);
  ngOnInit(): void {
    this.logoSrc = 'assets/images/stc-logo.svg';
    this.userNameLogo = 'assets/images/username-logo.svg';
    this.authService.loggedUserStream.subscribe((user) => {
      if (user) {
        console.log(user);
        this.userName = user.name;
      }
    });
    // this.navItems = this.scorecardService.getNavLinks();

    this.pageAccessPermision();
  }
  pageAccessPermision() {
    // this.navItems = this.userData?.pageAccess.map((p: any) => {
    //   return { ...p, url: `/${p.slug}` };
    // });
    this.navItems = [
      { id: 1, name: 'KRI', url: '/kri' },
      { id: 2, name: 'Compliance Register', url: '/compliance-reg' },
    ];
    if (!this.isMobile()) {
      this.router.navigate([this.navItems[0].url]);
    } else {
      this.router.navigate(['/home']);
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
    console.log('test');
  }
  getCurrentMode(mode: 'editMode' | 'viewMode') {
    console.log(mode);
  }
  logout() {
    this.authService.logout();
  }
}
