import { Component, OnInit } from '@angular/core';
import am5index from '@amcharts/amcharts5/index';
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5 from '@amcharts/amcharts5';
@Component({
  selector: 'stc-apps-double-line-chart',
  standalone: false,
  templateUrl: './double-line-chart.component.html',
  styleUrl: './double-line-chart.component.scss',
})
export class DoubleLineChartComponent implements OnInit {
  ngOnInit(): void {
    this.doubleLineChart();
  }
  doubleLineChart() {
    const root = am5.Root.new('doubleLineChart');

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      })
    );

    chart.get('colors')?.set('step', 3);

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        
        // baseInterval: {
        //   timeUnit: 'day',
        //   count: 1,
        // },
        renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Series 1',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value1',
        valueXField: 'date',
        // tooltip: am5.Tooltip.new(root, {
        //   labelText: '{valueX}: {valueY}\n{previousDate}: {value2}',
        // }),
      })
    );

    series.strokes.template.setAll({
      strokeWidth: 2,
    });

    series.get('tooltip')?.get('background')?.set('fillOpacity', 0.5);

    const series2 = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Series 2',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value2',
        valueXField: 'date',
      })
    );
    series2.strokes.template.setAll({
      strokeDasharray: [2, 2],
      strokeWidth: 2,
    });

    if(root._logo)
    {
      root._logo.dispose();
    }
    // Set date fields
    // https://www.amcharts.com/docs/v5/concepts/data/#Parsing_dates
    // root.dateFormatter.setAll({
    //   dateFormat: 'yyyy-MM-dd',
    //   dateFields: ['valueX'],
    // });

    // Set data
    const data = [
      {
        date: "Jan",
        value1: 50,
        value2: 48,
      },
      {
        date: "Feb",
        value1: 53,
        value2: 51,
      },
      {
        date: "Mar",
        value1: 56,
        value2: 58,
      },
      {
        date: "Apr",
        value1: 52,
        value2: 53,
      },
      {
        date: "May",
        value1: 48,
        value2: 44,
      },
      {
        date: "Jun",
        value1: 47,
        value2: 42,
      },
      {
        date: "Jul",
        value1: 59,
        value2: 55,
      },
      {
        date: "Aug",
        value1: 23,
        value2: 51,
      },
      {
        date: "Sep",
        value1: 59,
        value2: 55,
      },
      {
        date: "Oct",
        value1: 59,
        value2: 55,
      },
      {
        date: "Nov",
        value1: 59,
        value2: 55,
      },
      {
        date: "Dec",
        value1: 59,
        value2: 35,
      },
    ];
    console.log(data);
    series.data.setAll(data);
    series2.data.setAll(data);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
  }
}
