import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-progress-percentage',
  templateUrl: './progress-percentage.component.html',
  styleUrls: ['./progress-percentage.component.scss'],
})
export class ProgressPercentageComponent {
  percentage: InputSignal<string> = input('');

  getPercentageClass(percentage: string): string {
    const value = parseFloat(percentage);
    if (value < 90) {
      return 'less-than-100';
    } else if (value >= 90 && value <= 100) {
      return 'near-to-100';
    } else {
      return 'greater-than-100';
    }
  }
}
