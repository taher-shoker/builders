import { AfterViewInit, Component, ElementRef, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
// import am5index from '@amcharts/amcharts5/index';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5 from '@amcharts/amcharts5';
import { DomSanitizer } from '@angular/platform-browser';
export interface ChartData {
  month:string;
  value1:number;
  value2?:number;
}
@Component({
  selector: 'stc-apps-double-line-chart',
  standalone: false,
  templateUrl: './double-line-chart.component.html',
  styleUrl: './double-line-chart.component.scss',
})
export class DoubleLineChartComponent implements AfterViewInit, OnDestroy , OnInit {
  chartData:InputSignal<ChartData[]> = input.required<ChartData[]>();
  colors:InputSignal<string[]> = input.required<string[]>();
  chartdiv_id = '';
  private root!: am5.Root;
  ngAfterViewInit(): void {
    this.doubleLineChart();
  }
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_pie_chart_id`;
  }
  constructor(public dom_s: DomSanitizer, private elRef: ElementRef) {}
  doubleLineChart() {
    this.root = am5.Root.new(this.chartdiv_id);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
      })
    );

    chart.get('colors')?.set('step', 3);
    this.root.numberFormatter.set("numberFormat", "#.a");
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    const cursor = chart.set('cursor', am5xy.XYCursor.new(this.root, {}));
    cursor.lineY.set('visible', false);
    cursor.lineX.set('visible', false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        renderer: am5xy.AxisRendererX.new(this.root, {
          minorGridEnabled: false,
          minGridDistance: 30, // Ensure labels are spaced properly
          visible: true,
          strokeOpacity: 1,
          strokeWidth: 2,
          stroke: am5.color("#000"),
        }),
        categoryField: 'month',
      })
    );
    xAxis.get("renderer").ticks.template.setAll({
      visible: true,       // Show ticks
      length: 6,          // Set tick length
      strokeOpacity: 1,    // Set tick visibility (1 for fully visible)
      strokeWidth: 2,      // Set tick thickness
      stroke: am5.color(0x000000) // Set tick color (black in this case)
    });
    xAxis.get("renderer").labels.template.setAll({
      visible: true,
      fontSize: 20,  // Set desired font size
      rotation: 0,   // Keep labels horizontal
      fontWeight:"700",
      paddingTop:15
    });
    // xAxis.get("renderer").grid.template.set("visible", false);
    // const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
    //   maxDeviation: 0.3,
    //   renderer: am5xy.AxisRendererY.new(this.root, {})
    // }));

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {
          strokeOpacity: 1,
          strokeWidth: 2,
          stroke: am5.color("#000"),
        }),
      })
    );
    yAxis.get("renderer").labels.template.setAll({
      visible: true,
      fontSize: 15,  // Set desired font size
      rotation: 0,   // Keep labels horizontal
      fontWeight:"700",
      paddingRight:15
    });
    yAxis.get("renderer").ticks.template.setAll({
      visible: true,       // Show ticks
      length: 6,          // Set tick length
      strokeOpacity: 1,    // Set tick visibility (1 for fully visible)
      strokeWidth: 2,      // Set tick thickness
      stroke: am5.color(0x000000) // Set tick color (black in this case)
    });
    xAxis.get('renderer').labels.template.setAll({
      visible: true,
      rotation: 0, // Adjust rotation if needed
      fontSize: 12, // Font size for labels
      maxWidth: 100, // Avoid too wide labels
      oversizedBehavior: 'wrap', // Wrap if labels are too long
    });
    xAxis.get('renderer').grid.template.setAll({
      visible: false,
    });
    yAxis.get('renderer').grid.template.setAll({
      visible: false,
    });
    xAxis
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    const series = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: 'value1',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value1',
        categoryXField: 'month', // Use the month as the category field
        stroke: am5.color(this.colors()[0]),
        tooltip: am5.Tooltip.new(this.root, {
          labelText: 'Actual in {categoryX} : {valueY}',  
          getFillFromSprite: false,
          autoTextColor: false,
        })
      })
    );
    series.get('tooltip')?.get('background')?.setAll({
      fillOpacity :1,
      fill : am5.color(this.colors()[0])
    })
    series.get('tooltip')?.label.setAll({
      fill: am5.color(0xffffff)
    })
    // const isExists = this.chartData().every(obj => obj.value2 !== null);
    // console.log(isExists);
    const series2 = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: 'value2',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value2',
        categoryXField: 'month', // Use the period field as the category
        stroke: am5.color(this.colors()[1]), // Orange color for second line
        tooltip: am5.Tooltip.new(this.root, { 
          // labelText: '{categoryX} : {valueY}', 
          labelText: 'Target in {categoryX} : {valueY}', 
          getFillFromSprite: false,
          autoTextColor: false
        }),
      })
    );
    series2.get('tooltip')?.get('background')?.setAll({
      fillOpacity :1,
      fill : am5.color(this.colors()[1])
    })
    series2.get('tooltip')?.label.setAll({
      fill: am5.color(0xffffff)
    })
    series2.strokes.template.setAll({
      strokeWidth: 2,
      strokeDasharray: [5, 5], // Dashed pattern with 5-pixel dashes and 5-pixel gaps
    });
    series2.bullets.push(() => {
      return am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          radius: 4,
          fill: am5.color(0xff6a39),
        }),
      });
    });

    series.bullets.push(() => {
      return am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          radius: 4,
          fill: am5.color("#4F008C"),
        }),
      });
    });

    // Set data
    const data = this.chartData();
    xAxis.data.setAll(data); // Set data for the X-axis
    series.data.setAll(data);
    series2.data.setAll(data);
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
  }
  ngOnDestroy() {
    // Cleanup chart when component is destroyed
    if (this.root) {
      this.root.dispose();
    }
  }
}
