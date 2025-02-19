import { Component, forwardRef, input, InputSignal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'stc-apps-input-group',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputGroupComponent),
      multi: true,
    },
  ],
  templateUrl: './input-group.component.html',
  styleUrls: ['./input-group.component.scss'],
})
export class InputGroupComponent implements ControlValueAccessor {
  placeholder: InputSignal<string> = input<string>('');
  addonText: InputSignal<string> = input<string>('');
  control!: FormControl;

  private _value = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  set value(val: string) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  get value(): string {
    return this._value;
  }

  writeValue(value: string): void {
    this._value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if the input needs to be disabled
  }
}
