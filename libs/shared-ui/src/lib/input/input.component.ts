import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorDirective } from '../control-value-accessor.directive';
export interface FormFieldValue {
  name: string;
}
@Component({
  selector: 'stc-apps-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputName!: string;
  @Input() inputId!: string;
  @Input() inputPlaceholder!: string;
  @Input() inputType: 'text' | 'password' | 'date' = 'text';
  @Input() inputIcon!: string;
  @Input() required!: boolean;
  @Input() disabled = false;
  @Input() selfServiceMsg = false;
  @Output() valueKeyDown: EventEmitter<KeyboardEvent> =
    new EventEmitter<KeyboardEvent>();

  showPassword = false;

  onKeyDown(event: KeyboardEvent) {
    this.valueKeyDown.emit(event);
  }
  toggelPassword(): void {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }
}
