import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ControlValueAccessorDirective } from '../control-value-accessor.directive';

@Component({
  selector: 'stc-apps-numeric-input',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericInputComponent),
      multi: true,
    },
  ],
})
export class NumericInputComponent
  extends ControlValueAccessorDirective<string>
  implements OnInit, OnChanges
{
  @Input() inputName!: string;
  @Input() inputId!: string;
  @Input() inputPlaceholder!: string;
  @Input() disabled = false;
  @Input() className = '';
  @Input() allowDecimal = true;
  @Input() allowNegative = false;
  @Input() disallowZero = false;
  @Input() min?: number;
  @Input() max?: number;
  @Output() valueKeyDown: EventEmitter<KeyboardEvent> =
    new EventEmitter<KeyboardEvent>();

  override ngOnInit(): void {
    super.ngOnInit();
    this.applyValidators();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allowDecimal'] || changes['allowNegative'] || changes['disallowZero'] || changes['min'] || changes['max']) {
      this.applyValidators();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];
    const isCtrlA = event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey);
    const isCtrlC = event.key.toLowerCase() === 'c' && (event.ctrlKey || event.metaKey);
    const isCtrlV = event.key.toLowerCase() === 'v' && (event.ctrlKey || event.metaKey);
    const isCtrlX = event.key.toLowerCase() === 'x' && (event.ctrlKey || event.metaKey);

    if (
      allowedKeys.includes(event.key) ||
      isCtrlA ||
      isCtrlC ||
      isCtrlV ||
      isCtrlX
    ) {
      this.valueKeyDown.emit(event);
      return;
    }

    // Block '+' and scientific notation; allow '-' only when allowNegative
    if (event.key === '+' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
      return;
    }

    if (event.key === '-') {
      if (!this.allowNegative) {
        event.preventDefault();
        return;
      }
      const input = event.target as HTMLInputElement;
      const hasSign = input.value.startsWith('-');
      const caret = input.selectionStart ?? 0;
      if (hasSign || caret !== 0) {
        event.preventDefault();
        return;
      }
      // allow single leading '-'
      this.valueKeyDown.emit(event);
      return;
    }

    const input = event.target as HTMLInputElement;
    const isDigit = /\d/.test(event.key);
    const isDot = event.key === '.';
    const alreadyHasDot = input.value.includes('.');

    if (!isDigit && !(this.allowDecimal && isDot && !alreadyHasDot)) {
      event.preventDefault();
      return;
    }

    this.valueKeyDown.emit(event);
  }

  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') ?? '';
    const sanitized = this.sanitizeInput(pasted, this.control?.value ?? '');
    if (sanitized !== pasted) {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      const before = target.value.substring(0, target.selectionStart ?? 0);
      const after = target.value.substring(target.selectionEnd ?? 0);
      const nextValue = before + sanitized + after;
      this.control?.setValue(nextValue);
    }
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const sanitized = this.sanitizeInput(target.value, '');
    if (sanitized !== target.value) {
      target.value = sanitized;
      this.control?.setValue(sanitized);
    }
  }

  private sanitizeInput(text: string, current: string): string {
    // Allow optional leading '-' when allowNegative
    let cleaned = text.replace(/[^\d.\-]/g, '');
    let sign = '';
    if (this.allowNegative && cleaned.startsWith('-')) {
      sign = '-';
    }
    // remove all other '-' occurrences
    cleaned = cleaned.replace(/\-/g, '');
    if (!this.allowDecimal) cleaned = cleaned.replace(/\./g, '');
    const firstDotIndex = cleaned.indexOf('.');
    if (firstDotIndex === -1) return sign + cleaned;
    const digitsOnly = cleaned.replace(/\./g, '');
    return sign + digitsOnly.substring(0, firstDotIndex) + '.' + digitsOnly.substring(firstDotIndex);
  }

  private applyValidators(): void {
    if (!this.control) return;
    const newValidators = [] as any[];
    const numberBody = this.allowDecimal ? '\\d+(?:\\.\\d+)?' : '\\d+';
    const regex = this.allowNegative ? new RegExp('^-?' + numberBody + '$') : new RegExp('^' + numberBody + '$');
    newValidators.push(Validators.pattern(regex));
    if (this.disallowZero) {
      newValidators.push((control: any) => {
        const raw = control?.value;
        if (raw == null || raw === '') return null;
        const num = Number(String(raw));
        if (!Number.isFinite(num)) return null;
        return num === 0 ? { notZero: true } : null;
      });
    }
    if (typeof this.min === 'number') newValidators.push(Validators.min(this.min));
    if (typeof this.max === 'number') newValidators.push(Validators.max(this.max));

    // Preserve any existing validators (e.g., required) set on the form control
    const existing = this.control.validator ? [this.control.validator] : [];
    const composed = Validators.compose([...existing, ...newValidators]) ?? null;
    this.control.setValidators(composed);
    this.control.updateValueAndValidity({ emitEvent: false });
  }
}