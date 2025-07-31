import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-logs-expansion-body',
  templateUrl: './logs-expansion-body.component.html',
  styleUrl: './logs-expansion-body.component.scss',
})
export class LogsExpansionBodyComponent {
  desc: InputSignal<string> = input('');
  attachaments: InputSignal<string> = input('');
}
