/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  input,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageManagerService } from '@stc-apps/lng-selector';

export interface DonutChartData {
  category: string;
  value: number;
  color?: string;
}

export type LabelLine = {
  value?: string;
  styles?: string;
  fontSize?: number;
  centerX?: number;
  centerY: number;
  html?: string; // in this property, the developer should send a HTML code, with style attribute if there's a need to style the element
};

@Component({
  selector: 'stc-apps-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  standalone: false,
})
export class DonutChartComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @Input() data: DonutChartData[] = [];
  @Input() textsColor: string = '#4f008c';
  @Input() labelsLines: LabelLine[] = [];
  @Input() trendModuleState: boolean = false;
  @Input() id!: number;
  @Input() overallNumber!: number;
  @Input() textInside!: string;
  @Input() showLegends = false;
  @Input() label = 0;

  root!: am5.Root;
  direction: string | null = '';
  langSub!: Subscription;
  constructor(
    public dom_s: DomSanitizer,
    private languageManagerService: LanguageManagerService
  ) {}
  @Input() colors: string[] = [];
  // chartdiv_id = '';
  chartdiv_id = `${Math.random()}_chart_id`;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labelsLines'] && !changes['labelsLines'].firstChange) {
      //&& !changes['data'].firstChange
      this.labelsLines = changes['labelsLines'].currentValue;
      this.initDonutChart();
    }

    if (changes['data'] && !changes['data'].firstChange) {
      //&& !changes['data'].firstChange
      this.data = changes['data'].currentValue;

      this.initDonutChart();
    }
  }

  // ngOnInit(): void {
  //   this.chartdiv_id = `${Math.random()}_chart_id`;
  // }
  ngAfterViewInit(): void {
    this.langSub = this.languageManagerService
      .getSavedLanguageAsStream()
      .subscribe((lang) => {
        this.direction = localStorage.getItem('language');
        this.initDonutChart();
      });
  }
  maybeDisposeRoot(divId: string) {
    am5.array.each(am5.registry.rootElements, function (root: any) {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  }
  initDonutChart() {
    // if(!this.chartdiv_id){
    //   return
    // }
    this.maybeDisposeRoot(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);

    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
      am5percent.PieChart.new(this.root, {
        layout: this.root.verticalLayout,
        innerRadius: this.trendModuleState ? am5.percent(80) : am5.percent(85),
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 25,
        paddingBottom: 25,
        width: this.id ? am5.p100 : am5.percent(90),
        // radius: am5.percent(70),
      })
    );

    /* remove amchart logo */
    if (this.root._logo) {
      this.root._logo.dispose();
    }

    // this.root.numberFormatter.set("numberFormat", "#.0a");

    // chart.get('colors')?.set('colors', allColors);

    const newData: {
      category: string;
      full: number;
      value: number;
      columnSettings: { fill: am5.Color | undefined };
    }[] = [];
    if (this.data) {
      this.data.forEach((d, i) => {
        newData.push({
          category: d.category,
          value: d.value,
          full: d.value + 200,
          columnSettings: {
            fill: chart.get('colors')?.getIndex(i),
          },
        });
      });
    }

    const series = chart.series.push(
      am5percent.PieSeries.new(this.root, {
        valueField: 'value',
        categoryField: 'category',
        alignLabels: false,
        radius: this.id ? 18 : this.showLegends ? 25 : 15,
      })
    );

    if (this.id || this.showLegends) {
      series.labels.template.set('forceHidden', true);
      series.ticks.template.set('forceHidden', true);
    }

    const allColors: am5.Color[] = [];

    if (this.data[0]?.category === 'No Data') {
      allColors.push(am5.color('#E0E0E0'));
      series.get('colors')?.set('colors', allColors);
    } else {
      if (this.showLegends) {
        series.slices.template.adapters.add('fill', (fill, target) => {
          const dataItem = target.dataItem;
          const dataContext = dataItem?.dataContext as DonutChartData;
          if (!dataContext) return fill;
          return am5.color(dataContext.color ? dataContext.color : '#000000');
        });
      } else {
        this.colors.forEach((color: string) => {
          allColors.push(am5.color(color));
        });
        series.get('colors')?.set('colors', allColors);
      }
    }

    series.labels.template.setAll({
      textType: 'adjusted',
      centerX: 0,
      centerY: 0,
      text: `[${this.textsColor}][500]{value}%[/]`,
      fontSize: 12,
    });
    if (!this.showLegends) {
      series.slices.template.states.create('hover', {
        scale: 1,
        shiftRadius: 0,
      });
      series.slices.template.states.create('active', {
        shiftRadius: 0,
        scale: 1,
      });

      series.slices.template.states.create('click', {
        shiftRadius: 0,
        scale: 1,
      });
    }
    if (this.showLegends) {
      series.slices.template.setAll({
        strokeWidth: 3,
        stroke: am5.color('#f3f4f6'),
      });
      series.children.push(
        am5.Label.new(this.root, {
          centerX: am5.percent(50),
          centerY: am5.percent(80),
          text: `${this.label}%`,
          populateText: true,
          fontSize: '24px',
          fontFamily: 'STCForwardFont',
          fill: am5.color('#000000'),
          fontWeight: '600',
        })
      );
      series.children.push(
        am5.Label.new(this.root, {
          centerX: am5.percent(50),
          centerY: am5.percent(10),
          text: 'Risk Free',
          populateText: true,
          fontSize: '12px',
          fontFamily: 'STCForwardFont',
          fill: am5.color('#000000'),
        })
      );
    }
    series.data.setAll(this.data);

    // Disabling labels and ticks
    // series.labels.template.set("visible", false);
    // series.ticks.template.set("visible", false);

    series.data.setAll(this.data);

    // Add labels in chart center

    if (this.labelsLines) {
      if (!this.labelsLines[0]?.html) {
        this.labelsLines.forEach((labelLine) => {
          const label = series.children.push(
            am5.Label.new(this.root, {
              text: `${labelLine.styles ? labelLine.styles : ''}${
                labelLine.value
              }`,
              fontSize: labelLine.fontSize,
              centerX: am5.percent(50),
              centerY: am5.percent(labelLine.centerY),
              // oversizedBehavior: "fit"
            })
          );
        });
      } else {
        this.labelsLines.forEach((labelLine) => {
          const label = series.children.push(
            am5.Label.new(this.root, {
              fontSize: labelLine.fontSize,
              centerX: am5.percent(50),
              centerY: am5.percent(labelLine.centerY),
              // oversizedBehavior: "fit"
              html: `${labelLine.html}`,
            })
          );
        });
      }
    }

    // this.root.numberFormatter.set("numberFormat", "#");

    if (this.data[0]?.category === 'No Data') {
      series.slices.template.setAll({
        // 2. Hide Tooltip
        tooltipText: '',

        // 3. Disable click/toggle behavior
        toggleKey: 'none',
        strokeWidth: 0,
        active: false,
      });
    }
    if (this.data[0]?.category !== 'No Data') {
      series
        .get('tooltip')
        ?.label.set('direction', this.direction == 'ar' ? 'rtl' : 'ltr');
    }
    if (this.id || this.showLegends) {
      this.root.numberFormatter.set('numberFormat', '#.#a');
      if (this.data[0]?.category !== 'No Data') {
        series.slices.template.set('tooltipText', '{category}: {value}');
      }
      // const label = series.children.push(am5.Label.new(this.root, {
      //   html: "<div style = 'font-size:1.5rem;font-weight:600;display:block'>"+ this.overallNumber +"<span style = 'color:#616161;font-size:0.9rem;font-weight:400'>SAR</span></div><div style = 'font-size:1rem;font-weight:600'>"+this.textInside+"</div>",
      //   centerX: am5.percent(50),
      //   centerY: am5.percent(50),
      //   populateText: true,
      //   oversizedBehavior: "fit"
      // }));

      if (
        this.data &&
        this.data.length > 0 &&
        this.data[0].category !== 'No Data'
      ) {
        console.log('sfsd');

        const legend = chart.children.push(
          am5.Legend.new(this.root, {
            nameField: 'categoryY',
            centerX: am5.percent(45),
            x: am5.percent(45),
            marginTop: this.showLegends ? 25 : 0,
            layout: !this.showLegends
              ? this.root.horizontalLayout
              : this.root.gridLayout,
          })
        );
        legend.labels.template.setAll({
          fill: this.showLegends ? am5.color('#000000') : am5.color('#616161'),
          fontWeight: this.showLegends ? '500' : '600',
          fontFamily: 'STCForwardFont',
        });
        legend.markers.template.setAll({
          width: 15,
          height: 15,
        });
        legend.valueLabels.template.setAll({
          forceHidden: true,
        });
        legend.markerRectangles.template.setAll({
          cornerRadiusTL: 10,
          cornerRadiusTR: 10,
          cornerRadiusBL: 10,
          cornerRadiusBR: 10,
        });
        legend.data.setAll(series.dataItems);
      }
    }

    chart.appear(1000, 100);
  }
  ngOnDestroy(): void {
    this.root.dispose();
    this.langSub.unsubscribe();
  }
}
