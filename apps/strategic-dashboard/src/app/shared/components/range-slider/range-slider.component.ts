import { Component, input, InputSignal } from '@angular/core';
@Component({
  selector: 'stc-apps-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
})
export class RangeSliderComponent {
  startValue: InputSignal<number> = input(0);
  endValue: InputSignal<number> = input(0);

  formatLabel(value: number): string {
    return value.toString() || '';
  }
}
