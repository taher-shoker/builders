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
  description =
    'The new dashborad design is much more intuitive. Love the color and layout!The new dashborad design is much more intuitive. Love the color and layout!';
  formatType(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
