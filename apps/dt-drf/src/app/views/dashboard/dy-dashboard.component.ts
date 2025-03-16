/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'stc-apps-category',
  templateUrl: './dy-dashboard.component.html',
  styleUrls: ['./dy-dashboard.component.scss'],
})
export class DyDashboardComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService
  ) {}

  statisticData: any = {};
  allReportsChart = [];
  ngOnInit(): void {
    console.log('initial');
    this.getStatisticsData();
    // this.getReportsCategoryChart();
  }

  getStatisticsData() {
    this._dashboardService.getDashboardStatistics().subscribe((res) => {
      console.log(res);
      this.statisticData = res;
    });
  }

  getReportsCategoryChart() {
    this._dashboardService.getReportsCategory().subscribe((res) => {
      console.log(res);
    });
  }
}
