import {
  Component,
  effect,
  Input,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'stc-apps-scatter-chat-chart',
  templateUrl: './scatterChart.component.html',
  styleUrl: './scatterChart.component.scss',
})
export class ScatterChartComponent implements OnInit {
  root!: am5.Root;
  chartdiv_id = '';
  popUpClick: InputSignal<boolean> = input(false);
  chartData: InputSignal<any[]> = input([{}]);
  chartTitle: InputSignal<string> = input('');
  pieChartColors = [
    '#4f2b85',
    '#0dcaf0',
    '#ffc107',
    '#fd7e14',
    '#20c997',
    '#d63384',
    '#212529',
  ];
  @Input() unit = '';
  constructor() {
    effect(() => {
      if (this.chartData().length > 0) {
        this.scatterChart();
      }
    });
  }
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }
  scatterChart() {
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    if (this.root._logo) {
      this.root._logo.dispose();
    }
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
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererX.new(this.root, { minGridDistance: 50 }),
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    const series = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'y',
        valueXField: 'x',
        valueField: 'value',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: 'x: {valueX}, y: {valueY}, value: {value}',
        }),
      })
    );

    series.strokes.template.set('visible', false);

    const data = [{ x: 5, y: 10, color: '#000000', value: 10 }];

    const canvasBullets = series.children.push(am5.Graphics.new(this.root, {}));

    canvasBullets.set('draw', (display) => {
      am5.array.each(series.dataItems, (dataItem) => {
        const dataContext: any = dataItem.dataContext;
        if (dataContext) {
          const point = dataItem.get('point');
          if (point) {
            display.beginPath();
            display.beginFill(dataContext.color);
            display.drawCircle(point.x, point.y, dataContext.value / 2);
            display.endFill();
          }
        }
      });
    });

    series.strokes.template.on('userData', drawBullets);

    function drawBullets() {
      canvasBullets._markDirtyKey('draw');
    }

    series.data.setAll(data);
  }
}
