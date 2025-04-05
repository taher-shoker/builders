import { Component, Input, OnInit, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Category,
  DashboardService,
} from '../../../../services/dashboard.service';
import { ReportsService } from '../../../dy-reports/dy-reports.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'stc-apps-report-types-chart',
  templateUrl: './report-types-chart.component.html',
  styleUrls: ['./report-types-chart.component.scss'],
})
export class ReportTypesChartComponent implements OnInit {
  @Input({ required: true }) categories!: WritableSignal<Category[]>;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService,
    private _formBuilder: FormBuilder
  ) {}

  chartData: {
    name: string;
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
  form!: FormGroup;

  ngOnInit() {
    this.form = this._formBuilder.group({
      startDate: [''],
      endDate: [''],
      category: [''],
    });
    this.getReportsCategoryChart();
  }

  datePickerChanged(event: { start: Date; end: Date }) {
    if (event.start && event.end) {
      this.filter = {
        ...this.filter,
        dateFrom: this.convertToDateOnly(event.start),
        dateTo: this.convertToDateOnly(event.end),
      };
      this.getReportsCategoryChart(this.filter);
    }
  }
  convertToDateOnly(date: Date | null): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0]; // Extracts YYYY-MM-DD
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
  handleSelect(event: string, controlName: string) {
    if (controlName === 'category') {
      this.filter = { ...this.filter, category: event };
      this.getReportsCategoryChart(this.filter);
    }
  }
  reset() {
    this.filter = { category: null, dateFrom: null, dateTo: null };
    this.form.reset();
    this.getReportsCategoryChart(this.filter);
  }
  hasNonNullValue(obj: Record<string, any>): boolean {
    return Object.values(obj).some((value) => value !== null);
  }
  getReportsCategoryChart(filterData?: any) {
    this._dashboardService.getReportsCategory(filterData).subscribe((res) => {
      this.chartData = res.map((item) => ({
        name: item.category,
        value: item.count,
        color: '#4F008C', // Assign colors dynamically
      }));
    });
  }
}
