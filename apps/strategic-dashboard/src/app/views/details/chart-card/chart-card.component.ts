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
      const groupedData = strategicGroupData.values.reduce(
        (
          acc: { [key: number]: { target: number[]; actualValue: number[] } },
          value: any
        ) => {
          if (!acc[value.year]) {
            acc[value.year] = { target: [], actualValue: [] };
          }
          acc[value.year].target.push(value.target || 0);
          acc[value.year].actualValue.push(value.actualValue || 0);
          return acc;
        },
        {}
      );

      const targetSeries: LineChartData[] = [];
      const actualSeries: LineChartData[] = [];

      Object.keys(groupedData).forEach((yearStr: string) => {
        const year = parseInt(yearStr);
        const targetValues = groupedData[year].target;
        const actualValues = groupedData[year].actualValue;

        if (targetValues.length > 0 || actualValues.length > 0) {
          targetValues.forEach((targetValue: any) => {
            targetSeries.push({
              category: new Date(year, 0, 1),
              value: targetValue,
            });
          });

          actualValues.forEach((actualValue: any) => {
            actualSeries.push({
              category: new Date(year, 0, 1),
              value: actualValue,
            });
          });
        }
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
