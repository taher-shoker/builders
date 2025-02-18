import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';
import { UserGroup } from '../models/scorecard.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  userRoles:BehaviorSubject<UserGroup> = new BehaviorSubject({} as UserGroup)
  constructor(private router: Router, private cookieService: CookieService) {}
  logout() {
    this.cookieService.remove('token');
    this.cookieService.remove('MODERN_SYSTEM_USER');
    this.cookieService.remove('granted-systems');
    this.navigateToLogin();
    
  }
  navigateToLogin() {
    window.location.href = window.location.origin + environment.loginPath;
  }
}
