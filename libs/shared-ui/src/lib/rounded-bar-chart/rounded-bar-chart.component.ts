import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
export class RoundedBarChartComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  chartdiv_id = `${Math.random()}_chart_id`;
  root!: am5.Root;
  @Input({ required: true }) data: {
    gd: string;
    numberOfUnacceptableProjects: number;
  }[] = [];
  ngAfterViewInit(): void {
    this.roundedBarChart();
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
      this.roundedBarChart();
    }
  }
  roundedBarChart() {
    if (this.root) {
      this.root.dispose();
    }
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        paddingLeft: 0,
        paddingRight: 1,
      })
    );
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    const cursor = chart.set('cursor', am5xy.XYCursor.new(this.root, {}));
    cursor.lineY.set('visible', false);
    cursor.lineX.set('visible', false);
    cursor.setAll({
      snapToSeries: [],
    });
    const xRenderer = am5xy.AxisRendererX.new(this.root, {
      minGridDistance: 30,
      // minorGridEnabled: true,
    });
    xRenderer.labels.template.setAll({
      fontFamily: 'STCForwardFont',
      fill: am5.color(0x7a7a7b),
      fontSize: 13,
      paddingTop: 10,
      oversizedBehavior: 'truncate',
      maxWidth: 50, // Adjust this width as needed
      // rotation: -90,
      // centerY: am5.p50,
      // centerX: am5.p100,
      // paddingRight: 15,
    });
    xRenderer.grid.template.setAll({
      location: 1,
    });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        maxDeviation: 0.3,
        categoryField: 'gd',
        renderer: xRenderer,
        // tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    const yRenderer = am5xy.AxisRendererY.new(this.root, {});
    yRenderer.labels.template.setAll({
      forceHidden: true,
    });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation: 0.3,
        renderer: yRenderer,
        min: 0,
      })
    );
    yRenderer.grid.template.setAll({
      forceHidden: true,
    });
    xRenderer.grid.template.setAll({
      forceHidden: true,
    });
    const series = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'Series 1',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'numberOfUnacceptableProjects',
        sequencedInterpolation: true,
        categoryXField: 'gd',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: '{categoryX} : {valueY}',
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
    series.bullets.push(() => {
      return am5.Bullet.new(this.root, {
        locationY: 1,
        sprite: am5.Label.new(this.root, {
          text: "{valueYWorking.formatNumber('#.')}",
          fill: this.root.interfaceColors.get('alternativeText'),
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
    const data = this.data;
    xAxis.data.setAll(data);
    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);
  }
}
