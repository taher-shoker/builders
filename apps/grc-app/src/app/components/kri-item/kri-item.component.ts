import { Component, input, InputSignal } from '@angular/core';
import { UnacceptableProjectDetails } from '../../models';
@Component({
  selector: 'stc-apps-kri-item',
  standalone: false,
  templateUrl: './kri-item.component.html',
  styleUrl: './kri-item.component.scss',
})
export class KriItemComponent {
  kri: InputSignal<UnacceptableProjectDetails> =
    input.required<UnacceptableProjectDetails>();
}
