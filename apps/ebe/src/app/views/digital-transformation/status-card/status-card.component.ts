import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stc-apps-status-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.scss',
})
export class StatusCardComponent {
  status: InputSignal<string> = input.required<string>();
  backgroundColor: InputSignal<string> = input.required<string>();
  textColor: InputSignal<string> = input.required<string>();
  borderColor: InputSignal<string> = input.required<string>();
}
