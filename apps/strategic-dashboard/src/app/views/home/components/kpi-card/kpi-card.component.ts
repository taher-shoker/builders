import {
  Component,
  input,
  Input,
  InputSignal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'stc-apps-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent implements OnChanges {
  title = 'Digitize STC';
  iconPath = 'assets/images/interaction-icon.svg';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() currentContents: any[] = [];
  kpiName='preformance';
  // currentContents: WritableSignal<any> = signal([]);
  kpiTitle: InputSignal<string> = input('');
  // activeIndex: InputSignal<number | any> = input(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentContents']) {
      this.currentContents = changes['currentContents'].currentValue;
    }
  }

  get isStringContent(): boolean {
    return typeof this.currentContents[0] === 'string';
  }

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
