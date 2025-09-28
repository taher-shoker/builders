import {
  Component,
  OnDestroy,
  AfterViewInit,
  input,
  InputSignal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export interface DonutData {
  country: string;
  litres: number;
  bottles: number;
}

export interface LegendItem {
  label: string;
  color: string;
  value?: string;
}

@Component({
  selector: 'stc-apps-actual-progress',
  templateUrl: './actual-progress.component.html',
  styleUrls: ['./actual-progress.component.scss'],
})
export class ActualProgressComponent implements OnDestroy, AfterViewInit {
  title: InputSignal<string> = input('');
  data: InputSignal<DonutData[]> = input<DonutData[]>([]);
  width: InputSignal<string> = input('100%');
  height: InputSignal<string> = input('400px');
  segmentGap: InputSignal<number> = input(10);
  baseColor: InputSignal<string> = input('#03c38b');
  legendItems: InputSignal<LegendItem[]> = input<LegendItem[]>([
    { label: 'Ontrack', color: '#03c38b', value: '40%' },
    { label: 'At Risk', color: '#ffa500', value: '30%' },
    { label: 'Delayed', color: '#ff4d4d', value: '30%' },
  ]);
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  private root!: am5.Root;
  private chart!: am5percent.PieChart;
  private legendContainer!: am5.Container;

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
    }, 300);
  }

  ngOnDestroy() {
    if (this.root && !this.root.isDisposed()) {
      this.root.dispose();
    }
  }

  private createChart() {
    try {
      if (this.chartContainer && this.chartContainer.nativeElement) {
        // Clear the container first
        this.chartContainer.nativeElement.innerHTML = '';
        // Create root using the container element directly
        this.root = am5.Root.new(this.chartContainer.nativeElement);

        // Set themes
        this.root.setThemes([am5themes_Animated.new(this.root)]);

        // Set the root container's layout to vertical
        this.root.container.set('layout', this.root.verticalLayout);

        // Create main container for chart (takes 70% of space)
        const chartContainer = this.root.container.children.push(
          am5.Container.new(this.root, {
            width: am5.percent(100),
            height: am5.percent(70), // Chart takes 70% of height
            layout: this.root.verticalLayout,
          })
        );

        // Create chart within the chart container
        this.chart = chartContainer.children.push(
          am5percent.PieChart.new(this.root, {
            startAngle: 160,
            endAngle: 380,
            width: am5.percent(100),
            height: am5.percent(100),
          })
        );

        /* remove amchart logo */
        if (this.root._logo) {
          this.root._logo.dispose();
        }

        // Use provided data or default data
        const chartData =
          this.data().length > 0 ? this.data() : this.getDefaultData();

        // Make all segments the same width by setting equal values
        const segmentCount = chartData.length;
        const sameValue = 100;
        const half = Math.ceil(segmentCount / 2);
        const coloredData = chartData.map((item, idx) => ({
          ...item,
          litres: sameValue,
          bottles: sameValue,
          color: idx < half ? this.baseColor() : '#e0e0e0',
        }));

        // Create color set from coloredData
        const colorSet = am5.ColorSet.new(this.root, {
          colors: coloredData.map((d) => am5.color(d.color)),
        });

        // Create outer series (thick ring)
        let series0 = this.chart.series.push(
          am5percent.PieSeries.new(this.root, {
            valueField: 'litres',
            categoryField: 'country',
            startAngle: 160,
            endAngle: 380,
            radius: am5.percent(70),
            innerRadius: am5.percent(65),
          })
        );

        // Apply gap and solid color to outer series
        series0.slices.template.setAll({
          stroke: am5.color(0xffffff),
          strokeWidth: this.segmentGap(),
          strokeOpacity: 1,
          fillOpacity: 1,
        });

        // Create inner series (thin ring)
        let series1 = this.chart.series.push(
          am5percent.PieSeries.new(this.root, {
            startAngle: 160,
            endAngle: 380,
            valueField: 'bottles',
            innerRadius: am5.percent(80),
            categoryField: 'country',
          })
        );

        // Apply gap and solid color to inner series
        series1.slices.template.setAll({
          stroke: am5.color(0xffffff),
          strokeWidth: this.segmentGap(),
          strokeOpacity: 1,
          fillOpacity: 1,
          cornerRadius: 20,
        });

        // Apply colorSet to outer series
        series0.set('colors', colorSet);
        // Apply colorSet to inner series
        series1.set('colors', colorSet);

        series1.ticks.template.set('forceHidden', true);
        series1.labels.template.set('forceHidden', true);

        // Create a series for the inner dotted border
        let dottedSeries = this.chart.series.push(
          am5percent.PieSeries.new(this.root, {
            startAngle: 160,
            endAngle: 380,
            valueField: 'value',
            categoryField: 'category',
            innerRadius: am5.percent(60),
            radius: am5.percent(60),
          })
        );

        dottedSeries.slices.template.setAll({
          fillOpacity: 0,
          stroke: am5.color(0xe0e0e0),
          strokeWidth: 1,
          strokeDasharray: [5, 5],
          strokeOpacity: 1,
        });

        // Single data item to create one continuous arc
        dottedSeries.data.setAll([{ value: 1, category: 'border' }]);
        dottedSeries.ticks.template.set('forceHidden', true);
        dottedSeries.labels.template.set('forceHidden', true);

        // Add bold 76% label
        this.chart.seriesContainer.children.push(
          am5.Label.new(this.root, {
            textAlign: 'center',
            centerY: am5.p50,
            centerX: am5.p50,
            y: -20,
            text: '76 %',
            fontSize: 30,
            fontWeight: '800',
            fill: am5.color(0x03c38b),
            width: am5.percent(100),
            height: am5.percent(30),
          })
        );

        // Add normal Actual Progress label below
        this.chart.seriesContainer.children.push(
          am5.Label.new(this.root, {
            textAlign: 'center',
            centerY: am5.p100,
            centerX: am5.p50,
            y: 25,
            text: 'Actual Progress',
            fontSize: 20,
            fontWeight: 'normal',
            fill: am5.color(0x000000),
            width: am5.percent(100),
            height: am5.percent(10),
          })
        );

        // Set data
        series0.data.setAll(coloredData);
        series1.data.setAll(coloredData);

        // Hide all default series labels and ticks
        series0.labels.template.set('forceHidden', true);
        series0.ticks.template.set('forceHidden', true);

        // Add static label for "Baseline"
        this.chart.children.push(
          am5.Label.new(this.root, {
            text: '0%\n[bold]Baseline[/]',
            x: am5.percent(20),
            y: am5.percent(85),
            fontSize: 14,
            fill: am5.color(0x677184),
            textAlign: 'center',
          })
        );

        // Add static label for "Target"
        this.chart.children.push(
          am5.Label.new(this.root, {
            text: '100%\n[bold]Target[/]',
            x: am5.percent(75),
            y: am5.percent(85),
            fontSize: 14,
            fill: am5.color(0x677184),
            textAlign: 'center',
          })
        );

        // Create legends container at the bottom (takes 30% of space)
        this.createLegends();
      }
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  private createLegends() {
    // Create legends container at the bottom
    this.legendContainer = this.root.container.children.push(
      am5.Container.new(this.root, {
        width: am5.percent(65),
        height: am5.percent(30), // Legends take 30% of height
        layout: this.root.horizontalLayout,
        y: am5.percent(100), // Position below the chart (chart takes 70%)
        x: am5.percent(20), // Center the legends container
      })
    );

    const legendItems = this.legendItems();

    // Create legend items
    legendItems.forEach((item, index) => {
      const legendItem = this.legendContainer.children.push(
        am5.Container.new(this.root, {
          width: am5.percent(100 / legendItems.length),
          height: am5.percent(100),
          layout: this.root.horizontalLayout, // Use horizontal layout for side-by-side placement
          centerY: am5.p50,
        })
      );

      // Color indicator
      legendItem.children.push(
        am5.RoundedRectangle.new(this.root, {
          width: 10,
          height: 10,
          fill: am5.color(item.color),
          cornerRadiusTL: 10,
          cornerRadiusTR: 10,
          cornerRadiusBL: 10,
          cornerRadiusBR: 10,
          centerY: am5.p50,
        })
      );

      // Label placed right next to the color indicator
      legendItem.children.push(
        am5.Label.new(this.root, {
          text: item.label,
          fontSize: 12,
          fill: am5.color(0x000000),
          textAlign: 'center',
          centerY: am5.p50,
          marginLeft: 0, // Add some space between color box and label
          marginRight: 0,
        })
      );
    });
  }

  // Method to update legends
  public updateLegends(newLegendItems: LegendItem[]): void {
    if (this.root && !this.root.isDisposed() && this.legendContainer) {
      // Clear existing legends
      this.legendContainer.children.clear();

      // Create new legends
      newLegendItems.forEach((item, index) => {
        const legendItem = this.legendContainer.children.push(
          am5.Container.new(this.root, {
            width: am5.percent(100 / newLegendItems.length),
            height: am5.percent(100),
            layout: this.root.horizontalLayout,
            centerY: am5.p50,
          })
        );

        // Color indicator
        legendItem.children.push(
          am5.RoundedRectangle.new(this.root, {
            width: 15,
            height: 15,
            fill: am5.color(item.color),
            cornerRadiusTL: 4,
            cornerRadiusTR: 4,
            cornerRadiusBL: 4,
            cornerRadiusBR: 4,
            centerY: am5.p50,
          })
        );

        // Label placed right next to the color indicator
        legendItem.children.push(
          am5.Label.new(this.root, {
            text: item.label,
            fontSize: 14,
            fill: am5.color(0x000000),
            textAlign: 'left',
            centerY: am5.p50,
            marginLeft: 8,
            marginRight: 0,
          })
        );
      });
    }
  }

  private getDefaultData(): DonutData[] {
    return [
      {
        country: 'Lithuania',
        litres: 501.9,
        bottles: 1500,
      },
      {
        country: 'Czech Republic',
        litres: 301.9,
        bottles: 990,
      },
      {
        country: 'Ireland',
        litres: 201.1,
        bottles: 785,
      },
      {
        country: 'Germany',
        litres: 165.8,
        bottles: 255,
      },
      {
        country: 'Australia',
        litres: 139.9,
        bottles: 452,
      },
      {
        country: 'Austria',
        litres: 128.3,
        bottles: 332,
      },
      {
        country: 'UK',
        litres: 99,
        bottles: 150,
      },
      {
        country: 'Belgium',
        litres: 60,
        bottles: 178,
      },
      {
        country: 'The Netherlands',
        litres: 50,
        bottles: 50,
      },
    ];
  }

  // Method to update chart data
  public updateData(newData: DonutData[]): void {
    if (this.root && !this.root.isDisposed()) {
      const series0 = this.chart.series.getIndex(0) as am5percent.PieSeries;
      const series1 = this.chart.series.getIndex(1) as am5percent.PieSeries;

      if (series0 && series1) {
        series0.data.setAll(newData);
        series1.data.setAll(newData);
      }
    }
  }

  // Method to update center label
  public updateCenterLabel(text: string): void {
    if (this.root && !this.root.isDisposed()) {
      const label = this.chart.seriesContainer.children.getIndex(
        0
      ) as am5.Label;
      if (label) {
        label.set('text', text);
      }
    }
  }

  // Method to update segment gap using stroke width
  public updateSegmentGap(gapSize: number): void {
    if (this.root && !this.root.isDisposed()) {
      const series0 = this.chart.series.getIndex(0) as am5percent.PieSeries;
      const series1 = this.chart.series.getIndex(1) as am5percent.PieSeries;

      if (series0 && series1) {
        series0.slices.template.set('strokeWidth', gapSize);
        series1.slices.template.set('strokeWidth', gapSize);

        series0.data.setAll(series0.data.values);
        series1.data.setAll(series1.data.values);
      }
    }
  }

  // Method to update base color
  public updateBaseColor(color: string): void {
    if (this.root && !this.root.isDisposed()) {
      const newColorSet = am5.ColorSet.new(this.root, {
        colors: [am5.color(color)],
      });

      const series0 = this.chart.series.getIndex(0) as am5percent.PieSeries;
      const series1 = this.chart.series.getIndex(1) as am5percent.PieSeries;

      if (series0 && series1) {
        series0.set('colors', newColorSet);
        series1.set('colors', newColorSet);

        series0.slices.template.set('stroke', am5.color(0xffffff));
        series1.slices.template.set('stroke', am5.color(0xffffff));
      }
    }
  }
}
