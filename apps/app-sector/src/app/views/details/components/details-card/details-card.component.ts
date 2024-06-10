import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'stc-apps-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.scss']
})
export class DetailsCardComponent {
  title: InputSignal<string> = input('');
  description: InputSignal<string | any> = input('');

  isDescriptionString(): boolean {
    return typeof this.description() === 'string';
  }
}
