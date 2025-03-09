import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../services/dashboard.service';
@Component({
  selector: 'stc-apps-reports-sla-chart',
  templateUrl: './reports-sla-chart.component.html',
  styleUrls: ['./reports-sla-chart.component.scss'],
})
export class ReportsSlaChartComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService
  ) {}
  ngOnInit() {
    console.log('fdf');
  }
  datePickerChanged(event: { start: Date; end: Date }) {
    console.log(event);
  }
}
