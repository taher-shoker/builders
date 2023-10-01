import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService, System } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  apps: System[] = [];
  constructor(
    private cookieService: CookieService,
    public authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (this.cookieService.get('granted-systems')) {
      if (
        (JSON.parse(this.cookieService.get('granted-systems') || '').length ==
          0 ||
          this.apps.length == 0) &&
        !this.authService.isAdminUser()
      ) {
        this.authService.getUserData();
      }
    } else {
      this.authService.getUserData();
    }
  }

  getGrantedSystems() {
    if (this.apps.length == 0) {
      this.apps = this.authService.handleUserSystems();
    }
    return this.apps.length > 0;
  }
}
