import { AfterViewInit, Component } from '@angular/core';
import am5index from "@amcharts/amcharts5/index";
// import am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
@Component({
  selector: 'stc-apps-clustered-column-chart',
  standalone: false,
  templateUrl: './clustered-column-chart.component.html',
  styleUrl: './clustered-column-chart.component.scss',
})
export class ClusteredColumnChartComponent implements AfterViewInit {
  root!:am5index.Root | null;
  ngAfterViewInit(): void {
    this.clusteredColumnChart();
  }
  clusteredColumnChart()
  {
    this.root = am5.Root.new("chartdiv");
    if(this.root)
    {
      this.root.setThemes([
        am5themes_Animated.new(this.root)
      ]);
      
      
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
      
      
      // Add legend
      // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
      const legend = chart.children.push(
        am5.Legend.new(this.root, {
          centerX: am5.p50,
          x: am5.p50
        })
      );
      if(this.root)
      {
        this.root._logo?.dispose();
      }
      const data = [
        {
            "title": "AA",
            "value1": 90,
            "value2": 70,
            "color": "#B999D1"
        },
        {
            "title": "DG",
            "value1": 20,
            "value2": 40,
            "color": "#61CBD6"
        },
        {
            "title": "SA",
            "value1": 311,
            "value2": 55,
            "color": "#00C48C"
        },
        {
            "title": "SE",
            "value1": 50,
            "value2": 50,
            "color": "#4F008C"
        }
    ]
      
      
      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      const xRenderer = am5xy.AxisRendererX.new(this.root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true,
        minGridDistance : 30
      })
      
      const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
        categoryField: "title",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {})
      }));
      
      // xRenderer.grid.template.setAll({
      //   location: 1,
      //   forceHidden : true
      // })
      xAxis.get("renderer").grid.template.set("visible", false); // Hide grid lines
      xAxis.get("renderer").set("stroke", am5.color(0x000000));
      xAxis.data.setAll(data);
      const yRenderer = am5xy.AxisRendererY.new(this.root, {
        strokeOpacity: 0
      })
      const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
        renderer: yRenderer
      }));
      yRenderer.grid.template.setAll({
        forceHidden : true
      })
      yRenderer.labels.template.setAll({
        forceHidden : true
      })
      xRenderer.labels.template.setAll({
        textAlign:"center",
        marginTop : 30
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
            tooltipText: "{name}, {categoryX}:{valueY}",
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
                    fill: am5.color("#000000"),
                    centerY: am5.p100,
                    centerX: am5.p50,
                    populateText: true
                  })
                });
              } else {
                return;
              }
          });
        
          legend.data.push(series);
        }
      }
      
      makeSeries("Accrual", "value1");
      makeSeries("Spend", "value2");
      
      
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      chart.appear(1000, 100);
    }
  }
}
