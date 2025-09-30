import { Component, effect, input, InputSignal, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export interface LegendSettings {
  layout?: 'horizontal' | 'vertical' | 'grid';
  itemSpacing?: number;
  fontSize?: number;
  fontWeight?: am5.ILabelSettings['fontWeight'];
  maxWidth?: number;
  marginTop?: number;
  markerCornerRadius?: number;
  markerWidth?: number;
  markerHeight?: number;
  labelCenterY?: am5.Percent | number;
  y?: am5.Percent;
  colors?: string[];
}

@Component({
  selector: 'stc-apps-line-chat-chart',
  templateUrl: './lineChart.component.html',
  styleUrl: './lineChart.component.scss',
})
export class LineChatChartComponent implements OnInit {
  chartdiv_id = '';
  root!: am5.Root;
  chartData: InputSignal<any[]> = input([{}]);
  chartTitle: InputSignal<string> = input('');
  popUpClick: InputSignal<boolean> = input(false);
  legendSettings: InputSignal<LegendSettings | undefined> = input();
  array = ['avgDownStream'];
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
    if (!document.getElementById(this.chartdiv_id)) {
      setTimeout(() => this.lineChart(), 100);
      return;
    }
    const data = this.chartData();
    this.root = am5.Root.new(this.chartdiv_id);
    if (this.root._logo) {
      this.root._logo.dispose();
    }

    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        pinchZoomX: false,
        layout: this.root.verticalLayout,
      })
    );

    const settings = this.legendSettings();

    const defaultColors = ['#4f2b85', '#00aaff', '#ffaa00', '#ff3366', '#33cc99'];
    const colors = settings?.colors ?? defaultColors;
    const allColors: am5.Color[] = colors.map((color) => am5.color(color));
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

    const rotateLabels = data.length > 10;
    xAxis.get('renderer').labels.template.setAll({
      rotation: window.innerWidth < 768 || rotateLabels ? -45 : 0,
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

    const sample = data[0] || {};
    const valueKeys = Object.keys(sample).filter((k) => k.startsWith('value'));

    valueKeys.forEach((key, index) => {
      // const indicatorName = sample[`indicatorName`] ?? `Series ${index + 1}`;
      const indicatorName =
        sample[`indicatorName${key.replace('value', '')}`] ??
        sample[`indicatorName`] ??
        `Series ${index + 1}`;
      const series = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          name: indicatorName,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: key,
          categoryXField: 'x',
          tooltip: am5.Tooltip.new(this.root, {
            labelText: `{${key}}`,
          }),
        })
      );

      series.strokes.template.setAll({
        strokeWidth: window.innerWidth < 768 ? 3 : 2,
      });

      series.get('tooltip')?.get('background')?.set('fillOpacity', 0.8);

      series.bullets.push(() => {
        const bulletContainer = am5.Container.new(this.root, {});
        const circle = am5.Circle.new(this.root, {
          radius: 5,
          fill: series.get('fill'),
          stroke: this.root.interfaceColors.get('background'),
          strokeWidth: 1,
        });
        bulletContainer.children.push(circle);

        if (this.popUpClick()) {
          const label = am5.Label.new(this.root, {
            text: `{${key}}`,
            centerX: am5.percent(50),
            centerY: am5.percent(70),
            populateText: true,
            fontSize: 12,
            fill: am5.color('#000000'),
          });
          bulletContainer.children.push(label);
        }

        return am5.Bullet.new(this.root, {
          sprite: bulletContainer,
        });
      });

      series.data.setAll(data);
    });

    xAxis.data.setAll(data);

    const legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: settings?.y ?? am5.percent(90),
        marginTop: settings?.marginTop ?? 20,
        useDefaultMarker: true,
      })
    );

    if (settings) {
      if (settings.layout === 'horizontal') {
        legend.set('layout', this.root.horizontalLayout);
      }

      const markerTemplate = legend.markerRectangles.template;

      markerTemplate.setAll({
        width: settings.markerWidth,
        height: settings.markerHeight,
      });

      markerTemplate.setAll({
        cornerRadiusTL: settings.markerCornerRadius,
        cornerRadiusTR: settings.markerCornerRadius,
        cornerRadiusBL: settings.markerCornerRadius,
        cornerRadiusBR: settings.markerCornerRadius,
      });
    }

    legend.data.setAll(chart.series.values);

    legend.labels.template.setAll({
      fontSize: settings?.fontSize ?? (window.innerWidth < 768 ? 12 : 14),
      maxWidth: settings?.maxWidth ?? 200,
      oversizedBehavior: 'wrap',
      fontWeight:
        settings?.fontWeight ?? (window.innerWidth < 768 ? 'bold' : 'normal'),
      centerY: settings?.labelCenterY ?? undefined,
    });

    chart.appear(1000, 100);

    window.addEventListener('resize', () => {
      const screenWidth = window.innerWidth;
      const axisRenderer = xAxis.get('renderer') as am5xy.AxisRendererX;

      axisRenderer.labels.template.setAll({
        rotation: screenWidth < 768 || rotateLabels ? -45 : 0,
        fontSize: screenWidth < 768 ? 8 : 10,
        paddingTop: screenWidth < 768 ? 10 : 0,
      });
    });
  }
}
