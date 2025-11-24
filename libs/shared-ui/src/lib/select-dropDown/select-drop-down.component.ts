import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { ControlValueAccessorDirective } from '../control-value-accessor.directive';
import { startWith } from 'rxjs';

interface Option {
  [key: string]: string;
  value: string;
}

@Component({
  selector: 'stc-apps-select-drop-down',
  templateUrl: './select-drop-down.component.html',
  styleUrls: ['./select-drop-down.component.scss'],
  standalone : false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropDownComponent),
      multi: true,
    },
  ],
})
export class SelectDropDownComponent<T>
  extends ControlValueAccessorDirective<T>
  implements OnChanges, OnInit
{
  @ContentChildren(MatOption) queryOptions!: QueryList<MatOption>;

  @Output() selectChange = new EventEmitter<any>();

  yet!: boolean;

  @Input({ required: true }) label!: string;
  @Input() matLabel!: string;
  @Input() selectType: 'filter-select-box' | 'default' = 'default';
  @Input() options: any[] = [];
  @Input() translate = true;
  @Input() labelName = 'name';
  @Input() labelValue = 'id';
  @Input() groupName = 'groupName';
  @Input() groupOptions = 'roles';
  @Input() labelSize = 18;
  @Input() inputWidth = '';
  @Input() required = false;
  @Input() selectId: any;
  @Input() defaultAll = false;
  @Input() outputValue!: string; // if passed, the component should output this value from the object
  @Input() group = false;
  @Input() multi = false;
  @Input() searchMode = false;
  @Input() Resetting = false;
  override control = new FormControl();
  searchControl = new FormControl();

  selectedValue: any;
  filteredOptions: any[] = [];

  override ngOnInit(): void {
    // Ensure base directive initializes control first
    super.ngOnInit();
    // Re-sync initial selected value to the FormControl so mat-select displays it
    const initialValue = this.defaultAll && this.options.length > 0
      ? this.options[0][this.labelValue]
      : this.selectId;
    this.selectedValue = initialValue;
    this.filteredOptions = this.options;
    if (initialValue !== undefined) {
      this.control?.setValue(initialValue, { emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.options = changes['options'].currentValue || [];
      this.filterOptions();

      if (this.defaultAll) {
        this.options.unshift({
          id: 'all',
          [this.labelName]: '-',
        } as unknown as Option);
      }
    }
    if (this.defaultAll && this.options.length > 0) {
      this.selectedValue = this.options[0][this.labelValue];
    } else {
      this.selectedValue = this.selectId;
    }

    // Ensure the FormControl reflects the initial selected value so mat-select displays it
    if (this.selectedValue !== undefined) {
      this.control.setValue(this.selectedValue, { emitEvent: false });
    }

    this.searchControl.valueChanges
      .pipe(startWith(''))
      .subscribe((value) => this.filterOptions(value));
    document.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.target instanceof HTMLElement) {
          if (
            e.target.nodeName === 'MAT-SELECT' ||
            e.target.nodeName === 'INPUT'
          ) {
            e.stopImmediatePropagation();
          }
        }
      },
      true
    );
  }

  onChangeValue(value: any): void {
    if (value || value === 0) {
      if (value.length === 0 && this.multi && this.required) {
        this.control.addValidators(Validators.required);
        this.control.updateValueAndValidity();
      }
      // Value === 0 as it counts as false at sometimes while we need to listen to it and have it passed.
      const output = this.outputValue
        ? value[this.outputValue] || value
        : value;
      this.selectChange.emit(output);
      this.selectedValue = value;
    }
  }
  filterOptions(searchTerm = ''): void {
    if (this.group) {
      this.filteredOptions = this.options
        .map((group) => ({
          ...group,
          [this.groupOptions]: group[this.groupOptions].filter(
            (option: Option) =>
              (option[this.labelName]
                ? option[this.labelName].toString().toLowerCase()
                : ''
              ).includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((group) => group[this.groupOptions].length > 0);
    } else {
      this.filteredOptions = this.options.filter((option) =>
        (option[this.labelName]
          ? option[this.labelName].toString().toLowerCase()
          : ''
        ).includes(searchTerm.toLowerCase())
      );
    }
  }

  stopDropdownClose(event: MouseEvent): void {
    event.stopPropagation();
  }
}
