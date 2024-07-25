/* eslint-disable prefer-const */
import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'stc-apps-xy-chart',
  templateUrl: './XY-chart.component.html',
  styleUrl: './XY-chart.component.scss',
})
export class XYChartComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  /* Chart code */

  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  root!: am5.Root;
  chartdiv_id = '';
  ngAfterViewInit(): void {
    this.xyChart();
  }
  xyChart() {
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        layout: this.root.verticalLayout,
      })
    );
    if (this.root._logo) {
      this.root._logo.dispose();
    }

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    let data = [
      {
        year: '2021',
        europe: 50,
        africa: 20,
      },
      {
        year: '2022',
        europe: 70,
        africa: 70,
      },
      {
        year: '2023',
        europe: 20,
        africa: 60,
      },
      {
        year: '2024',
        europe: 0,
        africa: 0,
      },
    ];

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(this.root, {
      cellStartLocation: 0.2,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'year',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );

    xRenderer.grid.template.setAll({
      location: 1,
    });

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        min: 0,
        max: 100,
        renderer: am5xy.AxisRendererY.new(this.root, {
          strokeOpacity: 0.1,
          minGridDistance: 40,
        }),
      })
    );
    let yRenderer = yAxis.get('renderer');
    yRenderer.ticks.template.setAll({
      stroke: am5.color(0x0000),
      visible: true,
    });
    xRenderer.ticks.template.setAll({
      stroke: am5.color(0x0000),
      visible: true,
    });
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    const makeSeries = (name: string, fieldName: string, color: string) => {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(this.root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: 'year',
        })
      );

      series.columns.template.setAll({
        tooltipText: '{name}, {categoryX}:{valueY}',
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
      });

      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(() => {
        return am5.Bullet.new(this.root, {
          locationY: 0,
          sprite: am5.Label.new(this.root, {
            text: '{valueY}',
            fill: this.root.interfaceColors.get('alternativeText'),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      series.set('fill', am5.color(color));
      legend.data.push(series);
    };

    makeSeries('Actual (SAR Bn)', 'europe', '#4F008C');
    makeSeries('Target (SAR Bn)', 'africa', '#EEEEEE');
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
  }
}
