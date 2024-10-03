import { Component, input, InputSignal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-kpis-card',
  templateUrl: './kpis-card.component.html',
  styleUrls: ['./kpis-card.component.scss'],
})
export class KpisCardComponent {
  title: InputSignal<string> = input('');
  kpiCode: InputSignal<string> = input('1');
  programName: InputSignal<string> = input('');

  constructor(private router: Router) {}

  navigateToKpiDetails() {
    this.router.navigate(
      ['/home/programs', this.programName(), this.kpiCode()],
      {
        state: {
          kpi: {
            title: this.title(),
            code: this.kpiCode(),
            programName: this.programName(),
          },
        },
      }
    );
  }
}
