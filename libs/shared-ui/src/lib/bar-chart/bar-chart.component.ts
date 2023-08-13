import { Component, Input, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'stc-apps-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  @Input() data: any;
  root: any;
  chart: any;
  xAxis: any;
  yAxis: any;

  initBarChart() {
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    this.chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {})
    );

    this.data = [
      {
        year: '2016',
        income: 23.5,
        expenses: 21.1,
      },
      {
        year: '2017',
        income: 26.2,
        expenses: 30.5,
      },
      {
        year: '2018',
        income: 30.1,
        expenses: 34.9,
      },
      {
        year: '2019',
        income: 29.5,
        expenses: 31.1,
      },
      {
        year: '2020',
        income: 30.6,
        expenses: 28.2,
      },
      {
        year: '2021',
        income: 34.1,
        expenses: 32.9,
      },
    ];

    const xRenderer = am5xy.AxisRendererX.new(this.root, {});
    const xAxis = this.chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'year',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    xRenderer.grid.template.setAll({
      location: 1,
    });

    xAxis.data.setAll(this.data);

    const yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        min: 0,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererY.new(this.root, {
          strokeOpacity: 0.1,
        }),
      })
    );

    const series = this.chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'Income',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'income',
        categoryXField: 'year',
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: 'horizontal',
          labelText: '{name} in {categoryX}: {valueY} {info}',
        }),
      })
    );

    series.columns.template.setAll({
      tooltipY: am5.percent(10),
      templateField: 'columnSettings',
    });

    series.data.setAll(this.data);
    this.chart.set('cursor', am5xy.XYCursor.new(this.root, {}));
    this.chart.appear(1000, 100);
  }

  ngOnInit(): void {
    this.root = am5.Root.new('chartdiv-bar');
    /* remove amchart logo */
    this.root._logo.dispose();
    this.initBarChart();
  }
}
