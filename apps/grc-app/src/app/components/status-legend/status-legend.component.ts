import { Component, input, InputSignal } from '@angular/core';
@Component({
  selector: 'stc-apps-status-legend',
  standalone: false,
  templateUrl: './status-legend.component.html',
  styleUrl: './status-legend.component.scss',
})
export class StatusLegendComponent {
  legend: InputSignal<{ name: string; color: string }> = input.required<{
    name: string;
    color: string;
  }>();
}
