import { AfterViewInit, Component, Input, OnInit , OnDestroy, SimpleChanges, OnChanges} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageManagerService } from '@stc-apps/lng-selector';
export interface BarChartData {
  name : string;
  value : number;
}
@Component({
  selector: 'stc-apps-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit , AfterViewInit , OnDestroy, OnChanges{
  @Input() data!: BarChartData[];
  root!: am5.Root;
  math = Math;
  direction:string | null = "";
  langSub!: Subscription;
  constructor(public dom_s: DomSanitizer,private languageManagerService: LanguageManagerService){}
  @Input() colors:string[] = [];
  chartdiv_id = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.data = changes['data'].currentValue;
      this.initBarChart()
    }
  }

  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  ngAfterViewInit(): void {
    this.langSub = this.languageManagerService.getSavedLanguageAsStream().subscribe(lang => {
      this.direction = localStorage.getItem("language");
      this.initBarChart()
    })
  }
  maybeDisposeRoot(divId:string) {
    am5.array.each(am5.registry.rootElements, function (root:any) {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  };
  initBarChart() {

    this.maybeDisposeRoot(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {})
    );
    /* remove amchart logo */
    if(this.root._logo)
    {
      this.root._logo.dispose();
    }
    this.root.numberFormatter.set("numberFormat", "#.0a");
    const xRenderer = am5xy.AxisRendererX.new(this.root, {
      minGridDistance : 50,
      strokeOpacity: 0.1,
      strokeWidth: 1,
      stroke : am5.color(0x000000),
      inversed : this.direction == 'ar' ? true : false
    });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'name',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {})
      })
    );
    xRenderer.grid.template.setAll({
      location: 0.5,
    });
    xAxis.data.setAll(this.data);
    const yRenderer = am5xy.AxisRendererY.new(this.root, {
      minGridDistance : 50,
      strokeOpacity: 0.1,
      strokeWidth: 1,
      stroke : am5.color(0x000000),
      opposite : this.direction == 'ar' ? true : false
    });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation:1,
        min: 0,
        extraMax: 0.1,
        renderer: yRenderer
      })
    );

    this.root.numberFormatter.set("numberFormat", "#");

    yRenderer.grid.template.setAll({
      strokeOpacity : 0,
    });
    yRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: "1em",
      direction : this.direction == 'ar' ? "rtl" : "ltr"
    });
    xRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: "1em",
      direction : this.direction == 'ar' ? "rtl" : "ltr"
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
        fill : am5.color("#4f008c"),
      })
    );
    series.get("tooltip")?.label.set("direction" , this.direction == 'ar' ? "rtl" : "ltr");
    series.columns.template.setAll({
      tooltipY: am5.percent(10),
      templateField: 'columnSettings',
      width : am5.percent(20),
    });
    series.data.setAll(this.data);
    chart.set('cursor', am5xy.XYCursor.new(this.root, {alwaysShow:false}));
    const cursor = chart.get("cursor");
    cursor?.lineX.setAll({
      visible : false
    });
    cursor?.lineY.setAll({
      visible : false
    });
    xAxis.set("tooltip", am5.Tooltip.new(this.root, {
      forceHidden: true
    }));
    yAxis.set("tooltip", am5.Tooltip.new(this.root, {
      forceHidden: true,
    }));
    // chart.appear(1000, 100);
  }
  ngOnDestroy(): void {
    this.root.dispose();
    this.langSub.unsubscribe();
  }
}
