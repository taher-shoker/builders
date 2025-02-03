import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-split-button',
  standalone: false,
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.scss'],
})
export class SplitButtonComponent {
  label: InputSignal<string> = input('');
  labelIcon: InputSignal<string> = input('');
  model: InputSignal<any> = input([]);
  outlined: InputSignal<boolean> = input(false);
  buttonSeverity: InputSignal<'primary' | 'secondary' | 'warning' | 'success'> =
    input<'primary' | 'secondary' | 'warning' | 'success'>('primary');
}
