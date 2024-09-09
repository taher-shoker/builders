import {
  Component,
  computed,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent implements OnInit {
  selectedTab: WritableSignal<string> = signal('ColumnChart');
  title: InputSignal<string> = input('');
  unit: WritableSignal<string> = signal('');
  strategicGroup: InputSignal<
    { values: { year: number; actualValue: number; target: number }[] } | any
  > = input([]);

  ngOnInit(): void {
    this.extractUnit();
  }

  handleChangeTab(value: any) {
    this.selectedTab.set(value);
  }

  extractUnit() {
    const values = this.strategicGroup().values;
    if (values.length > 0) {
      this.unit.set(values[0].unit);
    }
  }

  //Hold the line of the data
  lineChartData = computed(() => {
    const strategicGroupData = this.strategicGroup();
    let processedData: { name: string; data: LineChartData[] }[] = [];

    if (strategicGroupData && Array.isArray(strategicGroupData.values)) {
      const sortedValues = strategicGroupData.values.sort(
        (a: any, b: any) => a.year - b.year
      );

      const targetSeries: LineChartData[] = [];
      const actualSeries: LineChartData[] = [];

      sortedValues.forEach((value: any, index: number) => {
        const dateCategory = new Date(value.year, index, 1);

        targetSeries.push({
          category: dateCategory,
          value: value.target,
        });

        actualSeries.push({
          category: dateCategory,
          value: value.actualValue,
        });
      });

      processedData = [
        { name: `Target ${this.unit()}`, data: targetSeries },
        { name: `Actual ${this.unit()}`, data: actualSeries },
      ];
    }

    return processedData;
  });

  columnChartData = computed(() => {
    const strategicGroupData = this.strategicGroup();
    let processedData: { year: number; Actual: number; Target: number }[] = [];

    if (strategicGroupData && Array.isArray(strategicGroupData.values)) {
      processedData = strategicGroupData.values.map((value: any) => ({
        year: value.year,
        Actual: value.actualValue,
        Target: value.target,
      }));
    }
    return processedData;
  });

  lineChartColors = ['#D2D7D9', '#45006F'];
}
