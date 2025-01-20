import {
  Component,
  EventEmitter,
  forwardRef,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'stc-apps-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterDropdownComponent),
      multi: true,
    },
  ],
})
export class FilterDropdownComponent implements ControlValueAccessor {
  dropdownOptions: InputSignal<{ label: string; value: any }[]> = input<
    { label: string; value: any }[]
  >([]);
  placeholder: InputSignal<string> = input('');
  selectedValue: InputSignal<any> = input(null);

  @Output() valueChange = new EventEmitter();

  value: any;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onValueChange(event: any) {
    this.value = event;
    this.onChange(event);
    this.onTouched();
    this.valueChange.emit(event);
  }
}
