import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import * as am5xy from '@amcharts/amcharts5/xy'
import {RadarChart , RadarCursor , AxisRendererCircular , AxisRendererRadial , RadarColumnSeries} from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5 from '@amcharts/amcharts5';
import { DomSanitizer } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';
import { SharedService } from '../shared.service';
interface ChartData
{
  title:string;
  value1:number;
  value2:number;
  color:string;
}
@Component({
  selector: 'stc-apps-multi-circles-chart',
  standalone: false,
  templateUrl: './multi-circles-chart.component.html',
  styleUrl: './multi-circles-chart.component.scss',
})
export class MultiCirclesChartComponent implements OnChanges , OnDestroy{
  // chartdiv_id = '';
  // chartDivId:any;
  chartDivId: any;
  chartdiv_id = `${Math.random()}_chart_id`;
  chartData!:ChartData[];
  root: am5.Root | null = null;
  @Input({required : true}) chartData2:ChartData[] = [];
  // @Input() chartData2:any;
  maxWidth = 100;
  constructor(
    public dom_s: DomSanitizer,
    private financialService:SharedService
  ){}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.root) {
      this.root.dispose();
      this.root = null;
    }
    if(changes['chartData2'] && changes['chartData2'].currentValue.length !== 0)
    {
      this.solidGaugeChart();
    }
  }
  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose();
    }
  }
  solidGaugeChart() {
    // const root = am5.Root.new(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    const chart = this.root.container.children.push(
      RadarChart.new(this.root, {
        panX: false,
        panY: false,
        innerRadius: am5.percent(30),
        startAngle: -90,
        endAngle: 270,
        radius:am5.percent(80),
        layout: this.root.verticalLayout,
      })
    );
    if(this.root._logo)
    {
      this.root._logo.dispose();
    }
    const arr1:number[] = this.chartData2.map(item => item.value1);
    const arr2:number[] = this.chartData2.map(item => item.value2);
    const maxValue1 = Math.max(...arr1);
    const maxValue2 = Math.max(...arr2);
    const maxOverall = Math.max(maxValue1, maxValue2) <= 100 ? 100 : Math.max(maxValue1, maxValue2) > 100 && Math.max(maxValue1, maxValue2) <= 1000 ? Math.max(maxValue1, maxValue2) + 100 : Math.max(maxValue1, maxValue2) > 1000 && Math.max(maxValue1, maxValue2) <= 1000000 ? Math.max(maxValue1, maxValue2) + 10000 : Math.max(maxValue1, maxValue2) + 100000;
    console.log(maxOverall);
    const data:any[] = []
    this.chartData2.forEach(d => {
      data.push({
        title: d.title,
        value1: d.value1,
        value3: d.value2,
        full: this.maxWidth,
        value2: maxOverall - d.value1,
        columnSettings: {
          fill: am5.color(d.color),
        },
      })
    })
    console.log(this.chartData2);
    console.log(data);
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
    const cursor = chart.set(
      'cursor',
      RadarCursor.new(this.root, {
        behavior: 'zoomX',
      })
    );

    cursor.lineY.set('visible', false);
    cursor.lineX.set('visible', false);
    this.root.numberFormatter.set("numberFormat", "#.#a");
    // Create axes and their renderers
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
    const xRenderer = AxisRendererCircular.new(this.root, {
      //minGridDistance: 50
    });

    xRenderer.labels.template.setAll({
      radius: 10,
    });

    xRenderer.grid.template.setAll({
      forceHidden: true,
    });
    xRenderer.labels.template.setAll({
      forceHidden: true,
    });
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: xRenderer,
        min: 0,
        max: maxOverall < 100 ? 100 : maxOverall,
        // max: maxOverall,
        strictMinMax: true,
        numberFormat: "#'%'",
        // tooltip: am5.Tooltip.new(this.root, {}),
      })
    );

    const yRenderer = AxisRendererRadial.new(this.root, {
      minGridDistance: 20
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: '500',
      fontSize: 18,
      templateField: 'columnSettings',
    });

    yRenderer.grid.template.setAll({
      forceHidden: true,
    });
    yRenderer.labels.template.setAll({
      forceHidden: true,
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'title',
        renderer: yRenderer,
      })
    );

    yAxis.data.setAll(data);
    // Create series
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
    const series1 = chart.series.push(
      RadarColumnSeries.new(this.root, {
        xAxis: xAxis,
        yAxis: yAxis,
        clustered: false,
        // valueXField: 'value2',
        valueXField: 'value2',
        categoryYField: 'title',
        fill: this.root.interfaceColors.get('alternativeBackground'),
        // rotation : 331
      })
    );
    series1.data.setAll(data);
    // series1.columns.template.states.create("click", {
    //   shiftRadius: 0,
    //   scale: 2,
    // })
    const series2 = chart.series.push(
      RadarColumnSeries.new(this.root, {
        xAxis: xAxis,
        yAxis: yAxis,
        clustered: false,
        valueXField: 'value1',
        categoryYField: 'title',
      })
    );
    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      // tooltipText: '{title}: {valueX}',
      tooltipText: 'Accural: {value3} SAR',
      cornerRadius: 0,
      templateField: 'columnSettings',
    });

    // series2.columns.template.states.create("hover", {
    //   scale: 1.1  // Scale up by 10% on hover
    // });
    // series1.columns.template.states.create("hover", {
    //   scale: 1.1  // Scale up by 10% on hover
    // });

    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 1,
      fill : am5.color("#ebebeb"),
      strokeOpacity: 0,
      cornerRadius: 0,
      // tooltipText: '{title}: {value3}'
      // tooltipText: 'Spending: {value3} SAR'
      tooltipText: 'Spending: {value1} SAR'
    });
    series1.columns.template.adapters.add("rotation", function(rotation, target) {
      const data:any = target.dataItem?.dataContext;
      // console.log(data);
      if(data)
      {
        return 360 - ((data.value2 / maxOverall) * 360)
      }
      return rotation;
    });
    
    series2.data.setAll(data);
    const legend = chart.children.push(am5.Legend.new(this.root, {
      nameField: "categoryY",
      centerX: am5.percent(50),
      x: am5.percent(55),
      layout: this.root.gridLayout,
      // layout: this.root.horizontalLayout,
      tooltip: am5.Tooltip.new(this.root, {})
    }));
    legend.labels.template.setAll({
      fill : am5.color("#616161"),
      fontWeight : "600",
      oversizedBehavior : "truncate",
      maxWidth : 40
    });
    // Add tooltip to each legend item
    legend.itemContainers.template.set("tooltipText", "{name}");
    const tooltipColors:am5.Color[] = [];
    this.chartData2.forEach(d => {
      tooltipColors.push(am5.color(d.color));
    })
    console.log(legend.itemContainers);
    legend.itemContainers.template.adapters.add("tooltip", (tooltip, target, key) => {
      const index = legend.dataItems.indexOf(target.dataItem as am5.DataItem<any>);
      // const labelWidth = target?.children?.getIndex(0)?.width();
      // if (labelWidth && labelWidth > 100)
      // {
        legend.get("tooltip")?.get("background")?.setAll({
          fill: tooltipColors[index % tooltipColors.length],
          fillOpacity: 1,
          strokeWidth: 0
        });
      // } else {
      //   legend.get("tooltip")?.set("forceHidden" , true);
      // }

      return tooltip;
    });
    // For more advanced tooltips, use a function to access custom properties
    legend.itemContainers.template.setAll({
      paddingBottom: 10, // Reduces the vertical space between items
      paddingTop: 0,
      paddingRight: 0, // Adjust to reduce horizontal space between legend items
      paddingLeft: 0,
      marginRight: 0, // Additional option to control horizontal space
      marginLeft: 0
    });
    legend.markers.template.setAll({
      width: 15,
      height: 15
    });
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10
    });
    legend.data.setAll(series2.dataItems);
    // Animate chart and series in
    // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
  }
}
