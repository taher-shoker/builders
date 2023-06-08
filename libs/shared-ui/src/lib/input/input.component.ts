import { Component, Input } from '@angular/core';

@Component({
  selector: 'stc-apps-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() inputName!: string;
  @Input() inputId!: string;
  @Input() inputPlaceholder!: string;
  @Input() inputType: 'text' | 'password' = 'text';
  @Input() inputIcon!: string;
}
