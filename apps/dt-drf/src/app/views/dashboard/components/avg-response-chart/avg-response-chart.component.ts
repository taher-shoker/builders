import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../services/dashboard.service';
@Component({
  selector: 'stc-apps-avg-response-chart',
  templateUrl: './avg-response-chart.component.html',
  styleUrls: ['./avg-response-chart.component.scss'],
})
export class AvgResponseChartComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService
  ) {}
  ngOnInit() {
    console.log('fdf');
  }
}
