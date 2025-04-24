import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../services/dashboard.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { FormGroup, FormBuilder } from '@angular/forms';
import { convertToDateOnly } from '../../../../shared/helpers';

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

    const pieColors = [
      am5.color('#FF6A39'), // blue
      am5.color('#4F008C'), // orange
      am5.color('#4CAF50'), // green
      am5.color('#FFC107'), // amber
      am5.color('#9C27B0'), // purple
      am5.color('#F44336'), // red
    ];
    const colorSet = am5.ColorSet.new(this.root, {
      colors: pieColors,
      reuse: true, // optional: repeat colors if there are more slices
    });
    series.slices.template.adapters.add('fill', (fill, target: any) => {
      return colorSet.getIndex(series.dataItems.indexOf(target.dataItem));
    });

    series.slices.template.adapters.add('stroke', () => {
      return am5.color(0xffffff); // keep white border
    });
    series.labels.template.setAll({
      fontSize: 12,
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

      this.getReportsSLAChart(this.filter);
      this.form.get('startDate')?.setValue(event.start);
      this.form.get('endDate')?.setValue(event.end);
    }
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
