import { Component, computed, effect, input, InputSignal } from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProgressInfo } from 'libs/shared-ui/src/lib/progress-bar/progress-bar.component';
import {
  columnChartData,
  Progress,
} from '../../models/program-kpi-details.model';
import { KPIValue } from '../../models/strategic-program-kpi-details.model';

@Component({
  selector: 'stc-apps-program-details-card',
  templateUrl: './program-details-card.component.html',
  styleUrls: ['./program-details-card.component.scss'],
})
export class ProgramDetailsCardComponent {
  title: InputSignal<string> = input('');
  chartType: InputSignal<string> = input('');
  // progressValue: InputSignal<Progress[]> = input<Progress[]>([]);
  strategicGroup: InputSignal<any> = input<any>([]);
  columnChartData = computed(() => {
    const strategicGroupData = this.strategicGroup();
    let processedData: { year: number; Actual: number; Target: number }[] = [];

    if (strategicGroupData) {
      processedData = strategicGroupData.map((value: any) => ({
        year: value.year,
        Actual: value.Actual,
        Target: value.Target,
      }));
    }
    return processedData;
  });

  progressValue: InputSignal<any> = input<any>();
  lineChartValues: InputSignal<any> = input([]);
  // columnChartData: InputSignal<columnChartData[]> = input<columnChartData[]>(
  //   []
  // );

  lineChartColors = ['#D2D7D9', '#45006F'];
  // lineChartData: { name: string; data: LineChartData[] }[] = [
  //   {
  //     name: 'Planned',
  //     data: [
  //       { category: new Date(2022, 0, 1), value: 10 },
  //       { category: new Date(2023, 1, 2), value: 60 },
  //       { category: new Date(2024, 2, 3), value: 75 },
  //       { category: new Date(2025, 3, 4), value: 0 },
  //     ],
  //   },
  //   {
  //     name: 'Completion',
  //     data: [
  //       { category: new Date(2022, 0, 1), value: 30 },
  //       { category: new Date(2023, 1, 2), value: 55 },
  //       { category: new Date(2024, 2, 3), value: 10 },
  //       { category: new Date(2025, 3, 4), value: 25 },
  //     ],
  //   },
  // ];
  //Hold the line of the data
  lineChartData = computed(() => {
    const strategicGroupData = this.progressValue();
    let processedData: { name: string; data: LineChartData[] }[] = [];

    if (strategicGroupData && Array.isArray(strategicGroupData)) {
      const groupedData = strategicGroupData.reduce(
        (
          acc: { [key: number]: { target: number[]; actualValue: number[] } },
          value: any
        ) => {
          console.log('value', value);

          if (!acc[value.year]) {
            acc[value.year] = { target: [], actualValue: [] };
          }
          acc[value.year].target.push(value.actual || 0);
          acc[value.year].actualValue.push(value.target || 0);
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
        { name: `Target`, data: targetSeries },
        { name: `Actual`, data: actualSeries },
      ];
    }

    return processedData;
  });
 

  progressBarData = computed(() => {
    console.log(this.progressValue()[0]);

    let data: ProgressInfo;
    // eslint-disable-next-line prefer-const
    data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: +(this.progressValue()[0].value * 100).toFixed(2),
      indexes: [
        {
          caption: 'Actual',
          value: +(this.progressValue()[0].value * 100).toFixed(2),
          position: 'up',
        },
        {
          caption: 'Planned',
          value: +(this.progressValue()[0].target! * 100).toFixed(2),
          position: 'down',
        },
      ],
      barColor: this.progressValue()[0].bgColor,
      bgBarColor: '#c82a271a',
    };

    return data;
  });
  constructor() {
    effect(() => {
      console.log('lineChartValuesss', this.progressValue());
    });
  }
  getColorBasedOnPerformance(
    actualValue: number,
    greenThreshold: number,
    redThreshold: number,
    isBackground = false
  ): string {
    if (actualValue >= greenThreshold) {
      return isBackground ? '#00C48C1A' : '#00C48C'; // Green
    } else if (actualValue < redThreshold) {
      return isBackground ? '#c82a271a' : '#c82a27'; // Red
    } else {
      return isBackground ? '#FF6A391A' : '#FF6A39'; // Orange
    }
  }
}
