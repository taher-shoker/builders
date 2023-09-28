/* eslint-disable @typescript-eslint/no-inferrable-types */
import { AfterViewInit, Component, Input, OnInit , OnDestroy, SimpleChanges, OnChanges} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageManagerService } from '@stc-apps/lng-selector';

export interface DonutChartData {
  category : string;
  value : number;
}

export type LabelLine = {
  value?: string,
  styles? : string,
  fontSize?: number,
  centerX?: number,
  centerY: number,
  html?: string // in this property, the developer should send a HTML code, with style attribute if there's a need to style the element
}



@Component({
  selector: 'stc-apps-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements AfterViewInit , OnDestroy, OnChanges{

  @Input() data!: DonutChartData[];
  @Input() textsColor: string = "#4f008c";
  @Input() labelsLines: LabelLine[] = [];
  @Input() trendModuleState: boolean = false;

  @Input() changesHappend: boolean = false;

  root!: am5.Root;
  direction:string | null = "";
  langSub!: Subscription;
  constructor(public dom_s: DomSanitizer,private languageManagerService: LanguageManagerService){}
  @Input() colors:string[] = [];
  // chartdiv_id = '';
  chartdiv_id = `${Math.random()}_chart_id`;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labelsLines'] && !changes['labelsLines'].firstChange) { //&& !changes['data'].firstChange
      this.labelsLines = changes['labelsLines'].currentValue;
      this.initDonutChart()
    }

    if (changes['data'] && !changes['data'].firstChange) { //&& !changes['data'].firstChange
      this.data = changes['data'].currentValue;
      this.initDonutChart()
    }
  }

  // ngOnInit(): void {
  //   this.chartdiv_id = `${Math.random()}_chart_id`;
  // }
  ngAfterViewInit(): void {
    this.langSub = this.languageManagerService.getSavedLanguageAsStream().subscribe(lang => {
      this.direction = localStorage.getItem("language");
      this.initDonutChart()
    })
  }
  maybeDisposeRoot(divId:string) {
    am5.array.each(am5.registry.rootElements, function (root:any) {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  };
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
      innerRadius: this.trendModuleState ? am5.percent(80) : am5.percent(70),
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 25,
      paddingBottom: 25,
      width: am5.percent(90),
      // radius: am5.percent(70),
    }));

    /* remove amchart logo */
    if(this.root._logo)
    {
      this.root._logo.dispose();
    }

    // this.root.numberFormatter.set("numberFormat", "#.0a");

    // chart.get('colors')?.set('colors', allColors);

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

    const series = chart.series.push(am5percent.PieSeries.new(this.root, {
      valueField: "value",
      categoryField: "category",
      alignLabels: false
    }));



    const allColors: am5.Color[] = [];
    this.colors.forEach((color: string) => {
      allColors.push(am5.color(color));
    });
    series.get("colors")?.set('colors',allColors)


    series.labels.template.setAll({
      textType: "adjusted",
      centerX: 0,
      centerY: 0,
      text: `[${this.textsColor}][500]{value}%[/]`,
    });

    // Disabling labels and ticks
    // series.labels.template.set("visible", false);
    // series.ticks.template.set("visible", false);

    series.data.setAll(this.data);

    // Add labels in chart center

    if(this.labelsLines){

      if(!this.labelsLines[0].html){

        this.labelsLines.forEach((labelLine) => {
          const label = series.children.push(am5.Label.new(this.root, {
            text: `${labelLine.styles ? labelLine.styles : ""}${labelLine.value}`,
            fontSize: labelLine.fontSize,
            centerX: am5.percent(50),
            centerY: am5.percent(labelLine.centerY),
            // oversizedBehavior: "fit"
          }));
        })
      }else{
        this.labelsLines.forEach((labelLine) => {
          const label = series.children.push(am5.Label.new(this.root, {
            fontSize: labelLine.fontSize,
            centerX: am5.percent(50),
            centerY: am5.percent(labelLine.centerY),
            // oversizedBehavior: "fit"
            html: `${labelLine.html}`

          }));
        })
      }
    }

    // this.root.numberFormatter.set("numberFormat", "#");

    series.get("tooltip")?.label.set("direction" , this.direction == 'ar' ? "rtl" : "ltr");


    chart.appear(1000, 100);
  }
  ngOnDestroy(): void {
    this.root.dispose();
    this.langSub.unsubscribe();
  }

}
