import { Component, computed, input, InputSignal } from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProgressInfo } from 'libs/shared-ui/src/lib/progress-bar/progress-bar.component';

interface Progress {
  value: number;
  label: string;
  bgColor: string;
}
interface columnChartData {
  year: string;
  Actual: number;
  Target: number;
}

@Component({
  selector: 'stc-apps-program-details-card',
  templateUrl: './program-details-card.component.html',
  styleUrls: ['./program-details-card.component.scss'],
})
export class ProgramDetailsCardComponent {
  title: InputSignal<string> = input('');
  chartType: InputSignal<string> = input('');
  progressValue: InputSignal<Progress[]> = input<Progress[]>([]);
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

  lineChartColors = ['#D2D7D9', '#45006F'];
  lineChartData: { name: string; data: LineChartData[] }[] = [
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

  progressBarData = computed(() => {
    let data: ProgressInfo;
    // eslint-disable-next-line prefer-const
    data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: 85.0,
      indexes: [
        {
          caption: 'Actual',
          value: 93.0,
          position: 'up',
        },
        {
          caption: 'Planned',
          value: 81.0,
          position: 'down',
        },
      ],
      barColor: '#00C48C',
      bgBarColor: '#c82a271a',
    };

    return data;
  });
}
