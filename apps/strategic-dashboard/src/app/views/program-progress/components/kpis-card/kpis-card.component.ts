import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-kpis-card',
  templateUrl: './kpis-card.component.html',
  styleUrls: ['./kpis-card.component.scss'],
})
export class KpisCardComponent {
  title: InputSignal<string> = input('');
  kpiCode: InputSignal<string> = input('1');
}
