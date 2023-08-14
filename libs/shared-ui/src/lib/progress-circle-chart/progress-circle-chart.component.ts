/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export interface ProgressCircleData {
  category: string,
  value: number,
  full: number,
}

@Component({
  selector: 'stc-apps-progress-circle-chart',
  templateUrl: './progress-circle-chart.component.html',
  styleUrls: ['./progress-circle-chart.component.scss'],
})
export class ProgressCircleChartComponent implements OnInit, OnDestroy {

  @Input({required: true}) data! : ProgressCircleData[];
  @Input() colors : string[] = [];
  @Input() totalCases : number = 0;

  root!: am5.Root;

  constructor(private elRef: ElementRef){}

  ngOnInit(): void {
    this.displayProgressCircleChart();
    this.root._logo?.dispose();
  }

  displayProgressCircleChart(){

    this.root = am5.Root.new("progressChart");
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);

    const chart = this.root.container.children.push(am5radar.RadarChart.new(this.root, {
      panX: false,
      panY: false,
      // wheelX: "panX",
      // wheelY: "zoomX",
      innerRadius: am5.percent(25),
      startAngle: -90,
      endAngle: 180
    }));
    // Data
    const data = this.data
    // const cursor = chart.set("cursor", am5radar.RadarCursor.new(this.root, {}));

    // Remove those 2 lines to shows the dashes lines on hovering!
    // cursor.lineY.set("visible", false);
    // cursor.lineX.set("visible", false);

    // Create axes and their renderers
    const xRenderer = am5radar.AxisRendererCircular.new(this.root, {
      minGridDistance: 50,

    });

    // Increasing the radius will push the *outside* of the circle farther
    xRenderer.labels.template.setAll({
      radius: 10,
      visible : false
    });

    // Remove this line if you want to show the dashed lines of the circle in the under-background!
    xRenderer.grid.template.setAll({
      forceHidden: true
    });


    const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(this.root, {
      renderer: xRenderer,
      min: 0,
      max: 100,
      strictMinMax: true,
      numberFormat: "#'%'",
      tooltip: am5.Tooltip.new(this.root, {}),
    }));

    const yRenderer = am5radar.AxisRendererRadial.new(this.root, {
      minGridDistance: 20
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: "500",
      fontSize: 17,
      templateField: "columnSettings",
      radius : 5
    });

    yRenderer.grid.template.setAll({
      forceHidden: true
    });

    const yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(this.root, {
      categoryField: "category",
      renderer: yRenderer
    }));

    yAxis.data.setAll(data);

    // Create series
    const series1 = chart.series.push(am5radar.RadarColumnSeries.new(this.root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "full",
      categoryYField: "category",
      fill: this.root.interfaceColors.get("alternativeBackground"),
    }));

    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 0.08,
      strokeOpacity: 0,
      cornerRadius: 20,
      dRadius : 5
    });

    chart.children.unshift(am5.Label.new(this.root, {
      text: "All cases",
      fontSize: 20,
      fontWeight: "500",
      textAlign: "center",
      y: am5.percent(44),
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0,
      fill : am5.color("#8e9aa0")
    }));
    chart.children.unshift(am5.Label.new(this.root, {
      text: `${this.totalCases}`,
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      y: am5.percent(49),
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0
    }));

    series1.data.setAll(data);
    const allColors:am5.Color[] = [];
    this.colors.forEach((color:string) => {
      allColors.push(am5.color(color))
      chart.get("colors")?.set("colors", allColors);
    })
    const series2 = chart.series.push(am5radar.RadarColumnSeries.new(this.root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "value",
      categoryYField: "category"
    }));
    const newData:any = [];
    this.data.forEach((d , i) => {
      newData.push({
        category : d.category,
        value : d.value,
        full : d.full,
        columnSettings : {
          fill : chart.get("colors")?.getIndex(i)
        }
      })
    })
    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      tooltipText: "{category}: {valueX}%",
      cornerRadius: 20,
      templateField: "columnSettings",
      dRadius : 5
      // fill: am5.color("#000")
    });
    series2.data.setAll(newData);

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


  ngOnDestroy(): void {
    this.root.dispose();
  }
}
