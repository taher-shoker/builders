import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StrategicGroupDetailsService } from './services/strategic-group-details.service';
import { SharedFormService } from '../../shared/services/shared-form.service';
import { FormGroup } from '@angular/forms';
import { YearService } from '../../shared/services/year.service';
import { StrategicGroupKPI } from './models/strategic-group-kpi.model';
import { StrategicGroupDetails } from './models/strategic-group-details.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stc-apps-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  titleData = window.history.state.title;
  currentDate = new Date();
  year = this.currentDate.getFullYear();
  selectedYear = 0;
  currentYear = this.currentDate.getFullYear() - 1;
  selectedYearRange: { start: number; end: number } = {
    start: 2000,
    end: 2024,
  };
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
  yearChangeSubscription: Subscription | undefined;
  strategicGroupDetails: StrategicGroupDetails = [];
  strategicGroupKPI: StrategicGroupKPI[] = [];
  filteredDetails: StrategicGroupDetails = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private yearService: YearService,
    private sharedFormService: SharedFormService,
    private strategicGroupDetailsService: StrategicGroupDetailsService
  ) {}
  ngOnDestroy(): void {
    this.yearChangeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((paramMap) => {
      const strategicName = paramMap.get('strategicName');
      if (strategicName) {
        this.pageTitle = strategicName;
        this.getSelectedYear();
        this.getAllStrategicGroupKpiDetails();
        this.getAllStrategicGroupKpis();
      }
    });
    this.yearChangeSubscription = this.yearService
      .getYearChangeObservable()
      .subscribe((year: number) => {
        this.getSelectedYear();
        this.getAllStrategicGroupKpiDetails();
      });
    // this.yearService.getQuarterChangeObservable().subscribe((quarter: string) => {
    //   this.getAllStrategicGroupKpiDetails();
    // });
  }
  getSelectedYear() {
    if (this.yearService.getSelectedYear()) {
      this.selectedYear = +this.yearService.getSelectedYear()!;
    } else {
      this.selectedYear =
        this.sharedFormService.getForm().controls['year'].value;
    }
  }
  getAllStrategicGroupKpiDetails() {
    const strategicName =
      this.activeRoute.snapshot.paramMap.get('strategicName');
    const year = this.selectedYear;
    console.log('details', this.selectedYear);

    if (strategicName) {
      this.strategicGroupDetailsService
        .getAllStrategicGroupKpiDetails({ strategicName, year })
        .subscribe((result: StrategicGroupDetails) => {
          this.strategicGroupDetails = result;
          this.filteredDetails = [...this.strategicGroupDetails];
        });
    }
  }

  getAllStrategicGroupKpis() {
    const strategicName =
      this.activeRoute.snapshot.paramMap.get('strategicName');
    const year = this.selectedYear;
    if (strategicName) {
      this.strategicGroupDetailsService
        .getAllStrategicGroupKpis({ strategicName, year })
        .subscribe((result: StrategicGroupKPI[]) => {
          this.strategicGroupKPI = result;
        });
    }
  }

  onRangeChange(range: { start: number; end: number }) {
    this.selectedYearRange = range;
    this.filteredDetails = this.strategicGroupDetails.filter((item) =>
      item.values.some((value) => {
        return value.year >= range.start && value.year <= range.end;
      })
    );
  }
}
