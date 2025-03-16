import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageManagerService } from '@stc-apps/lng-selector';
export interface BarChartData {
  name: string;
  value: number;
  color?: string;
}
@Component({
  selector: 'stc-apps-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: false,
})
export class BarChartComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() data!: BarChartData[];
  @Input() isFinancialStatus = false;
  @Input() showYaxis = false;
  root!: am5.Root;
  math = Math;
  direction: string | null = '';
  langSub!: Subscription;
  constructor(
    public dom_s: DomSanitizer,
    private languageManagerService: LanguageManagerService
  ) {}
  @Input() colors: string[] = [];
  chartdiv_id = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.data = changes['data'].currentValue;
      this.initBarChart();
    }
  }

  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  ngAfterViewInit(): void {
    this.langSub = this.languageManagerService
      .getSavedLanguageAsStream()
      .subscribe((lang) => {
        this.direction = localStorage.getItem('language');
        this.initBarChart();
      });
  }
  maybeDisposeRoot(divId: string) {
    am5.array.each(am5.registry.rootElements, function (root: any) {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  }
  initBarChart() {
    this.maybeDisposeRoot(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        layout: this.root.verticalLayout,
      })
    );
    /* remove amchart logo */
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    this.root.numberFormatter.set('numberFormat', '#.0a');
    const xRenderer = am5xy.AxisRendererX.new(this.root, {
      minGridDistance: 50,
      strokeOpacity: 0.1,
      strokeWidth: this.isFinancialStatus ? 2 : 1,
      stroke: am5.color(0x000000),
      inversed: this.direction == 'ar' ? true : false,
    });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'name',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    xRenderer.grid.template.setAll({
      location: 0.5,
    });
    if (this.isFinancialStatus) {
      xRenderer.grid.template.setAll({
        forceHidden: true,
      });
    }
    xAxis.data.setAll(this.data);
    const yRenderer = am5xy.AxisRendererY.new(this.root, {
      minGridDistance: 50,
      strokeOpacity: this.isFinancialStatus ? 0 : 0.1,
      strokeWidth: this.isFinancialStatus ? 0 : 1,
      stroke: am5.color(0x000000),
      opposite: this.direction == 'ar' ? true : false,
    });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation: 1,
        min: 0,
        extraMax: 0.3,
        renderer: yRenderer,
      })
    );

    this.root.numberFormatter.set('numberFormat', '#');

    yRenderer.grid.template.setAll({
      strokeOpacity: 0,
    });
    if (this.isFinancialStatus) {
      yRenderer.grid.template.setAll({
        forceHidden: true,
      });
    }
    if (this.isFinancialStatus) {
      yRenderer.labels.template.setAll({
        forceHidden: true,
      });
      xRenderer.labels.template.setAll({
        forceHidden: true,
      });
    }
    yRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: '1em',
      direction: this.direction == 'ar' ? 'rtl' : 'ltr',
    });
    xRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: '1em',
      direction: this.direction == 'ar' ? 'rtl' : 'ltr',
    });
    const series = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'value',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        categoryXField: 'name',
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: 'horizontal',
          labelText: '{categoryX}: {valueY} {info}',
        }),
        // fill : am5.color("#4f008c"),
      })
    );
    series.columns.template.adapters.add('fill', function (fill, target: any) {
      return target.dataItem
        ? am5.color(target.dataItem.dataContext['color'])
        : am5.color('#4f008c');
    });
    series
      .get('tooltip')
      ?.label.set('direction', this.direction == 'ar' ? 'rtl' : 'ltr');
    series.columns.template.setAll({
      tooltipY: am5.percent(10),
      templateField: 'columnSettings',
      width: am5.percent(this.isFinancialStatus ? 40 : 20), // This controls the max width of each col in percentage , relative to other cols and screen
      maxWidth: 70, // This controls the max width of each col
    });
    if (this.isFinancialStatus) {
      series.columns.template.set('strokeOpacity', 0);
      series.bullets.push(() => {
        return am5.Bullet.new(this.root, {
          locationY: 1,
          sprite: am5.Label.new(this.root, {
            text: '{valueY}',
            // fill: this.root.interfaceColors.get("alternativeText"),
            fill: am5.color('#262626'),
            centerY: am5.p100,
            centerX: am5.p50,
            dy: 5,
            populateText: true,
            fontWeight: '600',
          }),
        });
      });
      const legend = chart.children.push(
        am5.Legend.new(this.root, {
          paddingTop: 10,
          nameField: 'name',
          fillField: 'color',
          strokeField: 'color',
          centerX: am5.percent(50),
          x: am5.percent(50),
          layout:
            window.innerWidth < 1300
              ? this.root.gridLayout
              : this.root.horizontalLayout,
        })
      );
      legend.markers.template.setAll({
        width: 15,
        height: 15,
      });
      legend.labels.template.setAll({
        width: 10,
      });
      if (this.isFinancialStatus) {
        yAxis.children.unshift(
          am5.Label.new(this.root, {
            text: 'Million',
            fontSize: 13,
            width: 50,
            fontWeight: '500',
            textAlign: 'center',
            x: am5.percent(0),
            centerX: am5.percent(0),
            centerY: am5.percent(50),
            y: am5.percent(70),
            paddingTop: 0,
            paddingBottom: 0,
            rotation: -90,
          })
        );
      }
      legend.markerRectangles.template.setAll({
        cornerRadiusTL: 0,
        cornerRadiusTR: 0,
        cornerRadiusBL: 0,
        cornerRadiusBR: 0,
      });
      const newArr: any = [];
      this.data.forEach((d) => {
        newArr.push({
          name: d.name,
          color: d.color ? am5.color(d.color) : am5.color(0xfff),
        });
      });
      legend.data.setAll(newArr);
    }
    series.data.setAll(this.data);
    chart.set('cursor', am5xy.XYCursor.new(this.root, { alwaysShow: false }));
    const cursor = chart.get('cursor');
    cursor?.lineX.setAll({
      visible: false,
    });
    cursor?.lineY.setAll({
      visible: false,
    });
    xAxis.set(
      'tooltip',
      am5.Tooltip.new(this.root, {
        forceHidden: true,
      })
    );
    yAxis.set(
      'tooltip',
      am5.Tooltip.new(this.root, {
        forceHidden: true,
      })
    );
    // chart.appear(1000, 100);
  }
  truncateText(text: string) {
    return text.length > 9 ? text.substring(0, 10) + '...' : text;
  }
  ngOnDestroy(): void {
    this.root.dispose();
    this.langSub.unsubscribe();
  }
}
