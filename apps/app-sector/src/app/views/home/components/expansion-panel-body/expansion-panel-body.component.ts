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
  kpiUnit: InputSignal<string> = input('%');
  progressBarData = computed(() => {
    let data: ProgressInfo;
    // eslint-disable-next-line prefer-const
    data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue:
        this.kpiTargetValue() >= this.kpiActualValue()
          ? this.kpiTargetValue()
          : this.kpiActualValue(),
      indexes: [
        {
          caption: 'Actual',
          value: +this.kpiActualValue().toFixed(2),
          position: 'up',
        },
        {
          caption: 'Target',
          value: +this.kpiTargetValue().toFixed(2),
          position: 'down',
        },
      ],
      barColor: this.barColor(
        +this.kpiTargetValue().toFixed(2),
        +this.kpiActualValue().toFixed(2)
      ),
      bgBarColor: this.barBackgroundColor(
        +this.kpiTargetValue().toFixed(2),
        +this.kpiActualValue().toFixed(2)
      ),
      unit: this.kpiUnit(),
    };
    return data;
  });
  constructor(private router: Router) {}
  barBackgroundColor(target: number, actual: number): string {
    if (target <= actual) return ' rgba(0, 196, 140, 0.15)';
    else return 'rgba(255, 26, 26, 0.1)';
  }

  barColor(target: number, actual: number): string {
    if (target > actual) return 'var(--stc-red-color)';
    else return 'var(--stcOasisColor)';
  }

  navigateToDetails() {
    this.router.navigate(
      ['/KPI', this.kpiCode()],

      {
        state: {
          kpiCode: this.kpiCode(),
          selectedTab: this.selectedTab(),
          kpiName: this.kpiName(),
        },
      }
    );
  }

  isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value);
  }
}
