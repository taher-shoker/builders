import { AfterViewInit, Component, Input, OnInit , OnDestroy, SimpleChanges, OnChanges} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageManagerService } from '@stc-apps/lng-selector';

interface BarChartData {
  name : string;
  value : number;
}
@Component({
  selector: 'stc-apps-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnInit , AfterViewInit , OnDestroy, OnChanges{

  @Input() data!: BarChartData[];
  root!: am5.Root;
  direction:string | null = "";
  langSub!: Subscription;
  constructor(public dom_s: DomSanitizer,private languageManagerService: LanguageManagerService){}
  @Input() colors:string[] = [];
  chartdiv_id = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.data = changes['data'].currentValue;
      this.initDonutChart()
    }
  }

  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
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

    this.maybeDisposeRoot(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
    am5percent.PieChart.new(this.root, {
      layout: this.root.verticalLayout,
      innerRadius: am5.percent(70),
    }));

    /* remove amchart logo */
    if(this.root._logo)
    {
      this.root._logo.dispose();
    }

    this.root.numberFormatter.set("numberFormat", "#.0a");

    const series = chart.series.push(am5percent.PieSeries.new(this.root, {
      valueField: "value",
      categoryField: "category",
      alignLabels: false
    }));

    series.labels.template.setAll({
      textType: "circular",
      centerX: 0,
      centerY: 0
    });

    series.data.setAll([
      { value: 10, category: "One" },
      { value: 9, category: "Two" },
      { value: 6, category: "Three" },
    ]);


    this.root.numberFormatter.set("numberFormat", "#");

    series.get("tooltip")?.label.set("direction" , this.direction == 'ar' ? "rtl" : "ltr");

    chart.appear(1000, 100);
  }
  ngOnDestroy(): void {
    this.root.dispose();
    this.langSub.unsubscribe();
  }

}
