import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'stc-apps-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input({ required: true }) buttonText = 'BUTTON';
  @Input() buttonType:
    | 'primary'
    | 'danger'
    | 'warn'
    | 'success'
    | 'danger-outline'
    | 'gray-outline'
    | 'default' = 'default';
  @Input() actionType: 'button' | 'submit' = 'button';
  @Input() buttonDisable = false;
  @Input() loading = false;
  @Input() buttonIcon = '';
  @Output() btnClick: EventEmitter<void> = new EventEmitter();

  onClick() {
    this.btnClick.emit();
  }
}
