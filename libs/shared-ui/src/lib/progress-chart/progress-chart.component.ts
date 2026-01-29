import { Component, input } from '@angular/core';
interface tenderingData {
  title: string;
  value: number;
  color: string;
}
@Component({
  selector: 'stc-apps-progress-chart',
  standalone: false,
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.scss',
})
export class ProgressChartComponent {
  capexTenderingChart = input.required<tenderingData[]>();
}
