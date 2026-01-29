import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { A3TapData } from '../../../../models/raqami.model';

@Component({
  selector: 'stc-apps-a3-tap',
  standalone: true,
  imports: [CommonModule , SharedUiModule],
  templateUrl: './a3-tap.component.html',
  styleUrl: './a3-tap.component.scss',
})
export class A3TapComponent {
  raqamiA3Data:InputSignal<A3TapData[]> = input.required<A3TapData[]>();
  colors:string[] = ["#4F008C" , "#ff6a39"];
}
