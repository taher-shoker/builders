import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import am5index from "@amcharts/amcharts5/index";
// import am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
interface ChartData {
  title: string;
  value1: number;
  value2?: number;
}
@Component({
  selector: 'stc-apps-clustered-column-chart',
  standalone: false,
  templateUrl: './clustered-column-chart.component.html',
  styleUrl: './clustered-column-chart.component.scss',
})
export class ClusteredColumnChartComponent implements OnInit , AfterViewInit , OnChanges , OnDestroy {
  root!:am5index.Root | null;
  @ViewChild('chartDiv') chartDiv!:ElementRef;
  @Input({ required: true }) chartData: ChartData[] = [];
  @Input() showLabel = false;
  chartdiv_id = ''
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  ngAfterViewInit(): void {
    if (this.root) {
      this.root.dispose();
      this.root = null;
    }
    if (
      this.chartData &&
      this.chartData.length !== 0
    ) {
      this.clusteredColumnChart();
    }
  }
  ngOnChanges(changes:SimpleChanges): void {
    if (this.root) {
      this.root.dispose();
      this.root = null;
    }
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      // this.root = am5.Root.new('multiCircleChart');
      this.clusteredColumnChart();
    }
  }
  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose();
      this.root = null;
    }
  }
  clusteredColumnChart()
  {
    console.log(this.chartData);
    this.root = am5.Root.new(this.chartdiv_id);
    if(this.root)
    {
      this.root.setThemes([
        am5themes_Animated.new(this.root)
      ]);
      this.root.numberFormatter.set("numberFormat", "#.#a");
      
      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      const chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        // wheelX: "panX",
        // wheelY: "zoomX",
        layout: this.root.verticalLayout
      }));
      
      chart.get("colors")?.set("colors", [
        am5.color(0x4F008C),
        am5.color(0x00B050),
        am5.color(0x5aaa95),
        am5.color(0x86a873),
        am5.color(0xbb9f06)
      ]);
      // Add legend
      // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
      const legend = chart.children.push(
        am5.Legend.new(this.root, {
          centerX: am5.p50,
          x: am5.p50,
          paddingTop : 10,
          clickTarget : "none"
        })
      );
      legend.markers.template.setAll({
        width: 15,
        height: 15,
      });
      legend.markerRectangles.template.setAll({
        cornerRadiusTL: 0,
        cornerRadiusTR: 0,
        cornerRadiusBL: 0,
        cornerRadiusBR: 0,
      });
      if(this.root)
      {
        this.root._logo?.dispose();
      }
      const data = this.chartData;
      chart.zoomOutButton.set("forceHidden" , true);
      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      const xRenderer = am5xy.AxisRendererX.new(this.root, {
        // cellStartLocation : 0,
        // cellEndLocation : 0.4,
        minorGridEnabled: false,
        minGridDistance : 30,
        strokeOpacity: 1,
        strokeWidth: 2,
        stroke: am5.color(0xdddddd)
      })
      
      const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
        categoryField: "title",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {})
      }));
      xAxis.get("renderer").setAll({
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: false
      })
      // xRenderer.grid.template.setAll({
      //   location: 1,
      //   forceHidden : true
      // })
      xAxis.get("renderer").grid.template.set("visible", false); // Hide grid lines
      xAxis.data.setAll(data);
      const yRenderer = am5xy.AxisRendererY.new(this.root, {
        strokeOpacity: 0,
        // minGridDistance : 200
      })
      const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
        renderer: yRenderer,
        extraMax: 0.1,
        min : 0
      }));
      yRenderer.labels.template.setAll({
        forceHidden : true
      })
      yRenderer.grid.template.setAll({
        forceHidden : true
      })
      if(this.showLabel)
      {
        yAxis.children.unshift(am5.Label.new(this.root, {
          text: "Million",
          fontSize: 13,
          width : 50,
          fontWeight: "500",
          textAlign: "center",
          x: am5.percent(0),
          centerX: am5.percent(0),
          centerY: am5.percent(50),
          y: am5.percent(70),
          paddingTop: 0,
          paddingBottom: 0,
          rotation : -90
        }));
      }
      // yAxis.get("renderer").labels.template.set("text", "[valueY] Million");
      xRenderer.labels.template.setAll({
        textAlign:"center",
        fill : am5.color("#262626"),
        maxWidth : 70,
        oversizedBehavior : "truncate",
        fontWeight : "600",
        paddingTop : 10
      })
      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      const makeSeries = (name:string, fieldName:string) => {
        if(this.root)
        {
          const series = chart.series.push(am5xy.ColumnSeries.new(this.root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: "title"
          }));
          series.columns.template.setAll({
            tooltipText: "{name} in {categoryX} : {valueY}",
            // tooltipText: "{name} : {valueY}",
            width: am5.percent(80),
            tooltipY: 0,
            strokeOpacity: 0
          });
          series.data.setAll(data);
        
          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          series.appear();
          series.bullets.push(() => {
            if(this.root)
              {
                return am5.Bullet.new(this.root, {
                  locationY: 1,
                  sprite: am5.Label.new(this.root, {
                    text: "{valueY}",
                    // fill: this.root.interfaceColors.get("alternativeText"),
                    fill: am5.color("#262626"),
                    centerY: am5.p100,
                    centerX: am5.p50,
                    dy : 5,
                    populateText: true,
                    fontWeight : "600",
                    // fontSize : "1rem"
                    // maxWidth : 60,
                    // oversizedBehavior : "truncate"
                  })
                });
              } else {
                return;
              }
          });
        
          legend.data.push(series);
        }
      }
      
      makeSeries("Accrual", "value2");
      makeSeries("Spent", "value1");

      
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      chart.appear(1000, 100);
    }
  }
}
