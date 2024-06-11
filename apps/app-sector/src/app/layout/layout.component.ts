import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'stc-apps-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService
  ) {}

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
    this.userName = this.cookieService.get('USER_FULLNAME') || '';
    this.authService.getUserData();
    this.authService.loggedUserStream.subscribe((res) => {
      this.userName = res?.name || '';
    });
   
    console.log(this.userName, 'hi');
  }

  backToHome() {
    this.router.navigate(['/']);
  }
  logOut() {
    //apply logout action
  }
}
