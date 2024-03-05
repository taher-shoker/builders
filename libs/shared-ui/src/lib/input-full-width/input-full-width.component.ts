/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'stc-apps-input-full-width',
  templateUrl: './input-full-width.component.html',
  styleUrls: ['./input-full-width.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputFullWidthComponent,
    },
  ],
})
export class InputFullWidthComponent {
  @Output() currentText: EventEmitter<string> = new EventEmitter<string>();

  label = input.required();
  placeholder = input('');

  type = input('text');
  required = input(false);

  value!: any;
  touched = false;
  disabled = false;

  onValueChange = (val: any) => {};

  onTouched = () => {};

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  sendInputTextToParent(text: string) {
    this.currentText.emit(text);
  }

  autoExpand() {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    // Reset the rows to 1 to allow it to shrink if needed
    textarea.rows = 1;
    // Set the rows based on the scrollHeight divided by the line height
    textarea.rows = Math.ceil(
      textarea.scrollHeight / parseFloat(getComputedStyle(textarea).lineHeight)
    );
  }
}
