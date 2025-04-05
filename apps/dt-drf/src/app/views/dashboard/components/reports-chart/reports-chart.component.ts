import {
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Category,
  DashboardService,
  ReportData,
} from '../../../../services/dashboard.service';
import { AuthService } from '../../../../services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'stc-apps-reports-chart',
  templateUrl: './reports-chart.component.html',
  styleUrls: ['./reports-chart.component.scss'],
})
export class ReportsChartComponent implements OnInit {
  @Input({ required: true }) categories!: WritableSignal<Category[]>;
  form!: FormGroup;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService,
    public authService: AuthService,
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
    status: string | null;
  } = {
    dateFrom: null,
    dateTo: null,
    category: null,
    status: null,
  };
  ngOnInit() {
    this.form = this._formBuilder.group({
      startDate: [''],
      endDate: [''],
      category: [''],
      status: [''],
    });
    this.getReportsChartData();
  }
  datePickerChanged(event: { start: Date; end: Date }) {
    if (event.start && event.end) {
      this.filter = {
        ...this.filter,
        dateFrom: this.convertToDateOnly(event.start),
        dateTo: this.convertToDateOnly(event.end),
      };
      this.getReportsChartData(this.filter);
    }
  }
  convertToDateOnly(date: Date | null): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  }
  handleSelect(event: string, controlName: string) {
    if (controlName === 'status') {
      this.filter = { ...this.filter, status: event };
      this.getReportsChartData(this.filter);
    } else if (controlName === 'category') {
      this.filter = { ...this.filter, category: event };
      this.getReportsChartData(this.filter);
    }
  }

  getReportsChartData(filterData?: any) {
    this._dashboardService
      .getAllReportsChart(filterData)
      .subscribe((res: ReportData[]) => {
        this.chartData = res.map((item) => ({
          name: this.getMonthName(item.month) + ' ' + item.year,
          value: item.count,
          color: '#4F008C', // Assign colors dynamically
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

  reset() {
    this.filter = {
      status: null,
      category: null,
      dateFrom: null,
      dateTo: null,
    };
    this.form.reset();
    this.getReportsChartData(this.filter);
  }
  hasNonNullValue(obj: Record<string, any>): boolean {
    return Object.values(obj).some((value) => value !== null);
  }
}
