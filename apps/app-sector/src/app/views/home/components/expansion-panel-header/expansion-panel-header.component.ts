import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'stc-apps-expansion-panel-header',
  templateUrl: './expansion-panel-header.component.html',
  styleUrl: './expansion-panel-header.component.scss',
})
export class ExpansionPanelHeaderComponent {
  status: InputSignal<any> = input('');
  kpisCode: InputSignal<any> = input('');
  projectHeader: InputSignal<any> = input('');
  direction: InputSignal<any> = input('');
  function: InputSignal<any> = input('');

  statusBackground(status: string): string {
    if (status.toLowerCase() === 'on track') return 'rgba(0, 196, 140, 0.15)';
    else if (status.toLowerCase() === 'delayed')
      return 'rgba(255, 26, 26, 0.1)';
    else return '';
  }
  statusColor(status: string): string {
    if (status.toLowerCase() === 'on track') return 'var(--stcOasisColor)';
    else if (status.toLowerCase() === 'delayed') return 'var(--stc-red-color)';
    else return '';
  }
}
