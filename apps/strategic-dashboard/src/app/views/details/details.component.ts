import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StrategicGroupDetailsService } from './services/strategic-group-details.service';
import { SharedFormService } from '../../shared/services/shared-form.service';
import { FormGroup } from '@angular/forms';
import { YearService } from '../../shared/services/year.service';
import { StrategicGroupDetails } from 'c:/Users/saraa/projects/stc-apps/apps/strategic-dashboard/src/app/views/details/models/strategic-group-details.model';
import { StrategicGroupKPI } from './models/strategic-group-kpi.model';

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
      thresholds: { green: 119, orange: 0, red: 0 },
    },
    {
      iconPath: 'assets/images/arrow-down-delayed.svg',
      progressDesc: 'Actual performance below target(< 96%)',
      percantage: ' 0.04432946816086769',
      thresholds: {
        green: 0.6000000238418579,
        orange: 0.44999998807907104,
        red: 0.30000001192092896,
      },
    },
    {
      iconPath: 'assets/images/arrow-down.svg',
      progressDesc: 'Actual performance below target(>=90% and < 100%)',
      percantage: '99',
      thresholds: { green: 100, orange: 0, red: 100 },
    },
  ];

  strategicGroupDetails: StrategicGroupDetails = [];
  strategicGroupKPI: StrategicGroupKPI[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private yearService: YearService,
    private sharedFormService: SharedFormService,
    private strategicGroupDetailsService: StrategicGroupDetailsService
  ) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((paramMap) => {
      const strategicName = paramMap.get('strategicName');
      if (strategicName) {
        this.pageTitle = strategicName;
        this.getAllStrategicGroupKpiDetails();
        this.getAllStrategicGroupKpis();
      }
    });

    this.handleForm();
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
    const strategicName =
      this.activeRoute.snapshot.paramMap.get('strategicName');
    const year = this.sharedFormService.getForm().controls['year'].value;

    if (strategicName) {
      this.strategicGroupDetailsService
        .getAllStrategicGroupKpiDetails({ strategicName, year })
        .subscribe((result: StrategicGroupDetails) => {
          this.strategicGroupDetails = result;
        });
    }
  }

  getAllStrategicGroupKpis() {
    const strategicName =
      this.activeRoute.snapshot.paramMap.get('strategicName');
    const year = this.sharedFormService.getForm().controls['year'].value;
    if (strategicName) {
      this.strategicGroupDetailsService
        .getAllStrategicGroupKpis({ strategicName, year })
        .subscribe((result: StrategicGroupKPI[]) => {
          this.strategicGroupKPI = result;
        });
    }
  }

  selectYear(event: number) {
    this.yearService.setYear(event.toString());
    this.getAllStrategicGroupKpiDetails();
  }
}
