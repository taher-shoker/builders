import { Component, effect, input, InputSignal, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
  styleUrls: ['./lineChart.component.scss'],
})
export class LineChatChartComponent implements OnInit, OnDestroy, AfterViewInit {
  chartdiv_id = '';
  root!: am5.Root;
  chartData: InputSignal<any[]> = input([{}]);
  chartTitle: InputSignal<string> = input('');
  popUpClick: InputSignal<boolean> = input(false);
  legendSettings: InputSignal<LegendSettings | undefined> = input();
  // Control legend visibility from parent components
  showLegend: InputSignal<boolean> = input(true);
  array = ['avgDownStream'];
  private resizeHandler?: (ev: UIEvent) => void;
  private viewReady = false;
  constructor() {
    effect(() => {
      const len = this.chartData()?.length ?? 0;
      if (!this.viewReady) {
        console.log('[LineChart] view not ready yet; waiting to render');
        return;
      }
      if (len > 0) {
        this.lineChart();
      } else {
        console.log('[LineChart] skipping render: empty data');
      }
    });
  }

  ngOnInit(): void {
    this.chartdiv_id = String(Math.random()) + '_chart_id';
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    const len = this.chartData()?.length ?? 0;
    if (len > 0) {
      this.lineChart();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = undefined;
    }
    if (this.root && !this.root.isDisposed()) {
      this.root.dispose();
    }
  }

  lineChart() {
    const divReady = !!document.getElementById(this.chartdiv_id);
    if (!divReady) {
      setTimeout(() => this.lineChart(), 100);
      return;
    }
    // Dispose any existing root to allow clean re-render on data changes
    if (this.root && !this.root.isDisposed()) {
      this.root.dispose();
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
          minGridDistance: 20
        }),
        tooltip: am5.Tooltip.new(this.root, {})
      })
    );

    const rotateLabels = data.length > 10;
    xAxis.get('renderer').labels.template.setAll({
      rotation: window.innerWidth < 768 || rotateLabels ? -45 : 0,
      fontSize: window.innerWidth < 768 ? 10 : 12,
      paddingTop: window.innerWidth < 768 ? 10 : 0,
      fill: am5.color('#a1a1a1')
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(this.root, {})
      })
    );

    yAxis.get('renderer').labels.template.setAll({
      fill: am5.color('#a1a1a1')
    });

    const sample = data[0] || {};
    const valueKeys = Object.keys(sample).filter((k) => k.startsWith('value'));

    valueKeys.forEach((key, index) => {
      const nameKey = 'indicatorName' + key.replace('value', '');
      const rawName = (sample[nameKey] as string | undefined) || (sample['indicatorName'] as string | undefined);
      const indicatorName =
        typeof rawName === 'string' && rawName.trim().length > 0
          ? rawName
          : 'Series ' + (index + 1);
      const tooltipLabelText = valueKeys.length ===1
        ? '{' + key + '}'
        : indicatorName + ': {' + key + '}';
      const series = am5xy.LineSeries.new(this.root, {
        name: indicatorName,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: key,
        categoryXField: 'x'
      });
      chart.series.push(series);
      const tip = am5.Tooltip.new(this.root, {});
      // Assign label text after creation to avoid parser ambiguity in inline object literal
      tip.label.set('text', tooltipLabelText);
      series.set('tooltip', tip);

      series.strokes.template.set('strokeWidth', window.innerWidth < 768 ? 3 : 2);

      // Set tooltip background opacity defensively without complex inline chains
      try {
        const t = series.get('tooltip');
        if (t) {
          const bg = t.get('background') as any;
          if (bg) {
            bg.set('fillOpacity', 0.8);
          }
        }
      } catch (e) {
        // noop: tooltip may not exist during initial render
      }

      series.bullets.push(() => {
        const bulletContainer = am5.Container.new(this.root, {});
        const circle = am5.Circle.new(this.root, {
          radius: 5,
          fill: series.get('fill'),
          stroke: this.root.interfaceColors.get('background'),
          strokeWidth: 1
        });
        bulletContainer.children.push(circle);

        if (this.popUpClick()) {
          const label = am5.Label.new(this.root, {});
          label.set('text', '{' + key + '}');
          label.set('centerX', am5.percent(50));
          label.set('centerY', am5.percent(70));
          label.set('populateText', true);
          label.set('fontSize', 12);
          label.set('fill', am5.color('#000000'));
          bulletContainer.children.push(label);
        }

        return am5.Bullet.new(this.root, {
          sprite: bulletContainer
        });
      });

      series.data.setAll(data);
    });

    xAxis.data.setAll(data);

    let legend: am5.Legend | undefined;
    if (this.showLegend()) {
      // Position legend flush-left and full width to avoid clipping on medium screens
      legend = chart.children.push(
        am5.Legend.new(this.root, {
          centerX: am5.percent(0),
          x: am5.percent(0),
          y: settings?.y ?? am5.percent(90),
          width: am5.percent(100),
          marginTop: settings?.marginTop ?? 20,
          useDefaultMarker: true
        })
      ) as am5.Legend;

      if (settings) {
        const screenWidth = window.innerWidth;
        if (settings.layout === 'horizontal') {
          legend.set('layout', this.root.horizontalLayout);
        } else if (settings.layout === 'vertical') {
          legend.set('layout', this.root.verticalLayout);
        } else if (settings.layout === 'grid') {
          legend.set('layout', this.root.gridLayout);
        } else {
          // Responsive default: use grid layout on medium screens to prevent overflow
          if (screenWidth <= 1400) {
            legend.set('layout', this.root.gridLayout);
          } else {
            legend.set('layout', this.root.horizontalLayout);
          }
        }

        const markerTemplate = legend.markerRectangles.template;

        markerTemplate.setAll({
          width: settings.markerWidth,
          height: settings.markerHeight
        });

        markerTemplate.setAll({
          cornerRadiusTL: settings.markerCornerRadius,
          cornerRadiusTR: settings.markerCornerRadius,
          cornerRadiusBL: settings.markerCornerRadius,
          cornerRadiusBR: settings.markerCornerRadius
        });
      }

      legend.data.setAll(chart.series.values);

      const screenWidth2 = window.innerWidth;
      const labelMaxWidth = settings?.maxWidth ?? (screenWidth2 <= 1400 ? 180 : 220);
      legend.labels.template.setAll({
        fontSize: settings?.fontSize ?? (screenWidth2 < 768 ? 12 : screenWidth2 <= 1400 ? 12 : 14),
        maxWidth: labelMaxWidth,
        oversizedBehavior: 'wrap',
        textAlign: 'left',
        fontWeight:
          settings?.fontWeight ?? (screenWidth2 < 768 ? 'bold' : 'normal'),
        centerY: settings?.labelCenterY ?? undefined
      });
      // Add padding and item width so last legend item doesn't clip at right edge
      const itemWidthPercent = screenWidth2 <= 1400 ? 24 : 20;
      legend.itemContainers.template.setAll({
        paddingLeft: 8,
        paddingRight: 8,
        width: am5.percent(itemWidthPercent),
      });
    }

    chart.appear(1000, 100);

    // Replace previous resize handler to avoid calling into disposed templates
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = undefined;
    }
    this.resizeHandler = () => {
      const screenWidth = window.innerWidth;
      if (!this.root || this.root.isDisposed() || xAxis.isDisposed()) {
        return;
      }
      const axisRenderer = xAxis.get('renderer') as am5xy.AxisRendererX;
      axisRenderer.labels.template.setAll({
        rotation: screenWidth < 768 || rotateLabels ? -45 : 0,
        fontSize: screenWidth < 768 ? 8 : 10,
        paddingTop: screenWidth < 768 ? 10 : 0
      });
      // Update legend layout responsively at runtime
      if (legend && !legend.isDisposed()) {
        if (screenWidth <= 1400) {
          legend.set('layout', this.root.gridLayout);
        } else {
          legend.set('layout', this.root.horizontalLayout);
        }
        legend.labels.template.setAll({
          fontSize: screenWidth < 768 ? 12 : screenWidth <= 1400 ? 12 : 14,
          maxWidth: screenWidth <= 1400 ? 180 : 220,
        });
        const itemWidthPercent = screenWidth <= 1400 ? 24 : 20;
        legend.itemContainers.template.setAll({ width: am5.percent(itemWidthPercent) });
      }
    };
    window.addEventListener('resize', this.resizeHandler);
  }
}
