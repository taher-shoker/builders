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
  chartData: {
    category: string;
    value: number;
    color?: string;
  }[] = [];
  filter: {
    dateFrom: string | null;
    dateTo: string | null;
    category: string | null;
  } = {
    dateFrom: null,
    dateTo: null,
    category: null,
  };
  lineChartColors = ['#45006F', '#FF6A39'];

  ngOnInit() {
    this.getCategories();
    this.getReportsAvgResTime();
    console.log('fdf');
  }

  private getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories.set(res);
    });
  }
  datePickerChanged(event: { start: Date; end: Date }) {
    if (event.start && event.end) {
      this.filter = {
        ...this.filter,
        dateFrom: this.convertToDateOnly(event.start),
        dateTo: this.convertToDateOnly(event.end),
      };
      this.getReportsAvgResTime(this.filter);
    }
  }
  convertToDateOnly(date: Date | null): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  }
  handleSelect(event: string, controlName: string) {
    if (controlName === 'category') {
      this.filter = { ...this.filter, category: event };
      this.getReportsAvgResTime(this.filter);
    }
  }
  getReportsAvgResTime(filter?: any) {
    this._dashboardService.getReportsAvgReponse(filter).subscribe((res) => {
      this.chartData = res.map((item) => ({
        category: this.getMonthName(item.month) + ' ' + item.year,
        value: item.avgResponseTime,
      }));
    });
  }
  getMonthName(month: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1] || 'Unknown'; // Ensure valid month values
  }
}
