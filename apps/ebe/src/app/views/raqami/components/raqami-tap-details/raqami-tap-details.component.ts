import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapModel } from '../../../../models/scorecard.model';
import { A1TapComponent } from '../a1-tap/a1-tap.component';
import { A2TapComponent } from '../a2-tap/a2-tap.component';
import { A3TapComponent } from '../a3-tap/a3-tap.component';

@Component({
  selector: 'stc-apps-raqami-tap-details',
  standalone: true,
  imports: [CommonModule , A1TapComponent , A2TapComponent , A3TapComponent],
  templateUrl: './raqami-tap-details.component.html',
  styleUrl: './raqami-tap-details.component.scss',
})
export class RaqamiTapDetailsComponent {
  currentTap:InputSignal<TapModel> = input.required<TapModel>();
}
