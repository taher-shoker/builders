import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'stc-apps-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit{
  logoSrc!:string;
  userName!:string;
  userNameLogo!:string;
  navItems = [
    {
      id : 1,
      name: 'scorecard',
      url: '/scorecard',
    },
    {
      id : 2,
      name: 'CAD strategy program',
      url: '/strategy-program',
    },
    {
      id : 3,
      name: 'raqami',
      url: '/raqami',
    },
    {
      id : 4,
      name: 'PSR',
      url: '/psr',
    },
  ];
  ngOnInit(): void {
    this.logoSrc = 'assets/images/stc-logo.svg';
    this.userNameLogo = 'assets/images/username-logo.svg';
    this.userName = "fahad awan";

  }
}
