import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stc-apps-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = '';
  navItems = [
    {
      name: 'home',
      url: '/home',
      icon: 'fa-home',
      roles: ['APPROVERS,CREATORS'],
      urlHome: '/home',
    },
  ];
  yearsArray: any = [
    { name: 2020 },
    { name: 2021 },
    { name: 2022 },
    { name: 2023 },
  ];

  pageTitle = '';
  progressInfo = [
    {
      iconPath: 'assets/images/arrow-up.svg',
      progressDesc: 'Actual performance above target(>=100%)',
    },
    {
      iconPath: 'assets/images/arrow-down.svg',
      progressDesc: 'Actual performance below target(>=90% and < 100%)',
    },
    {
      iconPath: 'assets/images/arrow-down-delayed.svg',
      progressDesc: 'Actual performance below target(< 96%)',
    },
  ];
  cardsInfo = [
    {
      title: 'STC Group EBTDA',
      percentage: '130 %',
      status:'onTrack'
    },
    {
      title: '% Next-Gen Teck Roll-Out',
      percentage: '121 %',
      status:'onTrack'
    },
    {
      title: 'STC Group ROCE',
      percentage: '120 %',
      status:'onTrack'
    },
    {
      title: 'Sustainability Score',
      percentage: '23 %',
      status:'delayed'
    },
    {
      title: '% of Strategic Roles and Capabilities Filled',
      percentage: '23 %',
      status:'delayed'
    },
    {
      title: 'Employee Experience Score',
      percentage: '92 %',
      status:'onHold'
    },
  ];
  constructor(private activeRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((paramMap) => {
      if (paramMap) {
        this.pageTitle = paramMap.get('kpiName')!;
        console.log(this.pageTitle);
      }
    });
  }
}
