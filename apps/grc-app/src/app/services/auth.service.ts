import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';
import { LoggedUser, UserGroup } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userRoles$ = new BehaviorSubject<UserGroup | null>(null);
  loggedUserStream = new BehaviorSubject<LoggedUser | null>(null);
  loggedInUser: LoggedUser | null = null;

  constructor(private cookieService: CookieService) {}

  logout(): void {
    this.cookieService.remove('token');
    this.cookieService.remove('MODERN_SYSTEM_USER');
    this.cookieService.remove('granted-systems');
    this.navigateToLogin();
  }

  navigateToLogin(): void {
    window.location.href = window.location.origin + environment.loginPath;
  }

  getCurrentSystem(): string {
    const systemsCookie = this.cookieService.get('granted-systems');
    if (!systemsCookie) return '';

    try {
      const systems = JSON.parse(systemsCookie) as string[];
      return systems.includes('Business_Excellence_Dashboard')
        ? 'Business_Excellence_Dashboard'
        : '';
    } catch {
      return '';
    }
  }

  getUserData(): void {
    const userCookie = this.cookieService.get('MODERN_SYSTEM_USER');
    if (!userCookie) return;

    let user: any;
    try {
      user = JSON.parse(userCookie);
    } catch {
      return;
    }

    const milestoneGroups =
      user.userGroups?.filter(
        (g: any) => g.roles?.[0]?.system?.name === 'DI_Milestones'
      ) || [];

    const roles = milestoneGroups.map((g: any) => g.roles[0].roleName);

    const teamName = milestoneGroups[0]?.groupName || '';

    const loggedUser: LoggedUser = {
      ...user,
      roles,
      teamName,
    };

    this.loggedUserStream.next(loggedUser);
    this.loggedInUser = loggedUser;
  }
}
