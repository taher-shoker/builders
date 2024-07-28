import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { Subscription } from 'rxjs';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export interface LineChartData {
  category: Date | string;
  value: string | number;
}

export interface LineSeriesData {
  name: string;
  data: LineChartData[];
}

@Component({
  selector: 'stc-apps-custom-line-chart',
  templateUrl: './custom-line-chart.component.html',
  styleUrls: ['./custom-line-chart.component.scss'],
})
export class CustomLineChartComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @Input() multiChartData!: { name: string; data: LineChartData[] }[];
  @Input() targetData!: LineChartData[];
  @Input() target2Data!: LineChartData[];
  @Input() colors: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Input() bulletCirclesColor: string = '#ff6a39';
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Input() trendModuleState: boolean = false;

  direction: string | null = '';
  root!: am5.Root;
  langSub!: Subscription;
  chartdiv_id = '';
  constructor(private languageManagerService: LanguageManagerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['multiChartData'] && !changes['multiChartData'].firstChange) {
      this.multiChartData = changes['multiChartData'].currentValue;
      this.lineChart();
    }

    if (changes['targetData'] && !changes['targetData'].firstChange) {
      this.targetData = changes['targetData'].currentValue;
      this.lineChart();
    }

    if (changes['target2Data'] && !changes['target2Data'].firstChange) {
      this.target2Data = changes['target2Data'].currentValue;
      this.lineChart();
    }
  }

  ngOnInit() {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  ngAfterViewInit(): void {
    this.langSub = this.languageManagerService
      .getSavedLanguageAsStream()
      .subscribe((lang) => {
        this.direction = localStorage.getItem('language');
        this.lineChart();
      });
  }
  maybeDisposeRoot(divId: string) {
    am5.array.each(am5.registry.rootElements, (root: any) => {
      if (root?.dom.id == divId) {
        root.dispose();
      }
    });
  }

  lineChart() {
    this.maybeDisposeRoot(this.chartdiv_id);
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: this.root.verticalLayout,
      })
    );

    this.root.dateFormatter.setAll({
      dateFormat: 'yyyy-MM-dd',
      dateFields: ['category'],
    });

    if (this.root._logo) {
      this.root._logo.dispose();
    }

    const allColors: am5.Color[] = [];
    this.colors.forEach((color: string) => {
      allColors.push(am5.color(color));
    });
    chart.get('colors')?.set('colors', allColors);

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        maxDeviation: 0.5,
        groupData: false,
        baseInterval: {
          timeUnit: 'year',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(this.root, {
          minGridDistance: 20,
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: am5.color('#8e9aa0'),
          inversed: this.direction == 'ar' ? true : false,
        }),
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    // this.root.numberFormatter.set('numberFormat', '#');

    // chart.gridContainer.dispose();

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        min: 0,
        max: 100,
        maxDeviation: 0.1,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(this.root, {}),
        tooltip: am5.Tooltip.new(this.root, {
          labelText: '{valueY}',
        }),
      })
    );

    // const xRenderer = xAxis.get('renderer');
    // const yRenderer = yAxis.get('renderer');
    // xRenderer.ticks.template.setAll({
    //   stroke: am5.color('#8e9aa0'),
    //   visible: true,
    //   strokeWidth: 1,
    //   height: 30,
    // });
    // xRenderer.labels.template.setAll({
    //   fill: am5.color(0x000000),
    //   fontSize: '1em',
    //   paddingTop: 20,
    //   direction: this.direction == 'ar' ? 'rtl' : 'ltr',
    // });

    // yRenderer.labels.template.setAll({
    //   fill: am5.color(0x000000),
    //   fontSize: '1em',
    //   direction: this.direction == 'ar' ? 'rtl' : 'ltr',
    // });

    const makeSeries = (name: string, data: LineChartData[], color: string) => {
      const series = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          name: name,
          minBulletDistance: 10,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'value',
          valueXField: 'category',
          tooltip: am5.Tooltip.new(this.root, {
            pointerOrientation: 'horizontal',
            labelText: '{valueY}',
          }),
        })
      );

      series.data.processor = am5.DataProcessor.new(this.root, {
        dateFormat: 'yyyy-MM-dd',
        dateFields: ['category'],
      });

      series.data.setAll(data);

      series.strokes.template.setAll({
        strokeWidth: 2,
        stroke: am5.color(color),
      });

      series.bullets.push(() => {
        const circle = am5.Circle.new(this.root, {
          radius: 4,
          fill: am5.color(color), // Match the fill color to the line color
          stroke: this.root.interfaceColors.get('background'),
          strokeWidth: 2,
        });

        return am5.Bullet.new(this.root, {
          sprite: circle,
        });
      });

      series.appear(1000, 100);
      return series;
    };
    const seriesList: am5xy.LineSeries[] = [];
    this.multiChartData.forEach((seriesData, index) => {
      const series = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          name: seriesData.name,
          minBulletDistance: 10,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'value',
          valueXField: 'category',
          tooltip: am5.Tooltip.new(this.root, {
            pointerOrientation: 'horizontal',
            labelText: '{valueY}',
          }),
        })
      );

      series.data.processor = am5.DataProcessor.new(this.root, {
        dateFormat: 'yyyy-MM-dd',
        dateFields: ['category'],
      });
      series.data.setAll(seriesData.data);
      series.strokes.template.setAll({
        strokeWidth: 2,
        stroke: am5.color(this.colors[index] || '#000000'),
        strokeDasharray: undefined,
      });

      series.bullets.push(() => {
        const circle = am5.Circle.new(this.root, {
          radius: 4,
          fill: am5.color(this.colors[index] || '#000000'), // custom color for target
          stroke: this.root.interfaceColors.get('background'),
          strokeWidth: 2,
        });

        return am5.Bullet.new(this.root, {
          sprite: circle,
        });
      });
      series.appear(1000, 100);
      seriesList.push(series);
    });

    if (this.targetData) {
      const targetSeries = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          name: 'Target',
          minBulletDistance: 10,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'value',
          valueXField: 'category',
          tooltip: am5.Tooltip.new(this.root, {
            pointerOrientation: 'horizontal',
            labelText: '{valueY}',
          }),
          stroke: am5.color('#FF0000'),
        })
      );
      targetSeries.data.processor = am5.DataProcessor.new(this.root, {
        dateFormat: 'yyyy-MM-dd',
        dateFields: ['category'],
      });

      targetSeries.data.setAll(this.targetData);

      targetSeries.strokes.template.setAll({
        strokeWidth: 2,
      });

      targetSeries.bullets.push(() => {
        const circle = am5.Circle.new(this.root, {
          radius: 4,
          fill: am5.color('#FF0000'),
          stroke: this.root.interfaceColors.get('background'),
          strokeWidth: 2,
        });

        return am5.Bullet.new(this.root, {
          sprite: circle,
        });
      });

      targetSeries.appear(1000, 100);
      seriesList.push(targetSeries);
    }

    // Adding target2Data series
    if (this.target2Data) {
      const target2Series = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          name: 'Actual',
          minBulletDistance: 10,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'value',
          valueXField: 'category',
          tooltip: am5.Tooltip.new(this.root, {
            pointerOrientation: 'horizontal',
            labelText: '{valueY}',
          }),
          stroke: am5.color('#0000FF'),
        })
      );

      target2Series.data.processor = am5.DataProcessor.new(this.root, {
        dateFormat: 'yyyy-MM-dd',
        dateFields: ['category'],
      });

      target2Series.data.setAll(this.target2Data);

      target2Series.strokes.template.setAll({
        strokeWidth: 2,
      });

      target2Series.bullets.push(() => {
        const circle = am5.Circle.new(this.root, {
          radius: 4,
          fill: am5.color('#0000FF'),
          stroke: this.root.interfaceColors.get('background'),
          strokeWidth: 2,
        });

        return am5.Bullet.new(this.root, {
          sprite: circle,
        });
      });

      target2Series.appear(1000, 100);
      seriesList.push(target2Series);
    }

    // Add legend at the bottom
    const legend = chart.children.push(
      am5.Legend.new(this.root, {
        nameField: 'name',
        fillField: 'color',
        strokeField: 'color',
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 20,
      })
    );
    legend.data.setAll([
      {
        name: 'Actual',
        color: am5.color('#45006F'),
      },
      {
        name: 'Target',
        color: am5.color('#D2D7D9'),
      },
    ]);

    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10,
    });

    const cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        xAxis: xAxis,
      })
    );
    cursor.lineY.set('visible', false);
    chart.appear(1000, 100);
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
    this.root.dispose();
  }
}
