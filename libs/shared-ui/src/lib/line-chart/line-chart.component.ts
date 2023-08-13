import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'stc-apps-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @Input() data: any;
  root: any;
  chart: any;
  xAxis: any;
  yAxis: any;

  initLineCart() {
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    this.chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {})
    );
    const cursor = this.chart.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);

    // The data
    this.data = [
      {
        year: '1930',
        italy: 1,
        germany: 5,
        uk: 3,
      },
      {
        year: '1934',
        italy: 1,
        germany: 2,
        uk: 6,
      },
      {
        year: '1938',
        italy: 2,
        germany: 3,
        uk: 1,
      },
      {
        year: '1950',
        italy: 3,
        germany: 4,
        uk: 1,
      },
      {
        year: '1954',
        italy: 5,
        germany: 1,
        uk: 2,
      },
      {
        year: '1958',
        italy: 3,
        germany: 2,
        uk: 1,
      },
      {
        year: '1962',
        italy: 1,
        germany: 2,
        uk: 3,
      },
      {
        year: '1966',
        italy: 2,
        germany: 1,
        uk: 5,
      },
      {
        year: '1970',
        italy: 3,
        germany: 5,
        uk: 2,
      },
      {
        year: '1974',
        italy: 4,
        germany: 3,
        uk: 6,
      },
      {
        year: '1978',
        italy: 1,
        germany: 2,
        uk: 4,
      },
    ];

    const xRenderer = am5xy.AxisRendererX.new(this.root, {});
    xRenderer.grid.template.setAll({
      forceHidden: true,
    });
    xRenderer.labels.template.setAll({
      location: 0.5,
      multiLocation: 0.5,
    });

    this.xAxis = this.chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'year',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );

    this.xAxis.data.setAll(this.data);
    // const yRenderer = am5xy.AxisRendererY.new(this.root, {});
    // yRenderer.grid.template.setAll({
    //   forceHidden: true,
    // });

    this.yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(this.root, {
          inversed: true,
        }),
      })
    );
  }
  createSeries(name: string, field: string) {
    const series = this.chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: name,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: field,
        categoryXField: 'year',
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: 'horizontal',
          labelText: '[bold]{name}[/]\n{categoryX}: {valueY}',
        }),
      })
    );

    series.bullets.push(() => {
      return am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          radius: 5,
          fill: series.get('fill'),
        }),
      });
    });

    series.set('setStateOnChildren', true);
    series.states.create('hover', {});

    series.mainContainer.set('setStateOnChildren', true);
    series.mainContainer.states.create('hover', {});

    series.strokes.template.states.create('hover', {
      strokeWidth: 4,
    });

    series.data.setAll(this.data);
    series.appear(1000);
  }

  ngOnInit(): void {
    this.root = am5.Root.new('chartdiv');
    /* remove amchart logo */
    this.root._logo.dispose();
    this.initLineCart();

    this.createSeries('Italy', 'italy');
  }
}
