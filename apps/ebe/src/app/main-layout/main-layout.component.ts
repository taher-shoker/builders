import { Component, inject, OnInit } from '@angular/core';
import { ScorecardService } from '../services/scorecard.service';
import { NavLinks, UserGroup, UserGroupRoles, UserModel } from '../models/scorecard.model';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'stc-apps-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit{
  // @ViewChild(SidebarComponent) child?: SidebarComponent;
  logoSrc!:string;
  userName!:string;
  userNameLogo!:string;
  isChanged = false;
  scorecardService = inject(ScorecardService);
  router = inject(Router)
  currentSystem = "";
  navItems!:NavLinks[];
  userData!:UserModel;
  userRoles!:UserGroup;
  ngOnInit(): void {
    this.currentSystem = this.scorecardService.getCurrentSystem();
    this.userData = this.scorecardService.getUserGroups();
    this.scorecardService.setUsername(this.userData.name);
    this.logoSrc = 'assets/images/stc-logo.svg';
    this.userNameLogo = 'assets/images/username-logo.svg';
    this.navItems = this.scorecardService.getNavLinks();
    this.router.events.subscribe({
      next : (res) => {
        if (res instanceof NavigationStart) {
          this.scorecardService.setEditMode("viewMode")
        }
      }
    })
    // this.userRoles = this.checkSystem(this.userData.userGroups) ?? ;
  }
  private checkSystem(groups: UserGroup[]) {
    return groups.find((group: UserGroup) => {
      return group.roles.some(
        (role:UserGroupRoles) => {
          return role.system.name === this.currentSystem;
        }
      );
    });
  }
  getCurrentMode(mode:'editMode' | 'viewMode')
  {
    this.scorecardService.setEditMode(mode);
  }
  decodeToken (token:string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}
