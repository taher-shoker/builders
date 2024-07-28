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
      name: 'Target',
      data: [
        { category: new Date(2022, 0, 1), value: 10 },
        { category: new Date(2023, 1, 2), value: 60 },
        { category: new Date(2024, 2, 3), value: 75 },
        { category: new Date(2025, 3, 4), value: 0 },
      ],
    },
    {
      name: 'Actual',
      data: [
        { category: new Date(2022, 0, 1), value: 30 },
        { category: new Date(2023, 1, 2), value: 55 },
        { category: new Date(2024, 2, 3), value: 10 },
        { category: new Date(2025, 3, 4), value: 25 },
      ],
    },
  ];
  columnChartData = [
    {
      year: '2022',
      Actual: 50,
      Target: 20,
    },
    {
      year: '2023',
      Actual: 70,
      Target: 70,
    },
    {
      year: '2024',
      Actual: 20,
      Target: 60,
    },
    {
      year: '2025',
      Actual: 0,
      Target: 0,
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

  lineChartColors = ['#D2D7D9', '#45006F'];
}
