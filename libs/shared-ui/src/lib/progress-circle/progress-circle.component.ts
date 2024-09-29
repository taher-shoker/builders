import { Component, InputSignal, WritableSignal, input, signal } from '@angular/core';

@Component({
  selector: 'stc-apps-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss']
})
export class ProgressCircleComponent {
  progressValue: InputSignal<number> = input(0);
  strategicFlag:InputSignal<boolean>=input(false);
  progressSize: InputSignal<string> = input('12rem');
  mainBgColor: InputSignal<string> = input('var(--stc-color)');
  secondaryBgColor: InputSignal<string> = input('var(--stc-lightGrey-color)');
  showProgress: InputSignal<boolean> = input(true);

  conicGradient(): string {
    return `conic-gradient(${this.mainBgColor()} calc(var(--pgPercentage) * 1% ), ${this.secondaryBgColor()} 0)`;
  }
}
