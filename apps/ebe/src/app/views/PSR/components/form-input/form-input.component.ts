import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor , FormsModule, NG_VALUE_ACCESSOR, ValidationErrors,} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'stc-apps-form-input',
  standalone: true,
  imports: [CommonModule , CalendarModule , FormsModule , DropdownModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  @Input({required : true})type!:string;
  @Input({required : true})inputType!:string;
  @Input({required : true})id!:string;
  @Input({required : true})placeholder!:string | null;
  @Input({required : true})errorMessage!:string;
  @Input()dropdownOptions!:{name:string , code:string}[];
  @Input()isBeforeStartDate = false;
  @Input()isBeforeStartDate2 = false;
  @Input()inputValue = "";
  @Input()labelName!:string;
  @Output() changeDate:EventEmitter<Date> = new EventEmitter();
  @Output() closeDate:EventEmitter<Date> = new EventEmitter();
  value = '';
  hasError = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  onInputChange(value:any): void {
    let input;
    let value2;
    if(this.inputType === 'date' || this.inputType === 'dropdown')
    {
      input = value;
      value2 = input;
    } else {
      input = value.target as HTMLInputElement;
      value2 = input.value;
    }
    this.value = value2; // Process the value
    this.onChange(value2);
    this.validateError(value2);
  }
  preventInvalidInput(event: KeyboardEvent): void {
    const invalidKeys = ['e', 'E', '+', '-'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  onBlur(): void {
    this.onTouched();
  }
  writeValue(value: string): void {
    this.value = value || '';
    this.validateError(this.value);
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
  private validateError(value: string): void {
    if(this.inputType !== 'date' && this.inputType !== 'dropdown')
    this.hasError = value.trim() === '';
  }
  // Validator logic (if used in form groups)
  validate(control: AbstractControl): ValidationErrors | null {
    return control.value?.trim() === '' ? { required: true } : null;
  }
  changeStartDate(e:Date)
  {
    this.changeDate.emit(e);
  }
  show()
  {
    this.closeDate.emit();
  }
}
