import {
  Component,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';

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
  lineChartData: LineChartData[] = [
    { category: new Date(2023, 0, 1), value: 50 },
    { category: new Date(2023, 1, 1), value: 80 },
    { category: new Date(2023, 2, 1), value: 65 },
  ];

  //Hold the line of the target
  lineChartTarget: LineChartData[] = [
    { category: new Date(2023, 0, 1), value: 55 },
    { category: new Date(2023, 1, 1), value: 85 },
    { category: new Date(2023, 2, 1), value: 70 },
  ];

  //Hold the line of the Baseline
  lineChartBaseline: LineChartData[] = [
    { category: new Date(2023, 0, 1), value: 60 },
    { category: new Date(2023, 1, 1), value: 90 },
    { category: new Date(2023, 2, 1), value: 75 },
  ];

  lineChartColors = ['#5f5f5f', '#45006F'];
}
