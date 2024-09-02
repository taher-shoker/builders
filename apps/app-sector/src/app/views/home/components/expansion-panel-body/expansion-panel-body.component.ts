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
import { KpiDTO, Section } from '../../../models/SectorKpisDetails.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'stc-apps-expansion-panel-body',
  templateUrl: './expansion-panel-body.component.html',
  styleUrl: './expansion-panel-body.component.scss',
})
export class ExpansionPanelBodyComponent {
  // target = 50;
  // actual = 80;
  // ceilingg = 80;
  // unit = '#';
  // newTarget = 0;
  // newActual = 0;
  kpiObject: InputSignal<KpiDTO> = input({} as KpiDTO);
  selectedTab: InputSignal<string> = input('');
  listItems: InputSignal<Section[] | any> = input([]);

  reportData: WritableSignal<any | undefined> = signal(undefined);

  progressActual = 0;
  progressTraget = 0;
  progressBarData = computed(() => {
    console.log(this.kpiObject());
    this.progressTraget = this.calculatingProgressValues()[0]
      ? this.calculatingProgressValues()[0]
      : this.kpiObject().target;
    this.progressActual = this.calculatingProgressValues()[1]
      ? this.calculatingProgressValues()[1]
      : this.kpiObject().actualValue;
    let data: ProgressInfo;
    // eslint-disable-next-line prefer-const
    data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue:
        this.progressTraget >= this.progressActual
          ? this.progressTraget
          : this.progressActual,
      indexes: [
        {
          caption: 'Actual',
          value: +this.kpiObject().actualValue.toFixed(2),
          progressValue: this.progressActual,
          position: 'up',
        },
        {
          caption: 'Target',
          value: +this.kpiObject().target.toFixed(2),
          progressValue: this.progressTraget,
          position: 'down',
        },
      ],
      barColor: this.barColor(
        +this.kpiObject().target,
        +this.kpiObject().actualValue
      ),
      bgBarColor: this.barBackgroundColor(
        +this.kpiObject().target,
        +this.kpiObject().actualValue
      ),
      unit: this.kpiObject().unit,
    };
    return data;
  });
  constructor(private router: Router, private cookieService: CookieService) {}
  calculatingProgressValues(): number[] {
    const progressValues: number[] = [];
    let progressTraget = 0;
    let progressActual = 0;
    if (!this.kpiObject().unit.includes('%')) {
      // the target and actual values progress.
      progressTraget = +(
        (this.kpiObject().target / this.kpiObject().ceiling) *
        100
      ).toFixed(2);
      progressActual = +(
        (this.kpiObject().actualValue / this.kpiObject().ceiling) *
        100
      ).toFixed(2);

      this.progressTraget = Math.abs(this.progressTraget);
      this.progressActual = Math.abs(this.progressActual);
      progressValues.push(progressTraget);
      progressValues.push(progressActual);
    }
    return progressValues;
  }
  barBackgroundColor(target: number, actual: number): string {
    if (target <= actual) return ' rgba(0, 196, 140, 0.15)';
    else return 'rgba(255, 26, 26, 0.1)';
  }

  barColor(target: number, actual: number): string {
    if (target > actual) return 'var(--stc-red-color)';
    else return 'var(--stcOasisColor)';
  }

  navigateToDetails() {
    console.log(this.cookieService.get('sectorName'));
    this.cookieService.set('kpiCode', this.kpiObject().kpiCode);
    this.router.navigate([
      '/sectors',
      this.cookieService.get('sectorName'),
      'KPI',
      this.kpiObject().kpiCode,
    ]);
  }

  isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value);
  }
}
