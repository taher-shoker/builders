import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StrategicGroupDetailsService } from './services/strategic-group-details.service';
import { SharedFormService } from '../../shared/services/shared-form.service';
import { FormGroup } from '@angular/forms';
import { YearService } from '../../shared/services/year.service';
import { StrategicGroupDetails } from 'c:/Users/saraa/projects/stc-apps/apps/strategic-dashboard/src/app/views/details/models/strategic-group-details.model';

@Component({
  selector: 'stc-apps-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  titleData = window.history.state.title;
  currentDate = new Date();
  year = this.currentDate.getFullYear();
  currentYear = this.currentDate.getFullYear() - 1;

  form: FormGroup = new FormGroup({});

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
  yearsArray: any[] = [
    { name: this.currentYear },
    { name: this.currentDate.getFullYear() },
  ];

  pageTitle = '';
  progressInfo = [
    {
      iconPath: 'assets/images/arrow-up.svg',
      progressDesc: 'Actual performance above target(>=100%)',
      percantage: '120',
    },
    {
      iconPath: 'assets/images/arrow-down.svg',
      progressDesc: 'Actual performance below target(>=90% and < 100%)',
      percantage: '99',
    },
    {
      iconPath: 'assets/images/arrow-down-delayed.svg',
      progressDesc: 'Actual performance below target(< 96%)',
      percantage: '80',
    },
  ];
  cardsInfo = [
    {
      title: 'STC Group EBTDA',
      percentage: '130 %',
      status: 'onTrack',
    },
    {
      title: '% Next-Gen Teck Roll-Out',
      percentage: '121 %',
      status: 'onTrack',
    },
    {
      title: 'STC Group ROCE',
      percentage: '120 %',
      status: 'onTrack',
    },
    {
      title: 'Sustainability Score',
      percentage: '23 %',
      status: 'delayed',
    },
    {
      title: '% of Strategic Roles and Capabilities Filled',
      percentage: '23 %',
      status: 'delayed',
    },
    {
      title: 'Employee Experience Score',
      percentage: '92 %',
      status: 'onHold',
    },
  ];
  strategicGroupDetails: StrategicGroupDetails = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private yearService: YearService,
    private sharedFormService: SharedFormService,
    private strategicGroupDetailsService: StrategicGroupDetailsService
  ) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((paramMap) => {
      if (paramMap) {
        this.pageTitle = paramMap.get('kpiName')!;
        console.log(this.pageTitle);
      }
    });
    this.handleForm();
    this.getAllStrategicGroupKpiDetails();
  }

  handleForm() {
    this.form = this.sharedFormService.getForm();

    if (this.yearService.getSelectedYear()) {
      this.year = +this.yearService.getSelectedYear()!;
    } else {
      this.year = this.currentDate.getFullYear();
    }

    const initialParams = {
      year: this.year,
    };

    this.sharedFormService.initializeForm(initialParams);
  }

  getAllStrategicGroupKpiDetails() {
    this.activeRoute.queryParams.subscribe((params) => {
      const strategicName = params['strategicName'];
      const year = this.sharedFormService.getForm().controls['year'].value;

      this.strategicGroupDetailsService
        .getAllStrategicGroupKpiDetails({ strategicName, year })
        .subscribe((result: StrategicGroupDetails) => {
          this.strategicGroupDetails = result;
        });
    });
  }

  selectYear(event: number) {
    this.yearService.setYear(event.toString());
    this.getAllStrategicGroupKpiDetails();
  }
}
