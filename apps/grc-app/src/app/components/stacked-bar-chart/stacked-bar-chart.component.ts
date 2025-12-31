import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
// import am5index from '@amcharts/amcharts5/index';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'stc-apps-stacked-bar-chart',
  standalone: false,
  templateUrl: './stacked-bar-chart.component.html',
  styleUrl: './stacked-bar-chart.component.scss',
})
export class StackedBarChartComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  chartdiv_id = `chart_${Math.random().toString(36).substring(2, 15)}`;
  @Input() data: any[] = [];
  root!: am5.Root;
  // ngOnInit(): void {
  //   // this.chartdiv_id = `${Math.random()}_chart_id`;
  // }
  ngAfterViewInit() {
    this.stackedBarChart();
  }
  ngOnDestroy(): void {
    // 4. Clean up when component is removed
    if (this.root) {
      this.root.dispose();
    }
    am5.array.each(am5.registry.rootElements, (root) => {
      if (root && root.dom.id === this.chartdiv_id) {
        root.dispose();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange && this.root) {
      this.stackedBarChart();
    }
  }
  constructor(public dom_s: DomSanitizer) {}
  stackedBarChart() {
    this.root = am5.Root.new(this.chartdiv_id);
    const myTheme = am5.Theme.new(this.root);
    myTheme.rule('Grid', ['base']).setAll({
      strokeOpacity: 0.1,
    });
    this.root.setThemes([am5themes_Animated.new(this.root), myTheme]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        paddingLeft: 0,
        layout: this.root.verticalLayout,
      })
    );
    chart
      .get('colors')
      ?.set('colors', [
        am5.color(0x22c55e),
        am5.color(0xeab308),
        am5.color(0xdc2626),
        am5.color(0x86a873),
        am5.color(0xbb9f06),
      ]);
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    const data = this.data;
    const yRenderer = am5xy.AxisRendererY.new(this.root, {});
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'name',
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    yRenderer.grid.template.setAll({
      location: 1,
      forceHidden: true,
    });
    yAxis.data.setAll(data);
    const xRenderer = am5xy.AxisRendererX.new(this.root, {
      minGridDistance: 40,
      strokeOpacity: 0,
      forceHidden: true,
    });
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.root, {
        min: 0,
        maxPrecision: 0,
        renderer: xRenderer,
        strictMinMax: true,
        calculateTotals: true,
      })
    );
    xRenderer.grid.template.setAll({
      forceHidden: true,
    });
    xRenderer.labels.template.setAll({
      forceHidden: true,
    });
    // const legend = chart.children.push(
    //   am5.Legend.new(this.root, {
    //     centerX: am5.p50,
    //     x: am5.p50,
    //   })
    // );
    const makeSeries = (name: string, fieldName: string) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(this.root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          categoryYField: 'name',
        })
      );
      series.columns.template.adapters.add(
        'strokeOpacity',
        (strokeOpacity, target) => {
          const dataItem = target.dataItem;
          if (dataItem) {
            const context = dataItem.dataContext as any;
            // Check the raw value from your data
            if (context[fieldName] === 0) {
              return 0; // Hide the border completely
            }
          }
          return strokeOpacity;
        }
      );
      series.columns.template.setAll({
        tooltipText: `${name} : {valueX}`,
        tooltipY: am5.percent(90),
        cornerRadiusTL: 10,
        cornerRadiusTR: 10,
        cornerRadiusBL: 10,
        cornerRadiusBR: 10,
      });
      series.data.setAll(data);
      series.appear();
      ``;
      series.bullets.push(
        series.bullets.push(function (root, series, dataItem) {
          const value = (dataItem.dataContext as any)[fieldName];
          if (value < 10) {
            return undefined;
          }
          return am5.Bullet.new(root, {
            sprite: am5.Label.new(root, {
              // Tip: Use fieldName in text to show the segment size (e.g. "1")
              // instead of the cumulative stack position (e.g. "81")
              text: '{' + fieldName + '}',
              fill: root.interfaceColors.get('alternativeText'),
              centerY: am5.p50,
              centerX: am5.p50,
              populateText: true,
            }),
          });
        })
      );
    };
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key) => {
        if (key !== 'name') {
          makeSeries(key, key);
        }
      });
    }

    chart.appear(1000, 100);
  }
}
