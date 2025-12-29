import { Component, OnInit } from '@angular/core';
import am5index from '@amcharts/amcharts5/index';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'stc-apps-stacked-bar-chart',
  standalone: false,
  templateUrl: './stacked-bar-chart.component.html',
  styleUrl: './stacked-bar-chart.component.scss',
})
export class StackedBarChartComponent implements OnInit {
  ngOnInit() {
    this.stackedBarChart();
  }
  stackedBarChart() {
    const root = am5.Root.new('stackedBarChart');
    const myTheme = am5.Theme.new(root);
    myTheme.rule('Grid', ['base']).setAll({
      strokeOpacity: 0.1,
    });
    root.setThemes([am5themes_Animated.new(root), myTheme]);
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );
    chart
      .get('colors')
      ?.set('colors', [
        am5.color(0x22c55e),
        am5.color(0xeab308),
        am5.color(0xdc2626),
        am5.color(0x86a873),
        am5.color(0xbb9f06),
      ]);
    if (root._logo) {
      root._logo.dispose();
    }
    const data = [
      {
        name: 'DP',
        europe: 50,
        namerica: 35,
        asia: 15,
      },
      {
        name: 'Exc.',
        europe: 70,
        namerica: 20,
        asia: 10,
      },
      {
        name: 'Jaw.',
        europe: 30,
        namerica: 50,
        asia: 20,
      },
      {
        name: 'EPU',
        europe: 100,
        namerica: 0,
        asia: 0,
      },
      {
        name: 'AI',
        europe: 10,
        namerica: 20,
        asia: 70,
      },
      {
        name: 'CPU',
        europe: 10,
        namerica: 80,
        asia: 10,
      },
    ];
    const yRenderer = am5xy.AxisRendererY.new(root, {});
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'name',
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    yRenderer.grid.template.setAll({
      location: 1,
      forceHidden: true,
    });
    yAxis.data.setAll(data);
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 40,
      strokeOpacity: 0,
      forceHidden: true,
    });
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        renderer: xRenderer,
        strictMinMax: true,
        calculateTotals: true,
      })
    );
    xRenderer.grid.template.setAll({
      forceHidden: true,
    });
    xRenderer.labels.template.setAll({
      forceHidden: true,
    });
    // const legend = chart.children.push(
    //   am5.Legend.new(root, {
    //     centerX: am5.p50,
    //     x: am5.p50,
    //   })
    // );
    function makeSeries(name: string, fieldName: string) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          categoryYField: 'name',
        })
      );
      series.columns.template.adapters.add(
        'strokeOpacity',
        (strokeOpacity, target) => {
          const dataItem = target.dataItem;
          if (dataItem) {
            const context = dataItem.dataContext as any;
            // Check the raw value from your data
            if (context[fieldName] === 0) {
              return 0; // Hide the border completely
            }
          }
          return strokeOpacity;
        }
      );
      series.columns.template.setAll({
        tooltipText: '{name} : {valueX}',
        tooltipY: am5.percent(90),
        cornerRadiusTL: 10,
        cornerRadiusTR: 10,
        cornerRadiusBL: 10,
        cornerRadiusBR: 10,
      });
      series.data.setAll(data);
      series.appear();
      series.bullets.push(
        series.bullets.push(function (root, series, dataItem) {
          // 1. Get the actual value for this specific series segment
          // We cast dataContext to any to access the dynamic key (fieldName)
          const value = (dataItem.dataContext as any)[fieldName];

          // 2. Define your threshold (e.g., hide if value is less than 5)
          if (value < 5) {
            return undefined; // returning undefined prevents the bullet from being created
          }

          // 3. Create the bullet if value is large enough
          return am5.Bullet.new(root, {
            sprite: am5.Label.new(root, {
              // Tip: Use fieldName in text to show the segment size (e.g. "1")
              // instead of the cumulative stack position (e.g. "81")
              text: '{' + fieldName + '}',
              fill: root.interfaceColors.get('alternativeText'),
              centerY: am5.p50,
              centerX: am5.p50,
              populateText: true,
            }),
          });
        })
      );

      // legend.data.push(series);
    }
    Object.keys(data[0]).forEach((key) => {
      if (key !== 'name') {
        makeSeries(key, key);
      }
    });

    chart.appear(1000, 100);
  }
}
