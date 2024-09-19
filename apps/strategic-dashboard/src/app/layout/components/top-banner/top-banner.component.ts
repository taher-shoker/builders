import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../../services/auth.service';

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
    {
      name: 'data upload',
      url: `/home/data-upload`,
      icon: 'fa-upload',
      roles: ['Data_Admins'],
      urlHome: `/home`,
    },
  ];
  yearsArray: any = [
    { name: 2020 },
    { name: 2021 },
    { name: 2022 },
    { name: 2023 },
  ];

  constructor(
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    //this.userName='Habiba';
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.userName = this.cookieService.get('USER_FULLNAME') || '';
      this.authService.getUserData();
      // this.authService.loggedUserStream.subscribe((res) => {
      //   console.log(res?.userGroups);

      //   res?.userGroups.map((group) => {
      //     if (group.groupName == 'Data_Admins') {
      //       console.log('hey');
      //       let flag = false;
      //       this.navItems.map((item) => {
      //         if (item.name == 'data upload') {
      //           flag = true;
      //         }
      //       });
      //       if (!flag) {
      //         this.navItems.push({
      //           name: 'data upload',
      //           url: `/home/data-upload`,
      //           icon: 'fa-upload',
      //           roles: ['Data_Admins'],
      //           urlHome: `/home`,
      //         });
      //       }
      //     }
      //   });
      // });
    }
  }

  backToHome() {
    this.router.navigate(['/']);
  }
  logOut() {
    //apply logout action
  }
}
