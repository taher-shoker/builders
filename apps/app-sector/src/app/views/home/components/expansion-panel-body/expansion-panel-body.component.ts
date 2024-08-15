import {
  Component,
  InputSignal,
  WritableSignal,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProgressInfo } from 'libs/shared-ui/src/lib/progress-bar/progress-bar.component';
import { Section } from '../../../models/SectorKpisDetails.model';

@Component({
  selector: 'stc-apps-expansion-panel-body',
  templateUrl: './expansion-panel-body.component.html',
  styleUrl: './expansion-panel-body.component.scss',
})
export class ExpansionPanelBodyComponent {
  percentage: InputSignal<number> = input(0);
  kpiStatus: InputSignal<string> = input('');
  kpiCode: InputSignal<string> = input('');
  kpiName: InputSignal<string> = input('');
  selectedTab: InputSignal<string> = input('');
  listItems: InputSignal<Section[] | any> = input([]);
  kpiActualValue: InputSignal<number> = input(0);
  kpiTargetValue: InputSignal<number> = input(0);
  reportData: WritableSignal<any | undefined> = signal(undefined);
  progressBarData = computed(() => {
    let data: ProgressInfo;
    // eslint-disable-next-line prefer-const
    data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: this.kpiTargetValue() * 100,
      indexes: [
        {
          caption: 'Actual',
          value: +(this.kpiActualValue() * 100).toFixed(2),
          position: 'up',
        },
        {
          caption: 'Target',
          value: +(this.kpiTargetValue() * 100).toFixed(2),
          position: 'down',
        },
      ],
      barColor: this.barColor(this.kpiStatus()),
      bgBarColor: this.barBackgroundColor(this.kpiStatus()),
    };
    return data;
  });
  constructor(private router: Router) {}
  barBackgroundColor(status: string): string {
    if (status.toLowerCase() === 'on track') return 'rgba(0, 196, 140, 0.15)';
    else if (status.toLowerCase() === 'delayed')
      return 'rgba(255, 26, 26, 0.1)';
    else return '';
  }
  barColor(status: string): string {
    if (status.toLowerCase() === 'on track') return 'var(--stcOasisColor)';
    else if (status.toLowerCase() === 'delayed') return 'var(--stc-red-color)';
    else return '';
  }
  navigateToDetails() {
    this.router.navigate(['/details', this.kpiName()], {
      state: { kpiCode: this.kpiCode(), selectedTab: this.selectedTab() },
    });
  }

  isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value);
  }
}
