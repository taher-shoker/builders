import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { DomSanitizer } from '@angular/platform-browser';
export interface BarChartData {
  year : string;
  income : number;
  expenses : number;
}
@Component({
  selector: 'stc-apps-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit , AfterViewInit{
  @Input() data!: BarChartData[];
  math = Math;
  constructor(public dom_s: DomSanitizer){}
  @Input() colors:string[] = [];
  chartdiv_id = '';
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  ngAfterViewInit(): void {
    this.initBarChart();
  }
  initBarChart() {
    const root = am5.Root.new(this.chartdiv_id);
    root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {})
    );
    /* remove amchart logo */
    if(root._logo)
    {
      root._logo.dispose();
    }
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance : 50,
      strokeOpacity: 0.1,
      strokeWidth: 1,
      stroke : am5.color(0x000000),
    });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'year',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );
    xRenderer.grid.template.setAll({
      location: 0.5,
    });
    xAxis.data.setAll(this.data);
    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance : 50,
      strokeOpacity: 0.1,
      strokeWidth: 1,
      stroke : am5.color(0x000000),
    });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1,
        renderer: yRenderer
      })
    );
    yRenderer.grid.template.setAll({
      strokeOpacity : 0,
    });
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Income',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'income',
        categoryXField: 'year',
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'horizontal',
          labelText: '{name} in {categoryX}: {valueY} {info}',
        }),
        fill : am5.color(this.colors[0]),
      })
    );

    series.columns.template.setAll({
      tooltipY: am5.percent(10),
      templateField: 'columnSettings',
      width : am5.percent(40),
    });
    series.data.setAll(this.data);
    chart.set('cursor', am5xy.XYCursor.new(root, {alwaysShow:false}));
    const cursor = chart.get("cursor");
    cursor?.lineX.setAll({
      visible : false
    });
    cursor?.lineY.setAll({
      visible : false
    });
    xAxis.set("tooltip", am5.Tooltip.new(root, {
      forceHidden: true
    }));
    yAxis.set("tooltip", am5.Tooltip.new(root, {
      forceHidden: true,
    }));
    // chart.appear(1000, 100);
  }
}
