import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../services/dashboard.service';
import {
  Category,
  ReportsService,
} from '../../../dy-reports/dy-reports.service';
@Component({
  selector: 'stc-apps-avg-response-chart',
  templateUrl: './avg-response-chart.component.html',
  styleUrls: ['./avg-response-chart.component.scss'],
})
export class AvgResponseChartComponent implements OnInit {
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
