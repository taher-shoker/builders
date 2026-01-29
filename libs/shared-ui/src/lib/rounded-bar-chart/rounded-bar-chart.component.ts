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
  selector: 'stc-apps-rounded-bar-chart',
  standalone: false,
  templateUrl: './rounded-bar-chart.component.html',
  styleUrl: './rounded-bar-chart.component.scss',
})
export class RoundedBarChartComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  chartdiv_id = `${Math.random()}_chart_id`;
  root!: am5.Root;
  @Input() isNegativeValues = false;
  @Input() thresholdsData!: any[];
  @Input({ required: true }) data: {
    gd: string;
    numberOfUnacceptableProjects: number;
    actualValue?: number;
    // threshold?: string;
    // color?: string;
  }[] = [];
  ngAfterViewInit(): void {
    this.roundedBarChart();
  }
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
  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['data'] && !changes['data'].firstChange) ||
      (changes['thresholdsData'] && !changes['thresholdsData'].firstChange)
    ) {
      if (this.root) {
        this.roundedBarChart();
      }
    }
  }
  roundedBarChart() {
    if (this.root) {
      this.root.dispose();
    }
    console.log(this.data);
    console.log(this.thresholdsData);
    this.root = am5.Root.new(this.chartdiv_id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        paddingLeft: 0,
        paddingRight: 1,
      })
    );
    chart.zoomOutButton.set('forceHidden', true);
    if (this.root._logo) {
      this.root._logo.dispose();
    }
    const cursor = chart.set('cursor', am5xy.XYCursor.new(this.root, {}));
    cursor.lineY.set('visible', false);
    cursor.lineX.set('visible', false);
    cursor.setAll({
      snapToSeries: [],
    });
    let xRenderer;
    if (!this.isNegativeValues) {
      xRenderer = am5xy.AxisRendererX.new(this.root, {
        minGridDistance: 30,
      });
    } else {
      xRenderer = am5xy.AxisRendererX.new(this.root, {
        minGridDistance: 30,
        visible: true,
        strokeOpacity: 1,
        strokeWidth: 2,
        stroke: am5.color('#E2E8F0'),
        // minorGridEnabled: true,
      });
    }
    xRenderer.labels.template.setAll({
      fontFamily: 'STCForwardFont',
      fill: am5.color(0x7a7a7b),
      fontSize: 13,
      paddingTop: 10,
      oversizedBehavior: !this.isNegativeValues ? 'truncate' : 'none',
      maxWidth: !this.isNegativeValues ? 50 : undefined, // Adjust this width as needed
      // rotation: -90,
      // centerY: am5.p50,
      // centerX: am5.p100,
      // paddingRight: 15,
    });
    xRenderer.grid.template.setAll({
      location: 1,
    });
    const data2 = this.data.map((item) => {
      const stringValue = Object.values(item).find(
        (value) => typeof value === 'string'
      );
      const numberValue = Object.values(item).find(
        (value) => typeof value === 'number'
      );
      const valueForChart =
        typeof numberValue === 'number' ? numberValue * 100 : 0;
      const actualValue = item.actualValue ?? numberValue;
      return {
        name: stringValue,
        value: valueForChart,
        actualValue: actualValue,
      };
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        maxDeviation: 0.3,
        categoryField: 'name',
        renderer: xRenderer,
        // tooltip: am5.Tooltip.new(this.root, {}),
      })
    );
    const yRenderer = am5xy.AxisRendererY.new(this.root, {
      strokeOpacity: 0,
    });
    if (!this.isNegativeValues) {
      yRenderer.labels.template.setAll({
        forceHidden: true,
      });
    } else {
      yRenderer.labels.template.setAll({
        // visible: false,
        // fillOpacity: 0,
        opacity: 0,
      });
    }
    // const values = data2.map((d) => d.value);
    // const thresholdValues =
    //   this.thresholdsData?.map((t) => t.value * 100) ?? [];
    // const minY = Math.min(...values, ...thresholdValues);
    // const maxY = Math.max(...values, ...thresholdValues);
    let yAxis: any;
    if (this.isNegativeValues) {
      yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          // maxDeviation: 0.3,
          renderer: yRenderer,
          min: 0,
          max: 0.5,
          // strictMinMax: true,
        })
      );
    } else {
      yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          // maxDeviation: 0.3,
          renderer: yRenderer,
          // min: 0,
          // max: 0.6,
          // strictMinMax: true,
        })
      );
    }
    yRenderer.grid.template.setAll({
      // forceHidden: true,
      visible: false,
    });
    xRenderer.grid.template.setAll({
      forceHidden: true,
    });
    const series = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'Series 1',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        sequencedInterpolation: true,
        categoryXField: 'name',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: !this.isNegativeValues
            ? '{categoryX} : {valueY}'
            : '{categoryX} : {actualValue}',
        }),
      })
    );
    series.columns.template.setAll({
      cornerRadiusTL: !this.isNegativeValues ? 25 : 15,
      cornerRadiusTR: !this.isNegativeValues ? 25 : 15,
      cornerRadiusBL: !this.isNegativeValues ? 25 : 15,
      cornerRadiusBR: !this.isNegativeValues ? 25 : 15,
      width: !this.isNegativeValues ? am5.p50 : am5.percent(30),
      strokeOpacity: 0,
    });
    series.bullets.push((root, series, dataItem) => {
      const value = dataItem.get('valueY');
      if (
        typeof value === 'number' &&
        (value === 0 || isNaN(value) || value < 0.001)
      ) {
        return undefined;
      }
      return am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Label.new(root, {
          text: !this.isNegativeValues
            ? "{valueYWorking.formatNumber('#.')}"
            : "{actualValue.formatNumber('#.####')}",
          fill: root.interfaceColors.get('alternativeText'),
          centerY: am5.p0,
          centerX: am5.p50,
          populateText: true,
          fontFamily: 'STCForwardFont',
          fontSize: 13,
        }),
      });
    });
    series.columns.template.adapters.add('fill', function (fill, target) {
      // return chart.get('colors')?.getIndex(series.columns.indexOf(target));
      return am5.color(0xdc2626);
    });
    series.columns.template.adapters.add('stroke', function (stroke, target) {
      return chart.get('colors')?.getIndex(series.columns.indexOf(target));
    });
    if (this.thresholdsData) {
      this.thresholdsData.forEach((threshold) => {
        // console.log(threshold);
        // 1. Create the data item for the range
        const rangeDataItem = yAxis.makeDataItem({
          value: threshold.value * -1, // The Y-axis value where the line goes (e.g. 90 or -10)
        });

        // 2. Create the range
        const range = yAxis.createAxisRange(rangeDataItem);

        // 3. Style the Line (Grid)
        // This makes it a colored dotted line
        range.get('grid')?.setAll({
          stroke: am5.color(threshold.color),
          strokeOpacity: 1,
          strokeWidth: 2,
          strokeDasharray: [3, 3], // [Dash length, Gap length]
          visible: true,
        });

        // 4. Style the Label
        // This places the text (e.g. "-10%") on the left
        range.get('label')?.setAll({
          text: `${threshold.label}%`,
          fill: am5.color(threshold.color),
          visible: true,
          centerY: am5.p50,
          fontFamily: 'STCForwardFont',
          fontSize: 11,
          opacity: 1,
          location: 1, // Align exactly with the grid line
          isMeasured: true, // Prevents label from affecting axis layout width
          dx: 0, // Move label to the left (adjust based on your padding)
        });
      });
    }
    const getDynamicColor = (value: number) => {
      if (!this.thresholdsData || this.thresholdsData.length === 0) {
        return am5.color(0xdc2626);
      }

      const absValue = Math.abs(value);
      const sortedThresholds = [...this.thresholdsData].sort(
        (a, b) => Math.abs(a.value) - Math.abs(b.value)
      );

      // Green (smallest threshold)
      if (absValue <= Math.abs(sortedThresholds[0].value)) {
        return am5.color(sortedThresholds[0].color);
      }
      // Yellow (between green and highest)
      if (
        sortedThresholds[1] &&
        absValue <= Math.abs(sortedThresholds[1].value)
      ) {
        return am5.color(sortedThresholds[1].color);
      }
      // Red (highest)
      return am5.color(sortedThresholds[sortedThresholds.length - 1].color);
    };

    // 2. Adapter for Fill (Background)
    series.columns.template.adapters.add('fill', (fill, target: any) => {
      // FIX: Cast dataItem to 'any' or 'am5xy.ColumnSeriesDataItem' to access 'valueY'
      const dataItem = target.dataItem;
      const value = dataItem?.get('valueY');

      if (typeof value === 'number') {
        return getDynamicColor(value);
      }
      return fill;
    });

    // 3. Adapter for Stroke (Border)
    series.columns.template.adapters.add('stroke', (stroke, target: any) => {
      // FIX: Cast here as well
      const dataItem = target.dataItem;
      const value = dataItem?.get('valueY');

      if (typeof value === 'number') {
        return getDynamicColor(value);
      }
      return stroke;
    });
    xAxis.data.setAll(data2);
    series.data.setAll(data2);
    series.appear(1000);
    chart.appear(1000, 100);
  }
}
