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
  status: InputSignal<string> = input('');
  constructor() {
    effect(() => {
      console.log('hi');
      if (this.status() == 'delayed') {
        this.color = 'var(--light-pink)';
        this.precentColor = 'var(--stcCoralColor)';
        this.iconPath = 'assets/images/arrow-down-delayed.svg';
      } else if (this.status() == 'onHold') {
        this.color = 'var(--light-stc-orangeColor)';
        this.precentColor = 'var(--stcSunsetColor)';
        this.iconPath = 'assets/images/arrow-down.svg';
      }
    });
  }
}
