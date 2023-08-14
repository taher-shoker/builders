import { Component, Input, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
export interface LineChartData {
  category: string,
  value: number,
}
@Component({
  selector: 'stc-apps-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @Input() chartData!: LineChartData[];
  @Input() colors:string[] = [];
  ngOnInit(){
    this.lineChart()
  }
  lineChart()
  {
    const data = this.chartData;
    const root = am5.Root.new("lineChartDiv");
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      layout: root.verticalLayout
    }));
    // const myTheme = am5.Theme.new(root);
    // myTheme.rule("Grid").setAll({
    //   stroke: am5.color('#182237'),
    //   strokeWidth: 2
    // });
    // myTheme.rule("Grid" , ['base']).setAll({
    //   stroke: am5.color('#ffffff'),
    //   strokeWidth: 2
    // });
    // root.setThemes([myTheme]);
    // Create a chart instance
    if(root._logo)
    {
      root._logo.dispose();
    }
    // chart.get("colors")?.set("step", 3);
    const allColors:am5.Color[] = [];
    this.colors.forEach((color:string) => {
      allColors.push(am5.color(color))
      chart.get("colors")?.set("colors", allColors);
    })
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "category",
          startLocation: 0.2,
          endLocation: 0.8,
          maxDeviation: 50,
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance : 50,
            strokeOpacity: 1,
            strokeWidth: 2,
            stroke : am5.color(0x000000)
          }),
        })
      );
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.5,
        renderer: am5xy.AxisRendererY.new(root, {
          pan:"zoom",
          strokeOpacity: 1,
          strokeWidth: 2,
          stroke : am5.color(0x000000),
          marginLeft : 15
        })
      })
    );
    chart.gridContainer.dispose()
    const xRenderer = xAxis.get("renderer");
    const yRenderer = yAxis.get("renderer");
    xRenderer.ticks.template.setAll({
      stroke: am5.color(0x000000),
      visible: true,
      strokeWidth : 2,
      height : 30
    });
    xRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: "1em",
      paddingTop :20
    });

    yRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: "1em",
    });
    // let xRenderer = xAxis.get("renderer");
    // xRenderer.grid.template.setAll({
    //   stroke: am5.color('#ffffff'),
    //   strokeWidth: 0,
    //   visible : true
    // });
    // xAxis.get("dateFormats")["day"] = "MMM";
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "category",
        categoryXField: "category",
        categoryYField : "value",
        legendLabelText: "[bold]Sent SMSs[/]",
        // legendRangeLabelText: "[{stroke}]Sent SMSs[/]",
        legendValueText: "[bold {stroke}]{value}[/]",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'horizontal',
          labelText: '{name} in {categoryX}: {valueY} {info}',
        }),
      })
    );
      const arr:{category:string}[] = []
      this.chartData.forEach((data2) => {
        arr.push({category : data2.category});
      })
      xAxis.data.setAll(arr)
      series.data.setAll(arr)
    series.data.setAll(data);
    series.bullets.push(() => {
      const circle = am5.Circle.new(root, {
        radius: 6,
        fill: am5.color(this.colors[1]),
        stroke: root.interfaceColors.get("background"),
        strokeWidth: 0,
      });

      return am5.Bullet.new(root, {
        sprite: circle
      });
    });

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
    series.strokes.template.setAll({
      strokeWidth: 2
    });
    // root.dateFormatter.setAll({
    //   dateFormat: "yyyy",
    //   dateFields: ["valueX"]
    // });
    // Set data

    series.appear(1000);
    chart.appear(1000, 100);
  }
}
