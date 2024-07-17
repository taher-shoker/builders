import { Component, input, InputSignal } from '@angular/core';
@Component({
  selector: 'stc-apps-solid-circular-bar',
  standalone: false,
  templateUrl: './solid-circular-bar.component.html',
  styleUrl: './solid-circular-bar.component.scss',
})
export class SolidCircularBarComponent {
  percentVal:InputSignal<number> = input.required<number>()
  subTitle:InputSignal<string> = input<string>('')
  circleBackground:InputSignal<string> = input<string>('')
}
