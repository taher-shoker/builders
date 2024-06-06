import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'stc-apps-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(
    private cookieService: CookieService,
    public router: Router
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
    {
      name: 'dashboard',
      url: '/dashboard',
      icon: 'fa-chart-line',
      roles: ['APPROVERS'],
      urlHome: '/home',
    },
  ];

  ngOnInit() {
    this.userName = this.cookieService.get('USER_FULLNAME') || '';
  }

  backToHome() {
    this.router.navigate(['/']);
  }
  logOut() {
    //apply logout action
    }
}
