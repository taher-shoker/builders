import { Component, Input, OnInit } from '@angular/core';
import * as am5xy from '@amcharts/amcharts5/xy';
import {RadarChart , RadarCursor , AxisRendererCircular , AxisRendererRadial , RadarColumnSeries} from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5 from '@amcharts/amcharts5';
@Component({
  selector: 'stc-apps-multi-circles-chart',
  standalone: false,
  templateUrl: './multi-circles-chart.component.html',
  styleUrl: './multi-circles-chart.component.scss',
})
export class MultiCirclesChartComponent implements OnInit {
  @Input({required : true}) chartData!:{
    title:string;
    value:number;
    color:string;
  }[];
  maxWidth = 100;
  ngOnInit(): void {
    this.solidGaugeChart();
  }
  solidGaugeChart() {
    const root = am5.Root.new('solidGaugeChart');

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    const chart = root.container.children.push(
      RadarChart.new(root, {
        panX: false,
        panY: false,
        innerRadius: am5.percent(20),
        startAngle: -90,
        endAngle: 270,
        // radius:am5.percent(80)
      })
    );
    if(root._logo)
    {
      root._logo.dispose();
    }
    const data:any[] = []
    this.chartData.forEach(d => {
      data.push({
        title: d.title,
        value: d.value,
        full: this.maxWidth,
        columnSettings: {
          fill: am5.color(d.color),
        },
      })
    })
    // Data
    // const data = [
    //   {
    //     category: 'Research',
    //     value: 80,
    //     full: this.maxWidth,
    //     columnSettings: {
    //       fill: am5.color("#543"),
    //     },
    //   },
    //   {
    //     category: 'Marketing',
    //     value: 35,
    //     full: this.maxWidth,
    //     columnSettings: {
    //       fill: am5.color("#634"),
    //     },
    //   },
    //   {
    //     category: 'Distribution',
    //     value: 92,
    //     full: this.maxWidth,
    //     columnSettings: {
    //       fill: am5.color("#000"),
    //     },
    //   },
    //   {
    //     category: 'Human Resources',
    //     value: 68,
    //     full: this.maxWidth,
    //     columnSettings: {
    //       fill: am5.color("#123"),
    //     },
    //   },
    // ];

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
    const cursor = chart.set(
      'cursor',
      RadarCursor.new(root, {
        behavior: 'zoomX',
      })
    );

    cursor.lineY.set('visible', false);
    cursor.lineX.set('visible', false);

    // Create axes and their renderers
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
    const xRenderer = AxisRendererCircular.new(root, {
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
      am5xy.ValueAxis.new(root, {
        renderer: xRenderer,
        min: 0,
        max: this.maxWidth,
        strictMinMax: true,
        numberFormat: "#'%'",
        // tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yRenderer = AxisRendererRadial.new(root, {
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
      am5xy.CategoryAxis.new(root, {
        categoryField: 'title',
        renderer: yRenderer,
      })
    );

    yAxis.data.setAll(data);

    // Create series
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
    const series1 = chart.series.push(
      RadarColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        clustered: false,
        valueXField: 'full',
        categoryYField: 'title',
        fill: root.interfaceColors.get('alternativeBackground'),
      })
    );

    series1.data.setAll(data);

    const series2 = chart.series.push(
      RadarColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        clustered: false,
        valueXField: 'value',
        categoryYField: 'title',
      })
    );

    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      tooltipText: '{title}: {valueX}%',
      cornerRadius: 0,
      templateField: 'columnSettings',
    });
    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 0.08,
      strokeOpacity: 0,
      cornerRadius: 0,
    });

    series2.data.setAll(data);

    // Animate chart and series in
    // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
  }
}
