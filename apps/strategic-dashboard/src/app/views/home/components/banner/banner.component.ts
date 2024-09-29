import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedFormService } from '../../../../shared/services/shared-form.service';
import { YearService } from '../../../../shared/services/year.service';

interface name {
  name: number;
}
@Component({
  selector: 'stc-apps-main-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  currentDate = new Date();
  year = this.currentDate.getFullYear();
  currentYear = this.currentDate.getFullYear() - 1;
  form: FormGroup = new FormGroup({});

  navItems = [
    {
      name: 'home',
      url: '/home',
      icon: 'fa-home',
      roles: ['APPROVERS,CREATORS'],
      urlHome: '/home',
    },
  ];

  yearsArray: name[] = [
    { name: this.currentYear },
    { name: this.currentDate.getFullYear() },
  ];

  constructor(
    private yearService: YearService,
    private sharedFormService: SharedFormService
  ) {}

  ngOnInit(): void {
   console.log('ay haga');
   
  }

  
}
