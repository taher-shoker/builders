import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'stc-apps-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrl: './column-chart.component.scss',
})
export class ColumnChartComponent implements OnInit, AfterViewInit, OnChanges {
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  /* Chart code */

  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  root!: am5.Root;
  chartdiv_id = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() chartData: any[] = [];
  @Input() colors: string[] = [];
  @Input() unit: string = '';

  ngAfterViewInit(): void {
    this.columnChart();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && !changes['chartData'].isFirstChange()) {
      this.columnChart();
    }
  }
  columnChart() {
    if (this.root) {
      this.root.dispose();
    }
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    // eslint-disable-next-line prefer-const
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
    // eslint-disable-next-line prefer-const
    let legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 20,
      })
    );
    const minValue = Math.min(
      ...this.chartData.map((item) => Math.min(item.Actual, item.Target))
    );
    const maxValue = Math.max(
      ...this.chartData.map((item) => Math.max(item.Actual, item.Target))
    );

    const padding = (maxValue - minValue) * 0.1;
    const minY = minValue - padding;
    const maxY = maxValue + padding;

    const allYears = [...new Set(this.chartData.map((item) => item.year))].sort(
      (a: any, b: any) => a - b
    );

    const processedData = allYears.map((year) => {
      const item = this.chartData.find((data) => data.year === year);
      return {
        year: year,
        Actual: item ? item.Actual : 0,
        Target: item ? item.Target : 0,
      };
    });

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    // eslint-disable-next-line prefer-const
    let xRenderer = am5xy.AxisRendererX.new(this.root, {
      cellStartLocation: 0.2,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
    });

    // eslint-disable-next-line prefer-const
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

    xAxis.data.setAll(processedData);

    // eslint-disable-next-line prefer-const
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        min: minY,
        max: maxY,
        renderer: am5xy.AxisRendererY.new(this.root, {
          strokeOpacity: 0.1,
          minGridDistance: 40,
        }),
      })
    );
    // eslint-disable-next-line prefer-const
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
      // eslint-disable-next-line prefer-const
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
        tooltipText: `{name}, {categoryX}:{valueY}`,
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
      });

      series.data.setAll(processedData);

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
      legend.markerRectangles.template.setAll({
        cornerRadiusTL: 10,
        cornerRadiusTR: 10,
        cornerRadiusBL: 10,
        cornerRadiusBR: 10,
      });
    };

    makeSeries(`Actual ${this.unit}`, 'Actual', this.colors[1]);
    makeSeries(`Target ${this.unit}`, 'Target', this.colors[0]);
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
  }
}
