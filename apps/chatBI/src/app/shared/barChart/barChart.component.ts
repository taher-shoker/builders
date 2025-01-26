import {
  Component,
  effect,
  input,
  Input,
  InputSignal,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'stc-apps-bar-chart',
  templateUrl: './barChart.component.html',
  styleUrl: './barChart.component.scss',
})
export class BarChartComponent implements OnInit {
  root!: am5.Root;
  chartdiv_id = '';
  chartData: InputSignal<any[]> = input([{}]);
  chartTitle: InputSignal<string> = input('');
  indicators: InputSignal<any[]> = input([{}]);
  barChartColors = ['#4f2b85', '#0dcaf0', '#dda0dd', '#f0f465', '#9cec5b'];
  popUpClick: InputSignal<boolean> = input(false);
  @Input() colors: string[] = [];
  @Input() unit = '';

  constructor() {
    effect(() => {
      if (this.chartData().length > 0 && this.indicators()) {
        console.log(this.chartData(), this.indicators());
        this.barChart();
      }
    });
  }
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }

  barChart() {
    if (this.root) {
      this.root.dispose();
    }
    this.root = am5.Root.new(this.chartdiv_id);

    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: 'none',
        wheelY: 'none',
        pinchZoomX: false,
        layout: this.root.verticalLayout,
      })
    );
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    const legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );
    console.log(this.chartData(), this.indicators());
    const data = this.chartData();

    const xRenderer = am5xy.AxisRendererX.new(this.root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
      minGridDistance: 20,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'xaxis',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );

    xRenderer.grid.template.setAll({
      location: 1,
    });
    xAxis.get('renderer').labels.template.setAll({
      rotation: window.innerWidth < 768 ? -45 : 0,
      fontSize: window.innerWidth < 768 ? 10 : 12,
      paddingTop: window.innerWidth < 768 ? 10 : 0,
      fill: am5.color('#a1a1a1'),
    });

    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {
          strokeOpacity: 0.1,
        }),
      })
    );
    yAxis.get('renderer').labels.template.setAll({
      fill: am5.color('#a1a1a1'), // Change color for Y-axis labels (e.g., green color)
    });

    const makeSeries = (
      name: string,
      fieldName: string,
      color: string,
      unit: string
    ) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(this.root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: 'xaxis',
        })
      );

      series.columns.template.setAll({
        tooltipText: `{categoryX}:{valueY} ${unit}`,
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
      });
      if (this.popUpClick()) {
        series.columns.template.setAll({
          showTooltipOn: 'always',
        });
        series.columns.template.setup = (target) => {
          target.set('tooltip', am5.Tooltip.new(this.root, {}));
        };
        series.columns.template.setAll({
          width: 60,
        });
        chart.set('width', 1024);
      }

      series.data.setAll(data);

      series.appear();

      series.bullets.push(() => {
        return am5.Bullet.new(this.root, {
          locationY: 0,
          sprite: am5.Label.new(this.root, {
            text: '{valueY}',
            fill: this.root.interfaceColors.get('alternativeText'),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });
      series.set('fill', am5.color(color));
      legend.data.push(series);
      const legendFontSize = window.innerWidth < 768 ? 12 : 14;
      const legendFontWeight = window.innerWidth < 768 ? 'bold' : 'normal';
      legend.labels.template.setAll({
        fontSize: legendFontSize,
        maxWidth: window.innerWidth < 768 ? 200 : 200,
        oversizedBehavior: 'wrap',
        fontWeight: legendFontWeight,
      });
    };
    this.indicators()?.map((indicator, index) => {
      makeSeries(
        indicator.indicatorName + ' (' + indicator.unit + ')',
        indicator.indicatorName?.replace(/\s+/g, ''),
        this.barChartColors[index],
        indicator.unit
      );
    });

    // makeSeries('Users', 'activeUsers', '#FFFFFF');
    // makeSeries('State Date', 'stateDate', '#FFFFFF');

    chart.appear(1000, 100);
    window.addEventListener('resize', () => {
      const screenWidth = window.innerWidth;

      // Update the axis label rotation and font size dynamically
      const axisRenderer = xAxis.get('renderer') as am5xy.AxisRendererX;
      axisRenderer.labels.template.setAll({
        rotation: screenWidth < 768 ? -45 : 0, // Rotate for mobile view
        fontSize: screenWidth < 768 ? 10 : 12, // Smaller font size for mobile
        paddingTop: screenWidth < 768 ? 10 : 0, // Add padding for mobile to avoid overlap
      });
    });
  }
}
