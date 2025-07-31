import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-logs-expansion-header',
  templateUrl: './logs-expansion-header.component.html',
  styleUrl: './logs-expansion-header.component.scss',
})
export class LogsExpansionHeaderComponent {
  type: InputSignal<string> = input('');
  title: InputSignal<string> = input('');
  subTitle: InputSignal<string> = input('');
  count: InputSignal<number> = input(0);
  date: InputSignal<string> = input('');
}
