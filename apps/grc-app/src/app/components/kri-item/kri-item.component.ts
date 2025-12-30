import { Component, input, InputSignal } from '@angular/core';
import { KRIModel } from '../../models';
@Component({
  selector: 'stc-apps-kri-item',
  standalone: false,
  templateUrl: './kri-item.component.html',
  styleUrl: './kri-item.component.scss',
})
export class KriItemComponent {
  kri: InputSignal<KRIModel> = input.required<KRIModel>();
}
