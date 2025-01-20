import {
  Component,
  effect,
  input,
  Input,
  InputSignal,
  OnInit,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
@Component({
  selector: 'stc-apps-pie-chart',
  templateUrl: './pieChart.component.html',
  styleUrl: './pieChart.component.scss',
})
export class PieChartComponent implements OnInit {
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
        this.pieChart();
      }
    });
  }
  ngOnInit(): void {
    this.chartdiv_id = `${Math.random()}_chart_id`;
  }

  pieChart() {
    console.log(this.chartData());
    const pieChartData: any[] = [];
    this.chartData()?.map((dataItem, index) => {
      pieChartData.push({
        value: dataItem.value,
        category: dataItem.category,
        sliceSettings: {
          fill: am5.color(
            this.pieChartColors[index % this.pieChartColors.length]
          ),
          stroke: am5.color(
            this.pieChartColors[index % this.pieChartColors.length]
          ),
        },
      });
    });

    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
      am5percent.PieChart.new(this.root, {
        layout: this.root.horizontalLayout,
      })
    );
    if (this.root._logo) {
      this.root._logo.dispose();
    }

    const series = chart.series.push(
      am5percent.PieSeries.new(this.root, {
        valueField: 'value',
        categoryField: 'category',
      })
    );

    series.labels.template.set('forceHidden', true);
    series.ticks.template.set('forceHidden', true);

    series.slices.template.setAll({
      templateField: 'sliceSettings',
    });
    series.data.setAll(pieChartData);

    const legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerY: am5.percent(50),
        y: am5.percent(50),
        layout: this.root.verticalLayout,
      })
    );

    legend.data.setAll(series.dataItems);
    const disableChartInteractions = () => {
      series.slices.template.states.create('hover', {
        scale: 1,
      });
      series.slices.template.set('toggleKey', 'none');
      series.slices.template.setAll({
        tooltipText: '',
      });
    };

    const adjustLegendPosition = () => {
      if (window.innerWidth <= 768) {
        chart.set('layout', this.root.verticalLayout);
        legend.setAll({
          y: am5.percent(65),
          centerY: am5.percent(0),
          marginBottom: 12,
        });
      } else {
        chart.set('layout', this.root.horizontalLayout);
        legend.setAll({
          y: am5.percent(50),
          centerY: am5.percent(50),
        });
      }
    };
    adjustLegendPosition();
    series.appear(1000, 100);
    window.addEventListener('resize', adjustLegendPosition);
  }
}
