/* eslint-disable @nx/enforce-module-boundaries */
import { AfterViewInit, Component, input, InputSignal } from '@angular/core';
import { LegendSettings } from 'libs/shared-ui/src/lib/chat-charts/line-chart/lineChart.component';
import * as am5 from '@amcharts/amcharts5';

@Component({
  selector: 'stc-apps-di-progress',
  templateUrl: './di-progress.component.html',
  styleUrls: ['./di-progress.component.scss'],
})
export class DiProgressComponent implements AfterViewInit {
  title: InputSignal<string> = input('');

  chartData: any[] = [];
  legendSettings: LegendSettings = {
    layout: 'horizontal',
    itemSpacing: 10,
    markerCornerRadius: 10,
    fontSize: 12,
    markerWidth: 10,
    markerHeight: 10,
    marginTop: 30,
    labelCenterY: am5.percent(70),
    colors: [
      '#277FF1',
      '#00C48C',
      '#FF6A39',
      '#4F008C',
    ],
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeDummyData();
    });
  }

  private initializeDummyData(): void {
    const rawData = [
      {
        x: 'Jan',
        value1: 65,
        value2: 45,
        value3: 75,
        value4: 55,
      },
      {
        x: 'Feb',
        value1: 72,
        value2: 52,
        value3: 68,
        value4: 60,
      },
      {
        x: 'Mar',
        value1: 68,
        value2: 58,
        value3: 72,
        value4: 58,
      },
      {
        x: 'Apr',
        value1: 80,
        value2: 65,
        value3: 78,
        value4: 65,
      },
      {
        x: 'May',
        value1: 75,
        value2: 70,
        value3: 82,
        value4: 70,
      },
      {
        x: 'Jun',
        value1: 85,
        value2: 75,
        value3: 88,
        value4: 75,
      },
      {
        x: 'Jul',
        value1: 78,
        value2: 68,
        value3: 85,
        value4: 72,
      },
      {
        x: 'Aug',
        value1: 90,
        value2: 80,
        value3: 92,
        value4: 82,
      },
      {
        x: 'Sep',
        value1: 82,
        value2: 72,
        value3: 87,
        value4: 78,
      },
      {
        x: 'Oct',
        value1: 88,
        value2: 78,
        value3: 90,
        value4: 85,
      },
      {
        x: 'Nov',
        value1: 95,
        value2: 85,
        value3: 94,
        value4: 90,
      },
      {
        x: 'Dec',
        value1: 92,
        value2: 82,
        value3: 96,
        value4: 88,
      },
    ];

    const indicatorNames = {
      indicatorName1: 'Capability Building',
      indicatorName2: 'Capability Utilization',
      indicatorName3: 'Digital Experience & Impact',
      indicatorName4: 'B2C DI (Total)',
    };

    this.chartData = rawData.map((monthData) => {
      return {
        x: monthData.x,
        value1: monthData.value1,
        value2: monthData.value2,
        value3: monthData.value3,
        value4: monthData.value4,
        ...indicatorNames,
      };
    });
  }
}
