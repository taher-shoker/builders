import { Component, input, InputSignal, OnInit } from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-di-progress',
  templateUrl: './di-progress.component.html',
  styleUrls: ['./di-progress.component.scss']
})
export class DiProgressComponent implements OnInit {
  title: InputSignal<string> = input('');
  //Hold the line of the data
  lineChartData: LineChartData[] = [];

  //Hold the line of the target
  lineChartTarget: LineChartData[] = [];

  lineChartColors = ['#45006F', '#FF6A39'];

    ngOnInit(): void {
       this.initializeDummyData();
  }

   private initializeDummyData(): void {
    // Generate dummy data for the main line chart
    this.lineChartData = [
      { category: '2024-01-01', value: 65, caseCount: 10 },
      { category: '2024-02-01', value: 72, caseCount: 15 },
      { category: '2024-03-01', value: 68, caseCount: 12 },
      { category: '2024-04-01', value: 80, caseCount: 18 },
      { category: '2024-05-01', value: 75, caseCount: 14 },
      { category: '2024-06-01', value: 85, caseCount: 20 },
      { category: '2024-07-01', value: 78, caseCount: 16 },
      { category: '2024-08-01', value: 90, caseCount: 22 },
      { category: '2024-09-01', value: 82, caseCount: 19 },
      { category: '2024-10-01', value: 88, caseCount: 21 },
      { category: '2024-11-01', value: 95, caseCount: 25 },
      { category: '2024-12-01', value: 92, caseCount: 23 }
    ];

    // Generate dummy data for the target line (dashed line)
    this.lineChartTarget = [
      { category: '2024-01-01', value: 70 },
      { category: '2024-02-01', value: 70 },
      { category: '2024-03-01', value: 70 },
      { category: '2024-04-01', value: 75 },
      { category: '2024-05-01', value: 75 },
      { category: '2024-06-01', value: 80 },
      { category: '2024-07-01', value: 80 },
      { category: '2024-08-01', value: 85 },
      { category: '2024-09-01', value: 85 },
      { category: '2024-10-01', value: 90 },
      { category: '2024-11-01', value: 90 },
      { category: '2024-12-01', value: 95 }
    ];
  }
}
