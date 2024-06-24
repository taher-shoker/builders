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
  selector: 'stc-apps-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() label!: string;
  @Input() required!: boolean;
  @Input() disabled = false;
  @Input({ required: true }) name!: string;
  @Output() selectChange = new EventEmitter<any>();

  onChangeValue(value: any) {
    this.selectChange.emit({ name: value.source.name, value: value.checked });
  }
}
