import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'stc-apps-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
  standalone: false,
})
export class ProgressCircleComponent {
  progressValue: InputSignal<number> = input(0);
  percentValue: InputSignal<number> = input(0);
  strategicFlag: InputSignal<boolean> = input(false);
  progressSize: InputSignal<string> = input('12rem');
  mainBgColor: InputSignal<string> = input('var(--stc-color)');
  secondaryBgColor: InputSignal<string> = input('var(--semiGreyColor)');
  showProgress: InputSignal<boolean> = input(true);
  progressWidth: InputSignal<string> = input('');
  fontFamily: InputSignal<string> = input('');
  isWorkStream: InputSignal<boolean> = input(false);
  progressValueColor: InputSignal<string> = input('');
  secondaryValue: InputSignal<number | undefined, number | undefined> = input<
    number | undefined
  >(undefined);
  totalTD: InputSignal<number | undefined, number | undefined> = input<
    number | undefined
  >(undefined);
  // conicGradient(): string {
  //   return `conic-gradient(${this.mainBgColor()} calc(var(--pgPercentage) * 1% ), ${this.secondaryBgColor()} 0)`;
  // }
  conicGradient(): string {
    if (this.secondaryValue() && this.totalTD()) {
      const completed: number = this.progressValue();
      const underValidation: number = this.secondaryValue()!;
      const totalTD = this.totalTD();
      const completedEnd = (completed / totalTD!) * 100;
      const underValidationEnd =
        completedEnd + (underValidation / totalTD!) * 100;
      return `conic-gradient(
      ${this.mainBgColor()} 0% ${completedEnd}%,
      #86EFAC ${completedEnd}% ${underValidationEnd}%,
      ${this.secondaryBgColor()} ${underValidationEnd}% 100%
    )`;
    } else {
      return `conic-gradient(${this.mainBgColor()} calc(var(--pgPercentage) * 1% ), ${this.secondaryBgColor()} 0)`;
    }
  }
}
