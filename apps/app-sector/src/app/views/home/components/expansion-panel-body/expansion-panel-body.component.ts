import {
  Component,
  InputSignal,
  WritableSignal,
  computed,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProgressInfo } from 'libs/shared-ui/src/lib/progress-bar/progress-bar.component';

@Component({
  selector: 'stc-apps-expansion-panel-body',
  templateUrl: './expansion-panel-body.component.html',
  styleUrl: './expansion-panel-body.component.scss',
})
export class ExpansionPanelBodyComponent {
  percentage: InputSignal<number> = input(0);
  kpiCode: InputSignal<string> = input('');
  kpiName: InputSignal<string> = input('');
  listItems = [
    {
      section: 'left',
      items: [
        { label: 'Weight:', value: '15%' },
        { label: 'Unit:', value: '%' },
      ],
    },
    {
      section: 'right',
      items: [
        { label: 'Actual perf%:', value: '87.69 %' },
        { label: 'Applied perf%:', value: '87.69 %' },
      ],
    },
  ];
  reportData: WritableSignal<any | undefined> = signal(undefined);
  progressBarData = computed(() => {
    let data: ProgressInfo;
    // eslint-disable-next-line prefer-const
    data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: 85.0,
      indexes: [
        {
          caption: 'Actual',
          value: 30.0,
          position: 'up',
        },
        {
          caption: 'Target',
          value: 85.0,
          position: 'down',
        },
      ],
      barColor: '#c82a27',
      bgBarColor: '#c82a271a',
    };

    return data;
  });
  constructor(private router: Router) {}
  navigateToDetails() {
    this.router.navigate(['/details'], {
      state: { kpiCode: this.kpiCode() },
    });
  }
}
