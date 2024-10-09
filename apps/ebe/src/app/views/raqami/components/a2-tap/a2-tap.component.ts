import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { A2TapData } from '../../../../models/raqami.model';

@Component({
  selector: 'stc-apps-a2-tap',
  standalone: true,
  imports: [CommonModule, SharedUiModule],
  templateUrl: './a2-tap.component.html',
  styleUrl: './a2-tap.component.scss',
})
export class A2TapComponent {
  colors:string[] = ["#4F008C" , "#ff6a39"];
  A1Data:InputSignal<A2TapData[]> = input.required<A2TapData[]>();
}
