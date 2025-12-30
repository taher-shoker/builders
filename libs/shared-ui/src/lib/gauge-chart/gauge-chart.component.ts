import { Component, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'stc-apps-gauge-chart',
  standalone: false,
  templateUrl: './gauge-chart.component.html',
  styleUrl: './gauge-chart.component.scss',
})
export class GaugeChartComponent implements OnChanges {
  // Inputs to make the chart reusable
  @Input() value: number | string = '-30'; // The text to display
  @Input() percentage = 30; // The fill amount (0-100)
  @Input() size = 150; // Width/Height in pixels
  @Input() strokeWidth = 15; // Thickness of the bar
  @Input() color = '#da292e'; // The red color from your image

  // Internal calculations for SVG
  radius = 0;
  circumference = 0;
  dashOffset = 0;

  ngOnChanges(): void {
    this.calculateChart();
  }

  private calculateChart(): void {
    // Determine radius based on size and stroke to prevent clipping
    // We assume a viewBox of 100x100 for easy scaling
    const viewBoxSize = 100;
    this.radius = viewBoxSize / 2 - this.strokeWidth / 2;

    // Calculate circle geometry
    this.circumference = 2 * Math.PI * this.radius;

    // Calculate how much of the stroke to hide (dashoffset)
    // Formula: Circumference - (Progress% * Circumference)
    const progressDecimal = this.percentage / 100;
    this.dashOffset = this.circumference * (1 - progressDecimal);
  }
}
