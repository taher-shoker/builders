import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Category,
  DashboardService,
  ReportData,
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
  chartData: {
    name: string;
    value: number;
    color?: string;
  }[] = [];
  filter: {
    dataFrom: string | null;
    dataTo: string | null;
    category: string | null;
    status: string | null;
  } = {
    dataFrom: null,
    dataTo: null,
    category: null,
    status: null,
  };
  ngOnInit() {
    this.getCategories();
    this.getReportsCategoryChart();
  }
  private getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      this.categories.set(res);
    });
  }
  datePickerChanged(event: { start: Date; end: Date }) {
    console.log(event);
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

  getReportsCategoryChart(filterData?: any) {
    this._dashboardService.getReportsCategory(filterData).subscribe(
      (
        res: {
          category: string;
          count: number;
        }[]
      ) => {
        this.chartData = res.map((item) => ({
          name: item.category,
          value: item.count,
          color: '#4F008C', // Assign colors dynamically
        }));
      }
    );
  }
}
