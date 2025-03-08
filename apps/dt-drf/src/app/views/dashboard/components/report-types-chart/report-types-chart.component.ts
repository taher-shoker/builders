import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../services/dashboard.service';

@Component({
  selector: 'stc-apps-report-types-chart',
  templateUrl: './report-types-chart.component.html',
  styleUrls: ['./report-types-chart.component.scss'],
})
export class ReportTypesChartComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService
  ) {}
  ngOnInit() {
    console.log('fdf');
  }
}
