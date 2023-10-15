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
    // this.authService.getUserData();

    if (!this.cookieService.get('granted-systems')) {
      this.authService.getUserData();
    } else {
      this.apps = this.authService.handleUserSystems();
    }
  }

  getGrantedSystems() {
    if (
      this.cookieService.get('granted-systems')
        ? JSON.parse(this.cookieService.get('granted-systems') || '')
        : false
    ) {
      this.apps = this.authService.handleUserSystems();
    }

    return this.cookieService.get('granted-systems')
      ? JSON.parse(this.cookieService.get('granted-systems') || '')
      : false;
  }
}
