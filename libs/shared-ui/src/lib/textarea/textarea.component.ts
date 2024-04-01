import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorDirective } from '../control-value-accessor.directive';

@Component({
  selector: 'stc-apps-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputName!: string;
  @Input() inputId!: string;
  @Input() inputPlaceholder!: string;
  @Input() inputType: 'text' | 'password' = 'text';
  @Input() inputIcon!: string;
  @Input() required!: boolean;

  @Output() valueKeyDown: EventEmitter<KeyboardEvent> =
    new EventEmitter<KeyboardEvent>();

  onKeyDown(event: KeyboardEvent) {
    this.valueKeyDown.emit(event);
  }
}
