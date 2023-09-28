/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ElementRef, Input, OnInit, OnDestroy, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5xy from '@amcharts/amcharts5/xy';

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Subscription } from 'rxjs';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { LabelLine } from '../donut-chart/donut-chart.component';
import { DomSanitizer } from '@angular/platform-browser';

export interface ProgressCircleData {
  category: string;
  value: number;
  // full: number,
}

@Component({
  selector: 'stc-apps-progress-circle-chart',
  templateUrl: './progress-circle-chart.component.html',
  styleUrls: ['./progress-circle-chart.component.scss'],
})
export class ProgressCircleChartComponent implements OnInit, OnDestroy , AfterViewInit, OnChanges{
  @Input({ required: true }) data!: ProgressCircleData[];
  @Input() colors: string[] = [];
  @Input() totalCases: number = 0;
  @Input() maxRange! : number;
  @Input() labelsLines: LabelLine[] = [];
  @Input() showCategoryOnly: boolean = false;

  @Input() topPosition!: number;
  @Input() hideLegend: boolean = false;
  @Input() customHeight!: number;
  @Input() customWidth!: number;


  langSub!: Subscription;
  direction:string | null = '';
  root!: am5.Root;
  chartdiv_id = '';
  constructor(
    private elRef: ElementRef,
    private languageManagerService: LanguageManagerService,
    // public dom_s: DomSanitizer,

    ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.data = changes['data'].currentValue;
      this.displayProgressCircleChart()
    }
  }

  ngAfterViewInit(): void {
    this.langSub = this.languageManagerService.getSavedLanguageAsStream().subscribe(lang => {
      this.direction = localStorage.getItem("language");
      this.displayProgressCircleChart();
    })
  }
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  maybeDisposeRoot(divId:string) {
    am5.array.each(am5.registry.rootElements, function (root:any) {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  };
  displayProgressCircleChart() {
    this.maybeDisposeRoot(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    this.root._logo?.dispose();

    const chart = this.root.container.children.push(
      am5radar.RadarChart.new(this.root, {
        panX: false,
        panY: false,
        // wheelX: "panX",
        // wheelY: "zoomX",
        innerRadius: this.data.length < 6 ? am5.percent(30) : am5.percent(19),
        // centerX:am5.percent(10),
        // centerY:am5.percent(40),
        radius: am5.percent(100),
        startAngle: this.direction == 'en' ? -90 : -90,
        endAngle: this.direction == 'en' ? 180 : 180,
      })
    );
    // Data
    const data = this.data;
    // const cursor = chart.set("cursor", am5radar.RadarCursor.new(this.root, {}));

    // Remove those 2 lines to shows the dashes lines on hovering!
    // cursor.lineY.set("visible", false);
    // cursor.lineX.set("visible", false);

    // Create axes and their renderers
    const xRenderer = am5radar.AxisRendererCircular.new(this.root, {
      minGridDistance: 50,
      // inversed : true
    });

    // Increasing the radius will push the *outside* of the circle farther
    xRenderer.labels.template.setAll({
      radius: 10,
      visible: false,
    });

    // Remove this line if you want to show the dashed lines of the circle in the under-background!
    xRenderer.grid.template.setAll({
      forceHidden: true,
    });
    const numbers:number[] = [];
    let sum = 0;
    this.data.forEach(el => {
      numbers.push(el.value)
      sum += el.value;
    })
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: xRenderer,
        min: 0,
        max: this.maxRange ? this.maxRange : sum, // Pass max as 100 , as an input to maximize the circle to 100
        strictMinMax: true,
        numberFormat: "#'%'",
        tooltip: am5.Tooltip.new(this.root, {}),
        // templateField: 'category',
      })
    );

    const yRenderer = am5radar.AxisRendererRadial.new(this.root, {
      minGridDistance: 20,
      templateField: 'category',
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: '500',
      fontSize: 15,
      templateField: 'columnSettings',
      radius: 5,
      text : this.showCategoryOnly ? "[#888]{category}" : "[bold][fontSize: 20px]{value}[/]    [#888]{category}",
    });


    yRenderer.grid.template.setAll({
      forceHidden: true,
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'category',
        renderer: yRenderer,
      })
    );

    // create label in the center of the chart


    if(this.labelsLines){
      this.labelsLines.forEach((labelLine) => {
        chart.children.unshift(
          am5.Label.new(this.root, {
            // text: ``,
            fontSize: labelLine.fontSize,
            fontWeight: '500',
            textAlign: 'center',
            y: am5.percent(40) , //am5.percent(40),
            x: am5.percent(50),
            centerX: am5.percent(50) ,
            centerY: am5.percent(labelLine.centerY!),
            paddingBottom: 20,
            fill: am5.color('#8e9aa0'),
            marginBottom: 20,
            // html: this.dom_s.bypassSecurityTrustHtml() `<i class="fas fa-arrow-alt-circle-down"></i>${labelLine.styles ? labelLine.styles : ""}${labelLine.value}`
            html: `${labelLine.html}`
          })
        );
      })
    }else{
      chart.children.unshift(
        am5.Label.new(this.root, {
          text: 'All cases',
          fontSize: 25,
          fontWeight: '500',
          textAlign: 'center',
          y: this.data.length < 6 ? am5.percent(42) : am5.percent(45) , //am5.percent(40),
          x: am5.percent(50),
          centerX: am5.percent(50) ,
          centerY: am5.percent(5),
          paddingBottom: 20,
          fill: am5.color('#8e9aa0'),
          marginBottom: 20,
        })
      );

      chart.children.unshift(
        am5.Label.new(this.root, {
          text: `${sum}`,
          fontSize: 25,
          fontWeight: 'bold',
          textAlign: 'center',
          y: am5.percent(48),
          x: am5.percent(50),
          centerX: am5.percent(50),
          paddingTop: 20,
          paddingBottom: 20,
          marginTop: 20,

        })
      );

    }

    const allColors: am5.Color[] = [];
    this.colors.forEach((color: string) => {
      allColors.push(am5.color(color));
    });
    chart.get('colors')?.set('colors', allColors);
    const newData: {
      category: string;
      full:number;
      value: number;
      columnSettings: { fill: am5.Color | undefined };
    }[] = [];
    this.data.forEach((d, i) => {
      newData.push({
        category: d.category,
        value: d.value,
        full : d.value + 200,
        columnSettings: {
          fill: chart.get('colors')?.getIndex(i),
        },
      });
    });
    // Create series
    const createSeries = (categoryField: string, valueX: string , fillOpacity:number) => {
      const series = chart.series.push(
        am5radar.RadarColumnSeries.new(this.root, {
          xAxis: xAxis,
          yAxis: yAxis,
          clustered: false,
          valueXField: valueX,
          categoryYField: categoryField,
          categoryXField: categoryField,
          fill: this.root.interfaceColors.get('alternativeBackground'),
        })
      );
      series.columns.template.setAll({
        width: am5.p100, //
        fillOpacity: fillOpacity,
        strokeOpacity: 0,
        cornerRadius: 20,
        dRadius: 5,
        tooltipHTML: '<div class = "tooltip-text">{category}: {value}</div>',
        templateField: 'columnSettings',
        fill : am5.color("#000")
      });

      const cellSize = 30;

      series.events.on("datavalidated", (ev) => {
        const series2 = ev.target;
        const chart:any = series2.chart;
        const xAxis:any = chart?.xAxes.getIndex(0);
        // Calculate how we need to adjust chart height
        const chartHeight = series.data.length * cellSize + xAxis.height() + chart.get("paddingTop", 0) + chart.get("paddingBottom", 0);

        console.log("height is :",chartHeight);
        chart.root.dom.style.height = (chartHeight * 3) + "px";

        // Set it on chart's container
        if(!this.customHeight){

          if(this.data.length < 2){

            chart.root.dom.style.height = (chartHeight * 7) + "px";
          }else if(this.data.length < 3){
            chart.root.dom.style.height = (chartHeight * 5) + "px";
          }else{
            chart.root.dom.style.height = (chartHeight * 3) + "px";
          }
        }else{
          chart.root.dom.style.height = `${this.customHeight}px`;
          chart.root.dom.style.top = `${this.topPosition}%`;
          chart.root.dom.style.position = `relative`;


        }

        if(this.customWidth){
          chart.root.dom.style.width = `${this.customWidth}px`;
          chart.root.dom.style.margin = `auto`;
        }
      });
      return series;
    };
    const series1 = createSeries('category', 'full' , 0.05);
    const series2 = createSeries('category', 'value' , 1);
    // set data to series
    series2.data.setAll(newData);
    series1.data.setAll(newData);

    // add legend to chart
    if(!this.hideLegend){

      const legend = chart.children.push(
        am5.Legend.new(this.root, {
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          x: am5.percent(50),
          y: this.data.length < 6 ? am5.percent(105) : am5.percent(100),
          // layout: this.root.horizontalLayout,
          reverseChildren: this.direction == 'ar' ? true : false,
          nameField: 'categoryX',
          templateField: 'category',
          layout: am5.GridLayout.new(this.root, {
            maxColumns: 9,
            fixedWidthGrid: true
          })
        }),
      );
      legend.itemContainers.template.setAll({
        reverseChildren : this.direction == 'ar' ? true : false,
        height:40
      })
      legend.data.setAll(series2.dataItems);
      legend.valueLabels.template.setAll({
        fill: am5.color('#000000'),
      });
      legend.labels.template.setAll({
        // maxWidth: 140,
        // width: 140,
        height : 24,
        oversizedBehavior:"wrap",
        visible: true,
        reverseChildren : this.direction == 'ar' ? true : false,
        direction : this.direction == 'ar' ? "rtl" : "ltr",
        marginBottom: 60
      });
      legend.markerRectangles.template.setAll({
        cornerRadiusTL: 10,
        cornerRadiusTR: 10,
        cornerRadiusBL: 10,
        cornerRadiusBR: 10,
        width: 15,
        height: 15,
        dx : this.direction == 'ar' ? 10 : 0
      });
    }


    // yAxis.data.setAll(newData);
    yAxis.data.setAll(data);
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
    series2.get("tooltip")?.label.setAll({
      direction : this.direction == 'ar' ? "rtl" : "ltr",
    });
  }

  ngOnDestroy(): void {
    this.root.dispose();
    this.langSub.unsubscribe();
  }
}
