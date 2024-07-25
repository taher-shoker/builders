import {
  Component,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';
import { LineSeriesData } from '../custom-line-chart/custom-line-chart.component';

@Component({
  selector: 'stc-apps-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent {
  selectedTab: WritableSignal<string> = signal('ColumnChart');
  title: InputSignal<string> = input('');

  handleChangeTab(value: any) {
    this.selectedTab.set(value);
  }

  //Hold the line of the data
  chartData: { name: string; data: LineChartData[] }[] = [
    {
      name: 'Line 1',
      data: [
        { category: new Date(2022, 0, 1), value: 10 },
        { category: new Date(2023, 1, 2), value: 60 },
        { category: new Date(2024, 2, 3), value: 75 },
        { category: new Date(2025, 3, 4), value: 0 },
      ],
    },
    {
      name: 'Line 2',
      data: [
        { category: new Date(2022, 0, 1), value: 30 },
        { category: new Date(2023, 1, 2), value: 55 },
        { category: new Date(2024, 2, 3), value: 10 },
        { category: new Date(2025, 3, 4), value: 25 },
      ],
    },
  ];

  targetData: LineChartData[] = [
    { category: '2024-07-01', value: 15 },
    { category: '2024-07-02', value: 25 },
    { category: '2024-07-02', value: 30 },
  ];

  target2Data: LineChartData[] = [
    { category: '2024-07-01', value: 5 },
    { category: '2024-07-02', value: 10 },
  ];

  // Hold the line of the Baseline
  lineChartBaseline: LineChartData[] = [
    { category: new Date(2023, 0, 1), value: 60 },
    { category: new Date(2023, 1, 1), value: 90 },
    { category: new Date(2023, 2, 1), value: 75 },
  ];

  lineChartColors = ['#8E9AA0', '#45006F'];
}
