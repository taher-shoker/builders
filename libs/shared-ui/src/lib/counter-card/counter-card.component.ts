import { Component, Input } from '@angular/core';


@Component({
  selector: 'stc-apps-counter-card',
  templateUrl: './counter-card.component.html',
  styleUrls: ['./counter-card.component.scss'],
  standalone : false
})
export class CounterCardComponent {
  @Input({required: true}) count = 0;
  @Input({required: true}) caption = "";
  @Input({required: true}) iconClass = "";
  @Input({required: true}) iconBgColor = "";
  @Input() captionColor = undefined;

}
