/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { PerformanceCard } from '../../models/performance-card.model';

@Component({
  selector: 'stc-apps-kpis-card',
  templateUrl: './kpis-card.component.html',
  styleUrls: ['./kpis-card.component.scss'],
})
export class KpisCardComponent {
  @Output() cardClick: EventEmitter<string> = new EventEmitter<string>();
  @Input() currentActiveCardID: string = '';
  @Input() cardData!: PerformanceCard;

  notifyParent(id: string){
    this.cardClick.emit(id)
  }
}
