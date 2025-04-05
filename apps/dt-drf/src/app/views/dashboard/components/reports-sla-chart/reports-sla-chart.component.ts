import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../services/dashboard.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'stc-apps-reports-sla-chart',
  templateUrl: './reports-sla-chart.component.html',
  styleUrls: ['./reports-sla-chart.component.scss'],
})
export class ReportsSlaChartComponent implements OnInit, OnDestroy {
  private root!: am5.Root;
  chartdiv_id = '';
  chartData: { category: string; value: number }[] = [];
  filter: {
    dateFrom: string | null;
    dateTo: string | null;
  } = {
    dateFrom: null,
    dateTo: null,
  };
  form!: FormGroup;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dashboardService: DashboardService,
    private _formBuilder: FormBuilder
  ) {}

  createChart() {
    this.maybeDisposeRoot(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
      am5percent.PieChart.new(this.root, {
        layout: this.root.verticalLayout,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(this.root, {
        alignLabels: true,
        calculateAggregates: true,
        valueField: 'value',
        categoryField: 'category',
      })
    );

    series.slices.template.setAll({
      strokeWidth: 3,
      stroke: am5.color(0xffffff),
    });
    series.labels.template.setAll({
      fontSize: 14,
      text: '{category}:{value}%',
      fontWeight: 'bold',
    });
    /* remove amchart logo */
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    // Set Data
    series.data.setAll(this.chartData);

    series.appear(1000, 100);
  }
  maybeDisposeRoot(divId: string) {
    am5.array.each(am5.registry.rootElements, function (root: any) {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  }
  ngOnDestroy() {
    this.root.dispose();
  }
  ngOnInit() {
    this.form = this._formBuilder.group({
      startDate: [''],
      endDate: [''],
    });
    this.chartdiv_id = `${Math.random()}_chart_id`;
    this.getReportsSLAChart();
  }

  datePickerChanged(event: { start: Date; end: Date }) {
    if (event.start && event.end) {
      this.filter = {
        ...this.filter,
        dateFrom: this.convertToDateOnly(event.start),
        dateTo: this.convertToDateOnly(event.end),
      };
      this.getReportsSLAChart(this.filter);
    }
    console.log('this.filter');
  }
  convertToDateOnly(date: Date | null): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  }
  reset() {
    this.filter = { dateFrom: null, dateTo: null };
    this.form.reset();
    this.getReportsSLAChart(this.filter);
  }
  hasNonNullValue(obj: Record<string, any>): boolean {
    return Object.values(obj).some((value) => value !== null);
  }
  getReportsSLAChart(filterData?: any) {
    this._dashboardService.getReportsSLA(filterData).subscribe((res) => {
      this.chartData = res.map((item) => ({
        category: item.sla,
        value: item.percentage,
      }));
      this.createChart();
    });
  }
}
