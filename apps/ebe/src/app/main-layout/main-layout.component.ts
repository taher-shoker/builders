import { Component, inject, OnInit } from '@angular/core';
import { ScorecardService } from '../services/scorecard.service';
import { NavLinks, UserGroup, UserGroupRoles, UserModel } from '../models/scorecard.model';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'stc-apps-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  // @ViewChild(SidebarComponent) child?: SidebarComponent;
  logoSrc!: string;
  userName!: string;
  userNameLogo!: string;
  isChanged = false;
  scorecardService = inject(ScorecardService);
  authService = inject(AuthService);
  router = inject(Router);
  currentSystem = 'Business_Excellence_Dashboard';
  navItems!: NavLinks[];
  userData!: UserModel;
  userRoles!: UserGroup;
  ngOnInit(): void {
    this.userData = this.scorecardService.getUserGroups();
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
    console.log(this.userRoles);
    this.scorecardService.userRoles = this.userRoles;
  }
  private checkSystem(groups: UserGroup[]): UserGroup {
    const matchingGroup = groups.find((group: UserGroup) => {
      return group.roles.some((role: UserGroupRoles) => {
        return role.system.name === this.currentSystem;
      });
    });
    if (matchingGroup) {
      return matchingGroup;
    } else {
      throw new Error('No user group found for the current system');
    }
  }
  getCurrentMode(mode: 'editMode' | 'viewMode') {
    this.scorecardService.setEditMode(mode);
  }
  decodeToken(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  logout() {
    this.authService.logout();
  }
}
