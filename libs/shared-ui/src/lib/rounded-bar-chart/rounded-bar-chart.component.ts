import { AfterViewInit, Component, OnInit } from '@angular/core';
import am5index from '@amcharts/amcharts5/index';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'stc-apps-rounded-bar-chart',
  standalone: false,
  templateUrl: './rounded-bar-chart.component.html',
  styleUrl: './rounded-bar-chart.component.scss',
})
export class RoundedBarChartComponent implements OnInit, AfterViewInit {
  chartdiv_id = '';
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  ngAfterViewInit(): void {
    this.roundedBarChart();
  }
  roundedBarChart() {
    const root = am5.Root.new(this.chartdiv_id);
    root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        paddingLeft: 0,
        paddingRight: 1,
      })
    );
    if (root._logo) {
      root._logo.dispose();
    }
    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);
    cursor.lineX.set('visible', false);
    cursor.setAll({
      snapToSeries: [],
    });
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      // minorGridEnabled: true,
    });
    xRenderer.labels.template.setAll({
      fontFamily: 'STCForwardFont',
      fill: am5.color(0x7a7a7b),
      fontSize: 13,
      paddingTop: 10,
      // rotation: -90,
      // centerY: am5.p50,
      // centerX: am5.p100,
      // paddingRight: 15,
    });
    xRenderer.grid.template.setAll({
      location: 1,
    });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: 'country',
        renderer: xRenderer,
        // tooltip: am5.Tooltip.new(root, {}),
      })
    );
    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.setAll({
      forceHidden: true,
    });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer,
      })
    );
    yRenderer.grid.template.setAll({
      forceHidden: true,
    });
    xRenderer.grid.template.setAll({
      forceHidden: true,
    });
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Series 1',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        sequencedInterpolation: true,
        categoryXField: 'country',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );
    series.columns.template.setAll({
      cornerRadiusTL: 25,
      cornerRadiusTR: 25,
      cornerRadiusBL: 25,
      cornerRadiusBR: 25,
      width: am5.p50,
      strokeOpacity: 0,
    });
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Label.new(root, {
          text: "{valueYWorking.formatNumber('#.')}",
          fill: root.interfaceColors.get('alternativeText'),
          centerY: am5.p0,
          centerX: am5.p50,
          populateText: true,
          fontFamily: 'STCForwardFont',
        }),
      });
    });
    series.columns.template.adapters.add('fill', function (fill, target) {
      // return chart.get('colors')?.getIndex(series.columns.indexOf(target));
      return am5.color(0xdc2626);
    });
    series.columns.template.adapters.add('stroke', function (stroke, target) {
      return chart.get('colors')?.getIndex(series.columns.indexOf(target));
    });
    const data = [
      {
        country: 'DP',
        value: 3,
      },
      {
        country: 'Exc',
        value: 1,
      },
      {
        country: 'AI',
        value: 5,
      },
      {
        country: 'Ja',
        value: 1,
      },
      {
        country: 'EB',
        value: 7,
      },
      {
        country: 'CB',
        value: 5,
      },
    ];
    xAxis.data.setAll(data);
    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);
  }
}
