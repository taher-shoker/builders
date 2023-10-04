/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input } from '@angular/core';
import { KpiItem } from '../../models/http-response.model';

@Component({
  selector: 'stc-apps-kpis-card',
  templateUrl: './kpis-card.component.html',
  styleUrls: ['./kpis-card.component.scss'],
})
export class KpisCardComponent {
  @Input() currentActiveCardID: string = '';
  @Input() cardData!: KpiItem;
}
