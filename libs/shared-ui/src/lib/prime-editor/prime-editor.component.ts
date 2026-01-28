import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'stc-apps-prime-editor',
  standalone: false,
  template: `
    <p-editor
      [(ngModel)]="value"
      (ngModelChange)="onModelChange($event)"
      (onTextChange)="onTouched()"
      [readonly]="readonly"
      [style]="{ height: editorHeight }"
      [modules]="modules"
    >
    </p-editor>
  `,
  styleUrls: ['./prime-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimeEditorComponent),
      multi: true,
    },
  ],
})
export class PrimeEditorComponent implements ControlValueAccessor {
  @Input() readonly = false;
  @Input() editorHeight = '160px';

  value = '';
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  private onChange: (val: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }

  onModelChange(val: string) {
    this.value = val;
    this.onChange(val);
  }
}
