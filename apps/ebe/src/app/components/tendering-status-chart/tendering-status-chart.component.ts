import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
interface tenderingData{
  title: string;
  value: number;
  color: string;
}
@Component({
  selector: 'stc-apps-tendering-status-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tendering-status-chart.component.html',
  styleUrl: './tendering-status-chart.component.scss',
})
export class TenderingStatusChartComponent {
  capexTenderingChart = input.required<tenderingData[]>()
}
