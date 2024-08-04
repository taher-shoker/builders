import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  implements OnChanges
{
  @ContentChildren(MatOption) queryOptions!: QueryList<MatOption>;

  @Output() selectChange = new EventEmitter<any>();

  yet!: boolean;

  @Input({ required: true }) label!: string;
  @Input() selectType: 'filter-select-box' | 'default' = 'default';
  @Input() options: any[] = [];
  @Input() labelName = 'name';
  @Input() labelValue = 'id';
  @Input() groupName = 'groupName';
  @Input() groupOptions = 'roles';
  @Input() labelSize = 18;
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

    this.searchControl.valueChanges
      .pipe(startWith(''))
      .subscribe((value) => this.filterOptions(value));
  }

  onChangeValue(value: any): void {
    if (value) {
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
