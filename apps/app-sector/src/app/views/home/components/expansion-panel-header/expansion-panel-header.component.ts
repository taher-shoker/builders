import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'stc-apps-expansion-panel-header',
  templateUrl: './expansion-panel-header.component.html',
  styleUrl: './expansion-panel-header.component.scss',
})
export class ExpansionPanelHeaderComponent {
  status: InputSignal<string> = input('');
  kpisCode: InputSignal<string> = input('');
  projectHeader: InputSignal<string> = input('');
  direction: InputSignal<string> = input('');
  function: InputSignal<string> = input('');

  statusBackground(status: string): string {
    if (status.toLowerCase() === 'on track') return 'rgba(0, 196, 140, 0.15)';
    else if (
      status.toLowerCase() === 'delayed' ||
      status.toLowerCase() == 'delay'
    )
      return 'rgba(255, 26, 26, 0.1)';
    else return '';
  }
  statusColor(status: string): string {
    if (status.toLowerCase() === 'on track') return 'var(--stcOasisColor)';
    else if (
      status.toLowerCase() === 'delayed' ||
      status.toLowerCase() == 'delay'
    )
      return 'var(--stc-red-color)';
    else return '';
  }
}
