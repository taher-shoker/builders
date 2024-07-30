import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-kpis-card',
  templateUrl: './kpis-card.component.html',
  styleUrls: ['./kpis-card.component.scss'],
})
export class KpisCardComponent {
  title: InputSignal<string> = input('');
  id: InputSignal<number> = input(0);
}
