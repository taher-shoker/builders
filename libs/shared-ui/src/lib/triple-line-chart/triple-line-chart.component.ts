import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import am5index from '@amcharts/amcharts5/index';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'stc-apps-triple-line-chart',
  standalone: false,
  templateUrl: './triple-line-chart.component.html',
  styleUrl: './triple-line-chart.component.scss',
})
export class TripleLineChartComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  root!: am5.Root;
  chartdiv_id = `${Math.random()}_chart_id`;
  @Input({ required: true }) data: any[] = [];
  ngOnDestroy(): void {
    // 4. Clean up when component is removed
    if (this.root) {
      this.root.dispose();
    }
    am5.array.each(am5.registry.rootElements, (root) => {
      if (root && root.dom.id === this.chartdiv_id) {
        root.dispose();
      }
    });
  }
  ngAfterViewInit() {
    this.tripleLineChartData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange && this.root) {
      this.tripleLineChartData();
    }
  }
  tripleLineChartData() {
    if (this.root) {
      this.root.dispose();
    }
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        paddingLeft: 0,
      })
    );
    chart
      .get('colors')
      ?.set('colors', [
        am5.color(0x22c55e),
        am5.color(0xeab308),
        am5.color(0xdc2626),
        am5.color(0x64748b),
        am5.color(0xbb9f06),
      ]);
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    const cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);
    cursor.lineX.set('visible', false);
    // const date = new Date();
    // date.setHours(0, 0, 0, 0);
    // let value = 100;
    // function generateData() {
    //   value = Math.round(Math.random() * 10 - 5 + value);
    //   am5.time.add(date, 'day', 1);
    //   return {
    //     date: date.getTime(),
    //     value: value,
    //   };
    // }
    // function generateDatas(count: number) {
    //   const data = [];
    //   for (let i = 0; i < count; ++i) {
    //     data.push(generateData());
    //   }
    //   return data;
    // }
    const xRenderer = am5xy.AxisRendererX.new(this.root, {
      minGridDistance: 50,
      visible: true,
      strokeOpacity: 1,
      strokeWidth: 2,
      stroke: am5.color('#E2E8F0'),
    });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'name',
        renderer: xRenderer,
        visible: true,
        // tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    xAxis.setAll({
      startLocation: 0.4,
      endLocation: 0.7,
    });
    const yRenderer = am5xy.AxisRendererY.new(this.root, {
      visible: true,
      strokeOpacity: 1,
      strokeWidth: 2,
      stroke: am5.color('#E2E8F0'),
    });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation: 1,
        renderer: yRenderer,
        min: 0,
      })
    );
    yRenderer.grid.template.setAll({
      visible: false,
    });
    xRenderer.grid.template.setAll({
      visible: false,
    });
    const series1 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(this.root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'Acceptable',
        tension: 0.5,
        categoryXField: 'name',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: 'Acceptable in {categoryX}: {valueY}%',
        }),
      })
    );
    const series2 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(this.root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'Tolerable',
        tension: 0.5,
        categoryXField: 'name',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: 'Tolerable in {categoryX} : {valueY}%',
        }),
      })
    );
    const series3 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(this.root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'Unacceptable',
        tension: 0.5,
        categoryXField: 'name',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: 'Unacceptable in {categoryX} : {valueY}%',
        }),
      })
    );
    const series4 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(this.root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'Unclassified',
        tension: 0.5,
        categoryXField: 'name',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: 'Unclassified in {categoryX} : {valueY}%',
        }),
      })
    );
    series1.setAll({
      locationX: 0.5,
    });

    series2.setAll({
      locationX: 0.5,
    });

    series3.setAll({
      locationX: 0.5,
    });
    series4.setAll({
      locationX: 0.5,
    });
    chart.setAll({
      paddingLeft: 0,
      paddingRight: 0,
    });
    series1.strokes.template.setAll({
      strokeWidth: 6,
      lineCap: 'round',
    });
    series2.strokes.template.setAll({
      strokeWidth: 6,
      lineCap: 'round',
      // strokeLinecap: 'round',
    });
    series3.strokes.template.setAll({
      strokeWidth: 6,
      lineCap: 'round',
      // strokeLinecap: 'round',
    });
    series4.strokes.template.setAll({
      strokeWidth: 6,
      lineCap: 'round',
      // strokeLinecap: 'round',
    });
    // series1.set('stroke', am5.color('#22C55E'));
    // series2.set('stroke', am5.color('#EAB308'));
    // series3.set('stroke', am5.color('#EF4444'));
    // series.fills.template.setAll({
    //   visible: true,
    //   fillOpacity: 0.2,
    // });
    // series.bullets.push(function () {
    //   return am5.Bullet.new(root, {
    //     locationY: 0,
    //     sprite: am5.Circle.new(root, {
    //       radius: 4,
    //       stroke: root.interfaceColors.get('background'),
    //       strokeWidth: 2,
    //       fill: series.get('fill'),
    //     }),
    //   });
    // });
    // chart.set(
    //   'scrollbarX',
    //   am5.Scrollbar.new(root, {
    //     orientation: 'horizontal',
    //   })
    // );
    // const data = [
    //   { name: 'Q1', value1: 65, value2: 45, value3: 35 },
    //   { name: 'Q2', value1: 55, value2: 28, value3: 15 },
    //   { name: 'Q3', value1: 72, value2: 20, value3: 12 },
    //   { name: 'Q4', value1: 77, value2: 16, value3: 8 },
    // ];
    const data = this.data;
    xAxis.data.setAll(data);
    series1.data.setAll(data);
    series1.appear(1000);
    series2.data.setAll(data);
    series2.appear(1000);
    series3.data.setAll(data);
    series3.appear(1000);
    chart.appear(1000, 100);
    series4.data.setAll(data);
    series4.appear(1000);
    chart.appear(1000, 100);
  }
}
