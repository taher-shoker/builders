import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../services/dashboard.service';
import {
  Category,
  ReportsService,
  User,
} from '../../../dy-reports/dy-reports.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { convertToDateOnly } from '../../../../shared/helpers';
@Component({
  selector: 'stc-apps-avg-response-chart',
  templateUrl: './avg-response-chart.component.html',
  styleUrls: ['./avg-response-chart.component.scss'],
})
export class AvgResponseChartComponent implements OnInit, OnDestroy {
  @Input({ required: true }) categories!: WritableSignal<Category[]>;
  @Input() perUser = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService,
    private _formBuilder: FormBuilder,
    protected reportsService: ReportsService
  ) {}

  private root!: am5.Root;
  private chart!: am5xy.XYChart;
  private xAxis!: am5xy.DateAxis<am5xy.AxisRendererX>;
  private yAxis!: am5xy.ValueAxis<am5xy.AxisRendererY>;
  chartdi_id = '';
  chartData: { date: number; value: number }[] = [];
  filter: {
    dateFrom: string | null;
    dateTo: string | null;
    category: string | null;
    user: string | null;
  } = {
    dateFrom: null,
    dateTo: null,
    category: null,
    user: null,
  };
  form!: FormGroup;
  alluser!: WritableSignal<User[]>;
  ngOnInit() {
    this.alluser = signal<User[]>([]);

    this.form = this._formBuilder.group({
      category: [''],
      user: [''],
      startDate: [''],
      endDate: [''],
    });
    this.chartdi_id = `${Math.random()}_chartId`;
    if (this.perUser) {
      this.getReportAvgPeruser();
      this.getAllUser();
    } else {
      this.getReportsAvgResTime();
    }
  }

  initChart(): void {
    this.maybeDisposeRoot(this.chartdi_id);
    this.root = am5.Root.new(this.chartdi_id);
    this.chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: true,
        panY: true,
      })
    );

    // Create X & Y axes
    this.xAxis = this.chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: this.perUser ? 'month' : 'month', count: 1 },
        renderer: am5xy.AxisRendererX.new(this.root, {}),
      })
    );

    this.yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );

    if (this.root._logo) {
      this.root._logo.dispose();
    }
    // Add cursor
    this.chart.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        xAxis: this.xAxis,
      })
    );

    // Add tooltips to axes
    this.xAxis.set(
      'tooltip',
      am5.Tooltip.new(this.root, { themeTags: ['axis'] })
    );
    this.yAxis.set(
      'tooltip',
      am5.Tooltip.new(this.root, { themeTags: ['axis'] })
    );
    const series = this.chart.series.push(
      am5xy.LineSeries.new(this.root, {
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: 'value',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(this.root, {}),
        maskBullets: false,
        stroke: am5.color('#4f008c'),
      })
    );

    // Add bullets (circle markers)
    series.bullets.push(() =>
      am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          radius: 5,
          fill: am5.color('#ff6a39'),
        }),
      })
    );

    series.strokes.template.set('strokeWidth', 2);

    series
      ?.get('tooltip')
      ?.label.set(
        'text',
        `Average response time: {valueY} ${this.perUser ? 'Hour' : 'Day'}`
      );

    series.data.setAll(this.chartData);
    series.appear(1000, 100);
  }

  getAllUser() {
    this.reportsService.getUsers().subscribe((res) => {
      this.alluser.set(res);
    });
  }
  datePickerChanged(event: { start: Date; end: Date }) {
    if (
      event.start &&
      event.end &&
      this.filter.dateFrom !== convertToDateOnly(event.start) &&
      this.filter.dateTo !== convertToDateOnly(event.end)
    ) {
      this.filter = {
        ...this.filter,
        dateFrom: convertToDateOnly(event.start),
        dateTo: convertToDateOnly(event.end),
      };

      if (this.perUser) {
        this.getReportAvgPeruser(this.filter);
      } else {
        this.getReportsAvgResTime(this.filter);
      }
      this.form.get('startDate')?.setValue(event.start);
      this.form.get('endDate')?.setValue(event.end);
    }
  }

  handleSelect(event: string, controlName: string) {
    if (controlName === 'category') {
      this.filter = { ...this.filter, category: event };
    } else if (controlName === 'user') {
      this.filter = { ...this.filter, user: event };
    }
    if (this.perUser) {
      this.getReportAvgPeruser(this.filter);
    } else {
      this.getReportsAvgResTime(this.filter);
    }
  }
  getReportsAvgResTime(filter?: any) {
    this._dashboardService.getReportsAvgReponse(filter).subscribe((res) => {
      this.chartData = res.map((item) => ({
        date: new Date(item.year, item.month - 1, 1).getTime() + item.year,
        value: item.avgResponseTime,
      }));

      if (this.chartData.length > 0) {
        this.initChart();
      } else {
        this.maybeDisposeRoot(this.chartdi_id);
      }
    });
  }
  getReportAvgPeruser(filter?: any) {
    this._dashboardService
      .getReportsAvgReponsePerUser(filter)
      .subscribe((res) => {
        this.chartData = res.map((item) => ({
          date: new Date(item.year, item.month - 1, 1).getTime() + item.year,
          value: item.avgResponseTime,
        }));

        if (this.chartData.length > 0) {
          this.initChart();
        } else {
          this.maybeDisposeRoot(this.chartdi_id);
        }
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
  maybeDisposeRoot(divId: string) {
    am5.array.each(am5.registry.rootElements, function (root: any) {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  }
  reset() {
    this.filter = { category: null, dateFrom: null, dateTo: null, user: null };
    this.form.reset();
    if (this.perUser) {
      this.getReportAvgPeruser(this.filter);
    } else {
      this.getReportsAvgResTime(this.filter);
    }
  }
  hasNonNullValue(obj: Record<string, any>): boolean {
    return Object.values(obj).some((value) => value !== null);
  }
  ngOnDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  }
}
