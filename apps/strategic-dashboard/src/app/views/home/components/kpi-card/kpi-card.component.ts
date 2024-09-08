import { Component, input, Input, InputSignal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  title = 'Digitize STC';
  iconPath = 'assets/images/interaction-icon.svg';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() currentContents: any;
  kpiName = 'preformance';
  // currentContents: WritableSignal<any> = signal([]);
  kpiTitle: InputSignal<string> = input('');
  strategicName: InputSignal<string> = input('');
  isHovered: InputSignal<boolean> = input(false);
  strategicGroupKpis: InputSignal<any[] | any> = input([]);

  // activeIndex: InputSignal<number | any> = input(null);
  constructor(private router: Router) {}

  getPercentageClass(
    actualValue: number,
    thresholds: { green: number; orange: number; red: number }
  ): string {
    if (actualValue >= thresholds.green) {
      return 'greater-than-green';
    } else if (actualValue < thresholds.red) {
      return 'less-than-red';
    } else {
      return 'between-orange';
    }
  }
  navigateToCardDetails() {
    this.router.navigate(['/details'], {
      state: { title: this.kpiTitle() },
    });
  }
  getFilteredContents(): any[] {
    const title = this.kpiTitle();
    return this.currentContents.filter(
      (content: any) => content.name === title
    );
  }

  getStrategicGroupKpisByKpiName(kpiName: string): any[] {
    const kpis = this.strategicGroupKpis();
    return kpis[0][kpiName];
  }
}
