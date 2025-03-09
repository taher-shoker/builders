import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Category,
  DashboardService,
} from '../../../../services/dashboard.service';
import { ReportsService } from '../../../dy-reports/dy-reports.service';

@Component({
  selector: 'stc-apps-report-types-chart',
  templateUrl: './report-types-chart.component.html',
  styleUrls: ['./report-types-chart.component.scss'],
})
export class ReportTypesChartComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService,
    private reportsService: ReportsService
  ) {}

  categories: WritableSignal<Category[]> = signal([]);

  ngOnInit() {
    this.getCategories();
    console.log('fdf');
  }
  private getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories.set(res);
    });
  }
  datePickerChanged(event: { start: Date; end: Date }) {
    console.log(event);
  }
}
