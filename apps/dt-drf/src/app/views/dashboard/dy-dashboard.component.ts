/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, DashboardService } from '../../services/dashboard.service';
import { ReportsService } from '../dy-reports/dy-reports.service';

@Component({
  selector: 'stc-apps-category',
  templateUrl: './dy-dashboard.component.html',
  styleUrls: ['./dy-dashboard.component.scss'],
})
export class DyDashboardComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService,
    private reportsService: ReportsService
  ) {}
  categories: WritableSignal<Category[]> = signal([]);

  statisticData: any = {};
  allReportsChart = [];
  ngOnInit(): void {
    this.getCategories();
    this.getStatisticsData();
  }

  private getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories.set(res);
    });
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
