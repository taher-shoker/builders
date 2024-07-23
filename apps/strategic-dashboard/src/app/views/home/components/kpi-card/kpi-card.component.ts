import { Component, effect, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  cardDetails: InputSignal<string[]> = input(['']);
  title = 'Digitize STC';
  iconPath = 'assets/images/interaction-icon.svg';
  constructor() {
    effect(() => {
      if (this.cardDetails()) {
        console.log(this.cardDetails());
      }
    });
  }
}
