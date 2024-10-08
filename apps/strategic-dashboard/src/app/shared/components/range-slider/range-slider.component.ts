import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
@Component({
  selector: 'stc-apps-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
})
export class RangeSliderComponent implements OnInit {
  startValue: WritableSignal<number> = signal(0);
  endValue: WritableSignal<number> = signal(0);

  startValueInput: InputSignal<number> = input(0);
  endValueInput: InputSignal<number> = input(0);
  @Output() rangeChanged = new EventEmitter<any>();

  ngOnInit(): void {
    this.startValue.set(this.startValueInput());
    this.endValue.set(this.endValueInput());
  }

  formatLabel(value: number): string {
    return value.toString() || '';
  }

  onInputChangeStart(event: any) {
    this.startValue.set(Number(event.target.value));
    this.emitRangeChanged();
  }

  onInputChangeEnd(event: any) {
    this.endValue.set(Number(event.target.value));
    this.emitRangeChanged();
  }

  emitRangeChanged() {
    this.rangeChanged.emit({
      start: this.startValue(),
      end: this.endValue(),
    });
  }
}
