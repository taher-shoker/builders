import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'stc-apps-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  scoreCardName = window.history.state.scoreCardName;
  constructor(
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService
  ) {
    console.log('layout name', this.scoreCardName);
  }

  urlHome = '/home';
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';
  navItems = [
    {
      name: 'home',
      url: '/home',
      icon: 'fa-home',
      roles: ['APPROVERS,CREATORS'],
      urlHome: '/home',
    },
    // {
    //   name: 'dashboard',
    //   url: '/dashboard',
    //   icon: 'fa-chart-line',
    //   roles: ['APPROVERS'],
    //   urlHome: '/home',
    // },
  ];

  ngOnInit() {
    //this.userName='Habiba';
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.userName = this.cookieService.get('USER_FULLNAME') || '';
      this.authService.getUserData();
      this.authService.loggedUserStream.subscribe((res) => {
        this.userName = res?.name || '';
      });
    }
    console.log(this.userName, 'hi');
  }

  backToHome() {
    this.router.navigate(['/']);
  }
  logOut() {
    //apply logout action
  }
}
