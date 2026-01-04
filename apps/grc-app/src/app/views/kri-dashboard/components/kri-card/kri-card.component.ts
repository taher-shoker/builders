import { Component, input, InputSignal } from '@angular/core';
import { IQuarterTrend } from '../../../../models/db';
@Component({
  selector: 'stc-apps-kri-card',
  standalone: false,
  templateUrl: './kri-card.component.html',
  styleUrl: './kri-card.component.scss',
})
export class KriCardComponent {
  quarterTrend: InputSignal<IQuarterTrend> = input.required<IQuarterTrend>();
}
