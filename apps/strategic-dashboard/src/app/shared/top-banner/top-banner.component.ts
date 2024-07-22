import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'stc-apps-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent implements OnInit {
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
  ];

  constructor(private cookieService: CookieService, public router: Router) {}
  ngOnInit() {
    //this.userName='Habiba';
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.userName = this.cookieService.get('USER_FULLNAME') || '';
    }
  }

  backToHome() {
    this.router.navigate(['/']);
  }
  logOut() {
    //apply logout action
  }
}
