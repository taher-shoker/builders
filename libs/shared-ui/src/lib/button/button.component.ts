import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'stc-apps-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input({ required: true }) buttonText = 'BUTTON';
  @Input() buttonType: 'primary' | 'danger' | 'warn' | 'default' = 'default';
  @Input() buttonDisable = false;
  @Output() buttonAction: EventEmitter<void> = new EventEmitter();
}
