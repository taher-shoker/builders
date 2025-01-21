import {
  AfterViewInit,
  Component,
  effect,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'stc-apps-line-chart',
  templateUrl: './lineChart.component.html',
  styleUrl: './lineChart.component.scss',
})
export class LineChartComponent implements OnInit {
  chartdiv_id = '';
  root!: am5.Root;
  chartData: InputSignal<any[]> = input([{}]);
  chartTitle: InputSignal<string> = input('');
  popUpClick: InputSignal<boolean> = input(false);
  constructor() {
    effect(() => {
      if (this.chartData().length > 0) {
        this.lineChart();
      }
    });
  }
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }

  lineChart() {
    const data = this.chartData();
    this.root = am5.Root.new(this.chartdiv_id);
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
        layout: this.root.verticalLayout,
      })
    );

    // chart.get('colors')?.set('step', 3);
    const colors = ['#4f2b85'];
    const allColors: am5.Color[] = [];
    colors.forEach((color: string) => {
      allColors.push(am5.color(color));
    });
    chart.get('colors')?.set('colors', allColors);
    const cursor = chart.set('cursor', am5xy.XYCursor.new(this.root, {}));
    cursor.lineY.set('visible', false);
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'x',
        renderer: am5xy.AxisRendererX.new(this.root, {
          minorGridEnabled: true,
          minGridDistance: 20,
        }),
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    xAxis.get('renderer').labels.template.setAll({
      rotation: window.innerWidth < 768 ? -45 : 0,
      fontSize: window.innerWidth < 768 ? 10 : 12,
      paddingTop: window.innerWidth < 768 ? 10 : 0,
      fill: am5.color('#a1a1a1'),
    });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );
    yAxis.get('renderer').labels.template.setAll({
      fill: am5.color('#a1a1a1'),
    });
    const series = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: this.chartTitle(),
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        categoryXField: 'x',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: '{valueY}',
        }),
      })
    );

    series.strokes.template.setAll({
      strokeWidth: 2,
    });

    series.get('tooltip')?.get('background')?.set('fillOpacity', 0.8);

    series.data.setAll(data);
    xAxis.data.setAll(data);
    const showBullets = () => {
      series.bullets.push(() => {
        return am5.Bullet.new(this.root, {
          sprite: am5.Circle.new(this.root, {
            radius: 5,
            fill: series.get('fill'),
            stroke: this.root.interfaceColors.get('background'),
            strokeWidth: 1,
            tooltip: am5.Tooltip.new(this.root, {}),
          }),
        });
      });
    };
    showBullets();
    series.appear(1000);
    const legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: am5.percent(90),
        marginTop: 20,
        useDefaultMarker: true,
      })
    );

    legend.data.setAll(chart.series.values);
    chart.appear(1000, 100);
    const adjustLegendPosition = () => {
      if (window.innerWidth <= 800) {
        series.bullets.clear();
      } else {
        showBullets();
      }
    };
    window.addEventListener('resize', () => {
      const screenWidth = window.innerWidth;

      const axisRenderer = xAxis.get('renderer') as am5xy.AxisRendererX;
      axisRenderer.labels.template.setAll({
        rotation: screenWidth < 768 ? -45 : 0,
        fontSize: screenWidth < 768 ? 10 : 12,
        paddingTop: screenWidth < 768 ? 10 : 0,
      });
    });
    // window.addEventListener('resize', adjustLegendPosition);
  }
}
