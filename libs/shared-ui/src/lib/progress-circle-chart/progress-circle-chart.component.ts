import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface ProgressCircleData {

  category: string,
  value: number,
  full: number,
  // columnSettings
}

@Component({
  selector: 'stc-apps-progress-circle-chart',
  templateUrl: './progress-circle-chart.component.html',
  styleUrls: ['./progress-circle-chart.component.scss'],
})
export class ProgressCircleChartComponent implements OnInit {

  // @Input({required: true}) data! : ProgressCircleData[];

  constructor(private elRef: ElementRef){}

  ngOnInit(): void {
    this.displayProgressCircleChart();
  }

  displayProgressCircleChart(){

    const root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    const chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      // wheelX: "panX",
      // wheelY: "zoomX",
      innerRadius: am5.percent(20),
      startAngle: -90,
      endAngle: 180
    }));

    // Data
    const data = [{
      category: "Research",
      value: 80,
      full: 100,
      columnSettings: {
        fill: chart.get("colors")?.getIndex(0)
      }
    }, {
      category: "Marketing",
      value: 35,
      full: 100,
      columnSettings: {
        fill: chart.get("colors")?.getIndex(1)
      }
    }, {
      category: "Distribution",
      value: 92,
      full: 100,
      columnSettings: {
        fill: chart.get("colors")?.getIndex(2)
      }
    }];

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
    const cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
      behavior: "zoomX"
    }));


    cursor.lineY.set("visible", false);

    // Create axes and their renderers
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
    const xRenderer = am5radar.AxisRendererCircular.new(root, {
      //minGridDistance: 50
    });

    xRenderer.labels.template.setAll({
      radius: 10
    });

    xRenderer.grid.template.setAll({
      forceHidden: true
    });

    const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      renderer: xRenderer,
      min: 0,
      max: 100,
      strictMinMax: true,
      numberFormat: "#'%'",
      tooltip: am5.Tooltip.new(root, {})
    }));

    const yRenderer = am5radar.AxisRendererRadial.new(root, {
      minGridDistance: 20
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: "500",
      fontSize: 18,
      templateField: "columnSettings"
    });

    yRenderer.grid.template.setAll({
      forceHidden: true
    });

    const yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: yRenderer
    }));

    yAxis.data.setAll(data);

    // Create series
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
    const series1 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "full",
      categoryYField: "category",
      fill: root.interfaceColors.get("alternativeBackground")
    }));

    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 0.08,
      strokeOpacity: 0,
      cornerRadius: 20
    });

    series1.data.setAll(data);

    const series2 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "value",
      categoryYField: "category"
    }));

    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      tooltipText: "{category}: {valueX}%",
      cornerRadius: 20,
      templateField: "columnSettings"
    });

    series2.data.setAll(data);

    // Animate chart and series in
    // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);


    // let canvas = document.getElementsByTagName("canvas");
    // console.log("The canvas ", canvas)
    // // canvas = canvas[canvas.length-1]
    // // console.log("The canvas 2", canvas)
    // console.log("The canvas 2", canvas[1])

    // if (canvas) {
      // canvas.style.display = "none"
      // icons.forEach((element: { style: { display: string; }; }) => {
      //   element.style.display = "none";
      // });
    // }
  }

}
