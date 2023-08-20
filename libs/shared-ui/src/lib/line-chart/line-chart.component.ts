import { Component, Input, OnDestroy, OnInit , AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { Subscription } from 'rxjs';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
export interface LineChartData {
  category: string | number,
  value: number,
}
@Component({
  selector: 'stc-apps-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit , OnDestroy , AfterViewInit, OnChanges{
  @Input() chartData!: LineChartData[];
  @Input() colors:string[] = [];
  direction:string | null = "";
  root!: am5.Root;
  langSub!: Subscription;
  chartdiv_id = '';
  constructor(private languageManagerService: LanguageManagerService){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      this.chartData = changes['chartData'].currentValue;
      this.lineChart()
    }
  }

  ngOnInit(){
    this.chartdiv_id = `${Math.random()}_chart_id`;

  }
  ngAfterViewInit(): void {
    this.langSub = this.languageManagerService.getSavedLanguageAsStream().subscribe(lang => {
      this.direction = localStorage.getItem("language");
      // console.log(this.direction);
      // console.log(lang);
      // console.log("localStorage" , localStorage.getItem("language"));
      this.lineChart()
    })
  }
  maybeDisposeRoot(divId:string) {
    am5.array.each(am5.registry.rootElements, function (root:any) {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  };
  lineChart()
  {
    // console.log(this.direction);
    const data = this.chartData;
    this.maybeDisposeRoot(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);
    const chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      layout: this.root.verticalLayout,
    }));
    // const myTheme = am5.Theme.new(root);
    // myTheme.rule("Grid").setAll({
    //   stroke: am5.color('#182237'),
    //   strokeWidth: 2
    // });
    // myTheme.rule("Grid" , ['base']).setAll({
    //   stroke: am5.color('#ffffff'),
    //   strokeWidth: 2
    // });
    // root.setThemes([myTheme]);
    // Create a chart instance
    if(this.root._logo)
    {
      this.root._logo.dispose();
    }
    // chart.get("colors")?.set("step", 3);
    const allColors:am5.Color[] = [];
    this.colors.forEach((color:string) => {
      allColors.push(am5.color(color))
      chart.get("colors")?.set("colors", allColors);
    })
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(this.root, {
          categoryField: "category",
          startLocation: 0.2,
          endLocation: 0.8,
          maxDeviation: 50,
          renderer: am5xy.AxisRendererX.new(this.root, {
            minGridDistance : 50,
            strokeOpacity: 1,
            strokeWidth: 2,
            stroke : am5.color(0x000000),
            inversed : this.direction == 'ar' ? true : false
          }),
        })
      );
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation: 0.5,
        renderer: am5xy.AxisRendererY.new(this.root, {
          strokeOpacity: 1,
          strokeWidth: 2,
          stroke : am5.color(0x000000),
          marginLeft : this.direction == 'ar' ? 0 : 15,
          marginRight : this.direction == 'ar' ? 15 : 0,
          opposite : this.direction == 'ar' ? true : false
        })
      })
    );
    this.root.numberFormatter.set("numberFormat", "#.#a");

    chart.gridContainer.dispose()
    const xRenderer = xAxis.get("renderer");
    const yRenderer = yAxis.get("renderer");
    xRenderer.ticks.template.setAll({
      stroke: am5.color(0x000000),
      visible: true,
      strokeWidth : 2,
      height : 30
    });
    xRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: "1em",
      paddingTop :20,
      direction : this.direction == 'ar' ? "rtl" : "ltr"
    });

    yRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: "1em",
      direction : this.direction == 'ar' ? "rtl" : "ltr"
    });
    // let xRenderer = xAxis.get("renderer");
    // xRenderer.grid.template.setAll({
    //   stroke: am5.color('#ffffff'),
    //   strokeWidth: 0,
    //   visible : true
    // });
    // xAxis.get("dateFormats")["day"] = "MMM";
    const series = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "category",
        sequencedInterpolation : true,
        categoryXField: "category",
        categoryYField : "value",
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: 'vertical',
          labelText: '{categoryX}: {valueY} {info}',
        }),
      })
    );
    series.get("tooltip")?.label.set("direction" , this.direction == 'ar' ? "rtl" : "ltr");


    // series.get("tooltip")?.setAll({
    //   reverseChildren : true
    // })
      const arr:{category:string | number}[] = []
      this.chartData.forEach((data2) => {
        arr.push({category : data2.category});
      })
      xAxis.data.setAll(arr)
      series.data.setAll(arr)
    series.data.setAll(data);
    series.bullets.push(() => {
      const circle = am5.Circle.new(this.root, {
        radius: 6,
        fill: am5.color(this.colors[1]),
        stroke: this.root.interfaceColors.get("background"),
        strokeWidth: 0,
      });

      return am5.Bullet.new(this.root, {
        sprite: circle
      });
    });

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
    series.strokes.template.setAll({
      strokeWidth: 2
    });
    // root.dateFormatter.setAll({
    //   dateFormat: "yyyy",
    //   dateFields: ["valueX"]
    // });
    // Set data

    series.appear(1000);
    chart.appear(1000, 100);
  }
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
    this.root.dispose();
  }
}
