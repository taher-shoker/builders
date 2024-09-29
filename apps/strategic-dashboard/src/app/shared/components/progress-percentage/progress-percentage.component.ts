import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-progress-percentage',
  templateUrl: './progress-percentage.component.html',
  styleUrls: ['./progress-percentage.component.scss'],
})
export class ProgressPercentageComponent {
  percentage: InputSignal<string> = input('');
  thresholds: InputSignal<{ green: number; orange: number; red: number }> =
    input({
      green: 0,
      orange: 0,
      red: 0,
    });

  getPercentageClass(): string {
    const value = +this.percentage();
    const { green, orange, red } = this.thresholds();
    if (value >= green) {
      return 'greater-than-green';
    } else if (value < red) {
      return 'less-than-red';
    } else {
      return 'between-orange';
    }
  }
}
