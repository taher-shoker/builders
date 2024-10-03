import { Component, effect, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-progress-card',
  templateUrl: './progress-card.component.html',
  styleUrl: './progress-card.component.scss',
})
export class ProgressCardComponent {
  color = 'rgb(194, 252, 221)';
  precentColor = 'var(--stcOasisColor)';
  iconPath = 'assets/images/arrow-up.svg';
  title: InputSignal<string> = input('');
  precentage: InputSignal<string> = input('');
  unit: InputSignal<string | any> = input('');
  thresholds: InputSignal<{ green: number; orange: number; red: number }> =
    input({
      green: 0,
      orange: 0,
      red: 0,
    });
  constructor() {
    this.getPercentageClass();
  }

  getPercentageDisplay(): string {
    const value = +this.precentage();
    if (!isNaN(value)) {
      if (this.unit() === '%') {
        return (value * 100).toFixed(2) + ' ' + this.unit();
      } else {
        return value + ' ' + this.unit();
      }
    }
    return '0%';
  }

  getPercentageClass(): string {
    const value = +this.precentage();
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
